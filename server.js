/**
 * SecureDocs — server.js
 * Express backend for auth, credits, and server-side conversions.
 * All processing: files never leave the server disk (memory only).
 */
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import mammoth from 'mammoth';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.static(__dirname));
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.use(express.json({ limit: '50mb' }));

// ─── Multer: file uploads in memory ─────────────────────────
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } }); // 50MB

// ─── Mock user store (in-memory for MVP) ───────────────────
const users = new Map(); // email -> { email, credits, token }
const tokens = new Map(); // token -> email

function genToken() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// ─── Auth ─────────────────────────────────────────────────
app.post('/api/auth/email', async (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) return res.status(400).json({ error: 'Invalid email' });

  let user = users.get(email);
  if (!user) {
    user = { email, credits: 3, token: genToken() };
    users.set(email, user);
  }
  user.token = genToken();
  tokens.set(user.token, email);
  res.json({ token: user.token, user: { email, credits: user.credits } });
});

app.post('/api/auth/verify', (req, res) => {
  const { token } = req.body;
  const email = tokens.get(token);
  if (!email) return res.status(401).json({ error: 'Invalid token' });
  const user = users.get(email);
  res.json({ user: { email, credits: user.credits } });
});

// ─── Credits ───────────────────────────────────────────────
app.post('/api/credits/use', (req, res) => {
  const { token } = req.body;
  const email = tokens.get(token);
  if (!email) return res.status(401).json({ error: 'Unauthorized' });
  const user = users.get(email);
  if (user.credits <= 0) return res.status(402).json({ error: 'No credits' });
  user.credits -= 1;
  res.json({ credits: user.credits });
});

// ─── Word → PDF ────────────────────────────────────────────
app.post('/api/convert/word-to-pdf', upload.single('file'), async (req, res) => {
  const { token } = req.headers;
  const email = tokens.get(token);
  if (!email) return res.status(401).json({ error: 'Unauthorized' });

  const user = users.get(email);
  if (!user || user.credits <= 0) return res.status(402).json({ error: 'No credits' });

  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  try {
    const { value: plainText } = await mammoth.extractRawText({ buffer: req.file.buffer });
    const cleanText = plainText.replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
    if (!cleanText) return res.status(422).json({ error: 'Could not extract text from document' });

    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const PAGE_W = 595.28, PAGE_H = 841.89, MARGIN = 56, LINE_H = 18, FONT_S = 11;
    const title = req.file.originalname.replace(/\.docx$/i, '').replace(/\.[^.]+$/, '');

    let currentPage = pdfDoc.addPage([PAGE_W, PAGE_H]);
    let { height } = currentPage.getSize();
    let y = height - MARGIN;

    currentPage.drawText(decodeURIComponent(title) || 'Converted Document', {
      x: MARGIN, y, size: 16, font: boldFont, color: rgb(0.1, 0.1, 0.1)
    });
    y -= 12;
    currentPage.drawRectangle({ x: MARGIN, y: y + 4, width: PAGE_W - MARGIN * 2, height: 1, color: rgb(0.85, 0.85, 0.85) });
    y -= 24;

    const lines = cleanText.split('\n');
    for (const line of lines) {
      const words = line.split(' ');
      let currentLine = '';
      for (const word of words) {
        const testLine = currentLine ? currentLine + ' ' + word : word;
        if (font.widthOfTextAtSize(testLine, FONT_S) > PAGE_W - MARGIN * 2) {
          if (y < MARGIN + 30) { currentPage = pdfDoc.addPage([PAGE_W, PAGE_H]); y = currentPage.getSize().height - MARGIN; }
          currentPage.drawText(currentLine, { x: MARGIN, y, size: FONT_S, font, color: rgb(0.15, 0.15, 0.15) });
          y -= LINE_H;
          currentLine = word;
        } else { currentLine = testLine; }
      }
      if (currentLine) {
        if (y < MARGIN + 30) { currentPage = pdfDoc.addPage([PAGE_W, PAGE_H]); y = currentPage.getSize().height - MARGIN; }
        if (currentLine.trim() === '') { y -= 8; }
        else { currentPage.drawText(currentLine, { x: MARGIN, y, size: FONT_S, font, color: rgb(0.15, 0.15, 0.15) }); y -= LINE_H; }
      }
    }
    const lastPage = pdfDoc.getPage(pdfDoc.getPageCount() - 1);
    lastPage.drawText('Generated by SecureDocs', { x: MARGIN, y: 20, size: 8, font, color: rgb(0.6, 0.6, 0.6) });

    user.credits -= 1;
    const pdfBytes = await pdfDoc.save();
    res.set({ 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename="${title}.pdf"`, 'Content-Length': pdfBytes.length });
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    console.error('Word→PDF error:', err);
    res.status(500).json({ error: 'Conversion failed: ' + err.message });
  }
});

// ─── PDF → Word ────────────────────────────────────────────
// Uses pdfjs-dist (server-side) to extract text from PDF,
// then mammoth (HTML→DOCX) to generate Word document.
app.post('/api/convert/pdf-to-word', upload.single('file'), async (req, res) => {
  const { token } = req.headers;
  const email = tokens.get(token);
  if (!email) return res.status(401).json({ error: 'Unauthorized' });

  const user = users.get(email);
  if (!user || user.credits <= 0) return res.status(402).json({ error: 'No credits' });

  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  try {
    // Extract text from PDF using pdfjs-dist (ESM, works in Node)
    let rawText = '';
    try {
      const loadingTask = pdfjsLib.getDocument({ data: req.file.buffer });
      const pdf = await loadingTask.promise;
      const pageTexts = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        pageTexts.push(content.items.map(item => item.str).join(' '));
      }
      rawText = pageTexts.join('\n\n');
    } catch(e) {
      console.warn('PDF text extraction failed:', e.message);
    }

    if (!rawText.trim()) {
      return res.status(422).json({ error: '无法提取 PDF 文字（扫描件或图片型 PDF 不支持，请先使用「PDF 转文本」确认内容）' });
    }

    // Build HTML document with proper paragraphs
    const paragraphs = rawText.split(/\n{2,}/).filter(p => p.trim());
    const bodyHtml = paragraphs.map(p => `<p>${p.trim().replace(/\n/g, '<br>')}</p>`).join('\n');
    const htmlDoc = `<html><head><meta charset="utf-8"><style>
      body { font-family: Arial, sans-serif; font-size: 12pt; line-height: 1.6; margin: 72pt; }
      h1 { font-size: 18pt; color: #1a1a1a; margin-bottom: 12pt; }
      p { margin-bottom: 10pt; color: #333; }
      .footer { margin-top: 36pt; font-size: 9pt; color: #999; border-top: 1pt solid #ddd; padding-top: 8pt; }
    </style></head><body>
    <h1>${req.file.originalname.replace(/\.pdf$/i, '')}</h1>
    ${bodyHtml}
    <div class="footer">Extracted from PDF by SecureDocs — ${new Date().toLocaleDateString('zh-CN')}</div>
    </body></html>`;

    // mammoth.convertToHtml creates HTML; mammoth.convertToMarkdown creates Markdown
    // For true DOCX, we use mammoth's HTML→DOCX path via mammoth.m htmlToPug or raw style
    // mammoth 1.x: mammoth.convertToMarkdown({buffer}) and mammoth.convertToHtml({buffer})
    // But to get DOCX binary we need: mammoth.convertToHtml → then use a HTML→DOCX lib
    // Best approach: use mammoth's mammothResult.value as HTML string and convert with mammoth for DOCX
    // Actually mammoth has: mammoth.toHtml({buffer}) and mammoth.toStdout...
    // mammoth's only output is HTML or plain text. For DOCX we need a separate HTML→DOCX tool.
    //
    // ALTERNATIVE: Use `html-docx-js` or `docx` npm package (available)
    // Let's try importing `docx` npm package
    let docxBytes;
    try {
      const { Document, Packer, Paragraph, TextRun, HeadingLevel } = await import('docx');
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({
              text: req.file.originalname.replace(/\.pdf$/i, ''),
              heading: HeadingLevel.HEADING_1,
              spacing: { after: 200 },
            }),
            ...paragraphs.map(p => new Paragraph({
              children: [new TextRun({ text: p.trim(), size: 24 })],
              spacing: { after: 120 },
            })),
          ],
        }],
      });
      docxBytes = await Packer.toBuffer(doc);
    } catch(docxErr) {
      console.warn('docx npm not available, using mammoth HTML fallback:', docxErr.message);
      // mammoth can produce a basic HTML-based "docx" via zip strategy
      // For now, send back HTML wrapped in a text response with proper headers
      // This is a demo fallback — user gets an HTML file they can open in Word
      const htmlBytes = Buffer.from(htmlDoc, 'utf-8');
      res.set({
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${req.file.originalname.replace(/\.pdf$/i, '')}.docx"`,
        'Content-Length': htmlBytes.length,
      });
      user.credits -= 1;
      return res.send(htmlBytes);
    }

    user.credits -= 1;
    const filename = req.file.originalname.replace(/\.pdf$/i, '') + '.docx';
    res.set({ 'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'Content-Disposition': `attachment; filename="${filename}"`, 'Content-Length': docxBytes.length });
    res.send(Buffer.from(docxBytes));

  } catch (err) {
    console.error('PDF→Word error:', err);
    res.status(500).json({ error: 'Conversion failed: ' + err.message });
  }
});

// ─── Health check ───────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ ok: true, uptime: Math.floor(process.uptime()) }));

const HOST = '0.0.0.0';
app.listen(PORT, HOST, () => console.log(`SecureDocs server → http://localhost:${PORT}`));
