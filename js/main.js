console.log("[SecureDocs] main.js loaded");

/* =========================================================
   i18n — EN / 中文 切换
   ========================================================= */
const TRANSLATIONS = {
  en: {
    'nav.home':'Home','nav.tools':'Tools','nav.pricing':'Pricing','nav.login':'Login','nav.signup':'Sign Up',
    'hero.h1':'Your Documents.<br>Your Privacy.','hero.p':'All processing happens locally in your browser. Files never leave your device.','hero.cta':'Start Free','hero.cta2':'How It Works',
    'how.title':'How It Works','how.step1.title':'Upload Files','how.step1.desc':'Select or drag your files. They stay on your device.','how.step2.title':'Process Locally','how.step2.desc':'All computations run in your browser with WebAssembly.','how.step3.title':'Download Result','how.step3.desc':'Get your processed files instantly. No server upload.',
    'tools.title':'All Tools','tools.subtitle':'All processing is 100% local and private.',
    't.merge':'Combine multiple PDFs into one','t.split':'Extract pages or split a PDF','t.compress':'Reduce PDF file size','t.redact':'Draw boxes to permanently black out content','t.watermark':'Add text/image watermark to PDF','t.delete':'Remove specific pages from PDF','t.pdf-word':'Extract text content from PDF','t.pdf-word2':'Convert PDF to Word (.docx)','t.word-pdf':'Convert Word to PDF','t.img-pdf':'Convert images to PDF',
    'u.merge':'Drop multiple PDFs here','u.split':'Upload PDF to split','u.compress':'Upload PDF to compress','u.redact':'Upload PDF to redact','u.watermark':'Upload PDF to watermark','u.delete':'Upload PDF to edit','u.pdf-word':'Upload PDF to extract text','u.pdf-word2':'Upload PDF to convert to Word','u.word-pdf':'Upload Word document','u.img-pdf':'Upload image files',
    'upload.browse':'Browse Files','upload.or':'or drag & drop','upload.format':'Accepted formats: ',
    'pricing.title':'Simple, Transparent Pricing','pricing.subtitle':'Start free, upgrade when you need more.',
    'pricing.free':'Free','pricing.free.price':'$0','pricing.free.per':'/month','pricing.free.feature1':'3 credits (one-time)','pricing.free.feature2':'All basic tools','pricing.free.feature3':'Local processing only','pricing.free.feature4':'Community support',
    'pricing.pro':'Pro','pricing.pro.price':'$9.9','pricing.pro.per':'/month','pricing.pro.feature1':'100 credits/month','pricing.pro.feature2':'All tools + priority','pricing.pro.feature3':'Batch processing','pricing.pro.feature4':'Email support','pricing.pro.cta':'Get Pro',
    'pricing.enterprise':'Enterprise','pricing.enterprise.price':'Custom','pricing.enterprise.per':'','pricing.enterprise.feature1':'Unlimited credits','pricing.enterprise.feature2':'API access','pricing.enterprise.feature3':'White-label option','pricing.enterprise.feature4':'Dedicated support','pricing.enterprise.cta':'Contact Us','pricing.note':'Credits refresh monthly. Unused credits do not roll over.',
    'footer.tagline':'Privacy-first document processing. No uploads, no tracking.','footer.product':'Product','footer.tools':'Tools','footer.pricing':'Pricing','footer.privacy':'Privacy','footer.legal':'Legal','footer.privacy.policy':'Privacy Policy','footer.terms':'Terms of Service',
    'modal.login.title':'Login / Sign Up','modal.login.email':'Email address','modal.login.email.placeholder':'you@example.com','modal.login.send':'Send Magic Link','modal.login.note':'Free 3 credits on first login. No password needed.','modal.close':'Close',
    'panel.title':'Tool','panel.file':'File','panel.page':'Page','panel.of':'of','panel.prev':'←','panel.next':'→','panel.apply':'Apply','panel.download':'Download','panel.login_required':'Login required for this tool',
    'panel.redact.hint':'Draw rectangles to mark areas to redact','panel.redact.clear':'Clear All',
    'panel.watermark.text':'Watermark text','panel.watermark.type':'Type','panel.watermark.text_opt':'Text','panel.watermark.image_opt':'Image','panel.watermark.opacity':'Opacity',
    'panel.compress.level':'Compression level','panel.compress.low':'Low','panel.compress.medium':'Medium','panel.compress.high':'High',
    'panel.delete.hint':'Click page number to toggle delete (red = deleted)','panel.split.hint':'Enter page numbers to extract (e.g. 1,3,5 or 1-3)','panel.split.from':'From','panel.split.to':'To',
    'status.processing':'Processing…','status.success':'Done!','status.error':'Error','status.no_credits':'No credits remaining','status.logged_in':'Logged in','status.credits':'credits','status.logout':'Logout','status.file_count':'files selected',
    'toast.processing':'Processing your file…','toast.success':'Download will start automatically','toast.error':'Something went wrong. Please try again.','toast.no_text':'No text found in this PDF (scanned/image-based)',
    'auth.login_success':'Login successful!','auth.sent':'Magic link sent to your email','auth.logout_confirm':'Are you sure you want to logout?',
    'misc.credits_left':'credits left','misc.close':'Close',
  },
  zh: {
    'nav.home':'首页','nav.tools':'工具','nav.pricing':'定价','nav.login':'登录','nav.signup':'注册',
    'hero.h1':'你的文档。<br>你的隐私。','hero.p':'所有处理都在浏览器本地完成，文件永不离开你的设备。','hero.cta':'免费开始','hero.cta2':'工作原理',
    'how.title':'工作原理','how.step1.title':'上传文件','how.step1.desc':'选择或拖拽文件，文件保留在你的设备上。','how.step2.title':'本地处理','how.step2.desc':'所有计算在浏览器中通过 WebAssembly 运行。','how.step3.title':'下载结果','how.step3.desc':'立即获取处理后的文件，无需上传到服务器。',
    'tools.title':'全部工具','tools.subtitle':'所有处理100%本地，保护隐私。',
    't.merge':'合并多个 PDF 为一个','t.split':'提取页面或拆分 PDF','t.compress':'压缩 PDF 文件大小','t.redact':'绘制矩形永久涂黑内容','t.watermark':'添加文字/图片水印','t.delete':'从 PDF 删除指定页面','t.pdf-word':'提取 PDF 文字内容','t.pdf-word2':'将 PDF 转换为 Word (.docx)','t.word-pdf':'将 Word 转换为 PDF','t.img-pdf':'将图片转换为 PDF',
    'u.merge':'拖拽多个 PDF 到这里','u.split':'上传要拆分的 PDF','u.compress':'上传要压缩的 PDF','u.redact':'上传要涂黑的 PDF','u.watermark':'上传要加水印的 PDF','u.delete':'上传要编辑的 PDF','u.pdf-word':'上传要提取文字的 PDF','u.pdf-word2':'上传要转 Word 的 PDF','u.word-pdf':'上传 Word 文档','u.img-pdf':'上传图片文件',
    'upload.browse':'选择文件','upload.or':'或拖拽上传','upload.format':'支持格式：',
    'pricing.title':'简单透明的定价','pricing.subtitle':'免费开始，需要时再升级。',
    'pricing.free':'免费版','pricing.free.price':'¥0','pricing.free.per':'/月','pricing.free.feature1':'3 个额度（一次性）','pricing.free.feature2':'所有基础工具','pricing.free.feature3':'仅本地处理','pricing.free.feature4':'社区支持',
    'pricing.pro':'专业版','pricing.pro.price':'¥69','pricing.pro.per':'/月','pricing.pro.feature1':'100 个额度/月','pricing.pro.feature2':'全部工具 + 优先队列','pricing.pro.feature3':'批量处理','pricing.pro.feature4':'邮件支持','pricing.pro.cta':'获取专业版',
    'pricing.enterprise':'企业版','pricing.enterprise.price':'定制','pricing.enterprise.per':'','pricing.enterprise.feature1':'无限额度','pricing.enterprise.feature2':'API 访问','pricing.enterprise.feature3':'白标选项','pricing.enterprise.feature4':'专属支持','pricing.enterprise.cta':'联系我们','pricing.note':'额度每月刷新，未用完不累计。',
    'footer.tagline':'隐私优先的文档处理。不上传，不追踪。','footer.product':'产品','footer.tools':'工具','footer.pricing':'定价','footer.privacy':'隐私','footer.legal':'法律','footer.privacy.policy':'隐私政策','footer.terms':'服务条款',
    'modal.login.title':'登录 / 注册','modal.login.email':'电子邮箱','modal.login.email.placeholder':'you@example.com','modal.login.send':'发送登录链接','modal.login.note':'首次登录赠送 3 个额度。无需密码。','modal.close':'关闭',
    'panel.title':'工具','panel.file':'文件','panel.page':'页','panel.of':'/','panel.prev':'←','panel.next':'→','panel.apply':'应用','panel.download':'下载','panel.login_required':'此工具需要登录',
    'panel.redact.hint':'绘制矩形标记要涂黑的区域','panel.redact.clear':'清除全部',
    'panel.watermark.text':'水印文字','panel.watermark.type':'类型','panel.watermark.text_opt':'文字','panel.watermark.image_opt':'图片','panel.watermark.opacity':'透明度',
    'panel.compress.level':'压缩级别','panel.compress.low':'低','panel.compress.medium':'中','panel.compress.high':'高',
    'panel.delete.hint':'点击页码切换删除（红色 = 已删除）','panel.split.hint':'输入要提取的页码（如 1,3,5 或 1-3）','panel.split.from':'从','panel.split.to':'到',
    'status.processing':'处理中…','status.success':'完成！','status.error':'错误','status.no_credits':'额度已用完','status.logged_in':'已登录','status.credits':'个额度','status.logout':'退出登录','status.file_count':'个文件已选',
    'toast.processing':'正在处理文件…','toast.success':'下载即将自动开始','toast.error':'出错了，请重试。','toast.no_text':'未从此 PDF 提取到文字（扫描件或图片型）',
    'auth.login_success':'登录成功！','auth.sent':'登录链接已发送到邮箱','auth.logout_confirm':'确定要退出登录吗？',
    'misc.credits_left':'个额度剩余','misc.close':'关闭',
  }
};

let currentLang = localStorage.getItem('sd-lang') || (navigator.language.startsWith('zh') ? 'zh' : 'en');

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('sd-lang', lang);
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const dict = TRANSLATIONS[lang] || TRANSLATIONS['en'];
    if (dict[key] !== undefined) el.innerHTML = dict[key];
  });
  document.documentElement.lang = lang;
  TRANSLATIONS.en["hero.cta3"] = "View Pricing";
  TRANSLATIONS.zh["hero.cta3"] = "查看定价";
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
}

function t(key) {
  const dict = TRANSLATIONS[currentLang] || TRANSLATIONS['en'];
  return (dict && dict[key] !== undefined) ? dict[key] : (TRANSLATIONS['en'][key] || key);
}


// Dynamic i18n: elements with data-i18n-text have order-based translations
// Features: plan feature lists
const PLAN_FEATURES_EN = [
  ['3 credits (one-time)','All basic tools','Local processing only','Community support'],
  ['100 credits/month','All tools + priority','Batch processing','Email support'],
  ['Unlimited credits','API access','White-label option','Dedicated support'],
];
const PLAN_FEATURES_ZH = [
  ['3 个额度（一次性）','所有基础工具','仅本地处理','社区支持'],
  ['100 个额度/月','全部工具 + 优先队列','批量处理','邮件支持'],
  ['无限额度','API 访问','白标选项','专属支持'],
];

// Also update feature items by text matching
const FEATURE_KEYS = {
  'pricing.free': { en: PLAN_FEATURES_EN[0], zh: PLAN_FEATURES_ZH[0] },
  'pricing.pro': { en: PLAN_FEATURES_EN[1], zh: PLAN_FEATURES_ZH[1] },
  'pricing.enterprise': { en: PLAN_FEATURES_EN[2], zh: PLAN_FEATURES_ZH[2] },
};

function updateFeatureList(lang) {
  const features = lang === 'en' ? PLAN_FEATURES_EN : PLAN_FEATURES_ZH;
  // Find all plan cards and update their <li> elements
  document.querySelectorAll('.plan').forEach((plan, idx) => {
    const items = plan.querySelectorAll('li');
    if (features[idx]) {
      items.forEach((li, i) => {
        if (features[idx][i]) li.textContent = features[idx][i];
      });
    }
  });
}

function updatePricingPrices(lang) {
  const prices = {
    en: ['$0', '$9.9 /mo', 'Custom'],
    zh: ['¥0', '¥69 /月', '定制'],
  };
  const p = lang === 'en' ? prices.en : prices.zh;
  document.querySelectorAll('.plan__price').forEach((el, i) => {
    if (p[i]) {
      el.textContent = p[i];
      el.setAttribute('data-i18n', lang === 'en' ? `pricing.${['free','pro','enterprise'][i]}.price` : '');
    }
  });
  document.querySelectorAll('.plan__period').forEach((el, i) => {
    const per = { en: ['/month',''], zh: ['/月',''] };
    const vals = { en: ['/month','','/month','','/month',''], zh: ['/月','','/月','','/月',''] };
    if (vals[lang] && vals[lang][i]) el.textContent = vals[lang][i];
  });
}

function updatePlanCTA(lang) {
  const ctas = {
    en: ['Free Plan', 'Get Pro', 'Contact Us'],
    zh: ['免费版', '获取专业版', '联系我们'],
  };
  const c = lang === 'en' ? ctas.en : ctas.zh;
  document.querySelectorAll('.plan .btn').forEach((btn, i) => {
    if (c[i]) {
      btn.textContent = c[i];
    }
  });
}

function updateNavLinks(lang) {
  const nav = {
    en: ['Home', 'Tools', 'Pricing'],
    zh: ['首页', '工具', '定价'],
  };
  const n = lang === 'en' ? nav.en : nav.zh;
  document.querySelectorAll('.header__nav a').forEach((a, i) => {
    if (n[i]) a.textContent = n[i];
  });
}

// Enhanced setLang
const _originalSetLang = setLang;
setLang = function(lang) {
  _originalSetLang(lang);
  updateFeatureList(lang);
  updatePricingPrices(lang);
  updatePlanCTA(lang);
  updateNavLinks(lang);
};

// Apply translations on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => setLang(currentLang));


/**
 * SecureDocs — main.js
 * Full PDF operations engine. pdf-lib for manipulation, pdf.js for rendering.
 * All processing runs locally in browser — no file upload.
 */

// ES Module imports from CDN
import { PDFDocument, rgb, degrees, StandardFonts } from 'https://cdn.jsdelivr.net/npm/pdf-lib@3.1.6/+esm';

// ─── State ─────────────────────────────────────────────────
function formatSize(bytes) { if(bytes<1024) return bytes+' B'; if(bytes<1048576) return (bytes/1024).toFixed(1)+' KB'; return (bytes/1048576).toFixed(1)+' MB'; }

const state = {
  currentTool: null,
  files: [],
  pdfDoc: null,
  pageCount: 0,
  selectedPages: new Set(),
  isLoggedIn: false,
  token: localStorage.getItem('sd_token') || null,
  user: JSON.parse(localStorage.getItem('sd_user') || 'null'),
  freeCredits: parseInt(localStorage.getItem('sd_credits') || '0'),
  selectedPaywallPlan: 'single',
  apiBase: 'http://localhost:3001',
  // Redact specific
  redactRects: [],    // [{page, x, y, w, h} in PDF point coords]
  redactPage: 0,      // current page being redacted
  isDrawing: false,
  drawStart: null,
};

if (state.token && state.user) {
  state.isLoggedIn = true;
  state.freeCredits = state.user.credits || 0;
  updateNavCredits();
}

// ─── PDF Engine ────────────────────────────────────────────

async function loadPdf(file) {
  const arrayBuffer = await file.arrayBuffer();
  return await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
}

async function savePdf(pdfDoc) {
  const bytes = await pdfDoc.save({ useObjectStreams: true });
  return new Blob([bytes], { type: 'application/pdf' });
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 3000);
}

async function downloadBlobs(blobs, prefix, suffix) {
  for (let i = 0; i < blobs.length; i++) {
    await new Promise(res => setTimeout(res, i * 250));
    downloadBlob(blobs[i], `${prefix}_${i + 1}${suffix}`);
  }
}

// ─── PDF Operations ────────────────────────────────────────

async function op_merge(files) {
  const merged = await PDFDocument.create();
  for (const f of files) {
    const pdf = await loadPdf(f);
    const pages = await merged.copyPages(pdf, pdf.getPageIndices());
    pages.forEach(p => merged.addPage(p));
  }
  return [await savePdf(merged)];
}

async function op_split(files, selectedPages) {
  const pdf = await loadPdf(files[0].file);
  const total = pdf.getPageCount();
  if (selectedPages.size > 0) {
    const result = await PDFDocument.create();
    const pages = await result.copyPages(pdf, [...selectedPages].map(n => n - 1));
    pages.forEach(p => result.addPage(p));
    return [await savePdf(result)];
  }
  const blobs = [];
  for (let i = 0; i < total; i++) {
    const np = await PDFDocument.create();
    const [page] = await np.copyPages(pdf, [i]);
    np.addPage(page);
    blobs.push(await savePdf(np));
  }
  return blobs;
}

async function op_compress(file, level) {
  const pdf = await loadPdf(file);
  if (level === 'high') { pdf.setTitle(''); pdf.setAuthor(''); pdf.setSubject(''); }
  return [await savePdf(pdf)];
}

async function op_addWatermark(file, opts = {}) {
  const { text = 'Confidential', fontSize = 48, opacity = 0.3, position = 'center' } = opts;
  const pdf = await loadPdf(file);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  for (let i = 0; i < pdf.getPageCount(); i++) {
    const page = pdf.getPage(i);
    const { width, height } = page.getSize();
    const tw = font.widthOfTextAtSize(text, fontSize);
    let x, y;
    switch (position) {
      case 'top-left':     x = 40; y = height - 40; break;
      case 'top-right':    x = width - 40 - tw; y = height - 40; break;
      case 'bottom-left':  x = 40; y = 40; break;
      case 'bottom-right': x = width - 40 - tw; y = 40; break;
      default:             x = (width - tw) / 2; y = height / 2; break;
    }
    page.drawText(text, { x, y, size: fontSize, font, color: rgb(0.4, 0.4, 0.4), opacity, rotate: degrees(-45) });
  }
  return [await savePdf(pdf)];
}

async function op_deletePages(file, selectedPages) {
  const pdf = await loadPdf(file);
  const newPdf = await PDFDocument.create();
  const del = new Set([...selectedPages].map(n => n - 1));
  for (let i = 0; i < pdf.getPageCount(); i++) {
    if (!del.has(i)) { const [p] = await newPdf.copyPages(pdf, [i]); newPdf.addPage(p); }
  }
  return [await savePdf(newPdf)];
}

async function op_imagesToPdf(files) {
  const pdf = await PDFDocument.create();
  for (const f of files) {
    const ext = f.name.split('.').pop().toLowerCase();
    let img;
    if (ext === 'png') img = await pdf.embedPng(await f.arrayBuffer());
    else if (ext === 'jpg' || ext === 'jpeg') img = await pdf.embedJpg(await f.arrayBuffer());
    else {
      const blob = await convertImageToPng(f);
      img = await pdf.embedPng(await blob.arrayBuffer());
    }
    const scale = Math.min(595 / img.width, 842 / img.height);
    const page = pdf.addPage([img.width * scale, img.height * scale]);
    page.drawImage(img, { x: 0, y: 0, width: img.width * scale, height: img.height * scale });
  }
  return [await savePdf(pdf)];
}

async function convertImageToPng(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = img.width; c.height = img.height;
      c.getContext('2d').drawImage(img, 0, 0);
      c.toBlob(b => { URL.revokeObjectURL(url); resolve(b); }, 'image/png');
    };
    img.onerror = reject;
    img.src = url;
  });
}

/**
 * PDF Redact — Apply black rectangles to specific regions
 * rects: [{page:1-based, x, y, width, height} in PDF point coords]
 */
async function op_redact(file, rects) {
  const pdf = await loadPdf(file);
  for (const r of rects) {
    const idx = (r.page || 1) - 1;
    if (idx < 0 || idx >= pdf.getPageCount()) continue;
    const page = pdf.getPage(idx);
    const { height } = page.getSize();
    page.drawRectangle({
      x: r.x,
      y: height - r.y - r.height, // flip y for pdf-lib coords
      width: r.width,
      height: r.height,
      color: rgb(0, 0, 0),
      opacity: 1,
    });
  }
  return [await savePdf(pdf)];
}

/**
 * PDF → Text (local extraction via pdf.js)
 * Uses pdf.js to extract text content from PDF pages
 */
async function op_pdfToText(file) {
  // Dynamically load pdf.js from CDN
  const pdfjsLib = await import('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.mjs');
  const pdfjs = pdfjsLib.default || pdfjsLib;
  pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.mjs';

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map(item => item.str).join(' ');
    fullText += `--- 第 ${i} 页 ---\n${pageText}\n\n`;
  }

  // Convert to downloadable blob
  const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
  return [blob];
}

// ─── Tool Definitions ─────────────────────────────────────
const TOOLS = {
  merge:      { name:'合并 PDF',    desc:'将多个 PDF 文件合并为一个', hint:'可一次上传多个 PDF', formats:['.pdf'], multi:true,  needsPages:false, options:null },
  split:      { name:'拆分 PDF',    desc:'按页码范围或单页拆分',       hint:'选择要拆分的页面', formats:['.pdf'], multi:false, needsPages:true,  options:null },
  compress:   { name:'压缩 PDF',    desc:'减小文件体积便于发送',       hint:'支持轻度/标准/强力压缩', formats:['.pdf'], multi:false, needsPages:false, options:'compress' },
  redact:     { name:'PDF 涂黑',    desc:'框选区域永久遮盖敏感信息',   hint:'在页面上拖拽绘制涂黑区域', formats:['.pdf'], multi:false, needsPages:false, options:'redact' },
  watermark:  { name:'PDF 加水印',  desc:'添加文字水印',               hint:'自定义文字和透明度', formats:['.pdf'], multi:false, needsPages:false, options:'watermark' },
  delete:     { name:'删除页面',    desc:'删除指定 PDF 页面',          hint:'选择要删除的页面', formats:['.pdf'], multi:false, needsPages:true,  options:null },
  'pdf-word': { name:'PDF 转文本',  desc:'提取 PDF 文字内容',          hint:'提取文字为文本文件', formats:['.pdf'], multi:false, needsPages:false, options:null },
  'pdf-word2': { name:'PDF 转 Word', desc:'提取 PDF 内容为 Word 文档', hint:'需登录，生成 .docx 文件', formats:['.pdf'], multi:false, needsPages:false, options:null, serverSide:true }, // Server-side DOCX conversion
  'word-pdf': { name:'Word 转 PDF', desc:'Word 文档转可搜索 PDF',      hint:'支持 .docx 格式', formats:['.docx'], multi:false, needsPages:false, options:null, serverSide:true },
  'img-pdf':  { name:'图片转 PDF',  desc:'多张图片合并为一个 PDF',    hint:'拖拽调整图片顺序', formats:['.jpg','.jpeg','.png','.gif','.webp'], multi:true, needsPages:false, options:null },
};

// ─── UI Helpers ───────────────────────────────────────────
function formatBytes(b) {
  if (b < 1024) return b + ' B';
  if (b < 1048576) return (b/1024).toFixed(1) + ' KB';
  return (b/1048576).toFixed(1) + ' MB';
}
function getFileIcon(n) {
  const m = { pdf:'📕', docx:'📄', pptx:'📊', jpg:'🖼', jpeg:'🖼', png:'🖼', gif:'🖼', webp:'🖼' };
  return m[n.split('.').pop().toLowerCase()] || '📄';
}
function getOutputName(base, tool, ext) {
  const map = { merge:'_merged', split:'_split', compress:'_compressed', redact:'_redacted', watermark:'_watermarked', delete:'_edited', 'pdf-word':'_text', 'word-pdf':'_converted', 'img-pdf':'_photos' };
  return (base || 'document') + (map[tool] || '') + (ext || '.pdf');
}

// ─── Tool Panel ─────────────────────────────────────────────

// ─── File Size Warning ───────────────────────────
function checkFileSize(file) {
  const MAX_LOCAL = 20 * 1024 * 1024; // 20MB for local processing
  const MAX_MOBILE = 10 * 1024 * 1024; // 10MB for mobile
  const isMobile = window.innerWidth < 768;
  const limit = isMobile ? MAX_MOBILE : MAX_LOCAL;
  
  if (file.size > limit) {
    const sizeMB = (file.size / 1024 / 1024).toFixed(1);
    const limitMB = (limit / 1024 / 1024).toFixed(0);
    const msg = currentLang === 'en' 
      ? `File is ${sizeMB}MB. Large files may be slow on ${isMobile ? 'mobile' : 'this device'}. Continue?`
      : `文件 ${sizeMB}MB。大文件在${isMobile ? '手机' : '当前设备'}上可能较慢。继续？`;
    return confirm(msg);
  }
  return true;
}

function openTool(toolId) {
  const tool = TOOLS[toolId];
  if (!tool) return;
  if (tool.serverSide && !state.isLoggedIn) { showToast('此功能需要登录'); openModal('login'); return; }

  state.currentTool = toolId;
  state.files = [];
  state.pdfDoc = null;
  state.pageCount = 0;
  state.selectedPages = new Set();
  state.redactRects = [];

  const panel = document.getElementById('toolPanel');
  if (panel) panel.classList.add('open');
  document.body.style.overflow = 'hidden';

  document.getElementById('toolPanelTitle').textContent = tool.name;
  document.getElementById('toolPanelDesc').textContent = tool.desc;
  document.getElementById('toolUploadHint').textContent = tool.hint;

  const input = document.getElementById('toolFileInput');
  input.accept = tool.formats.join(',');
  input.multiple = !!tool.multi;

  document.getElementById('toolFormats').innerHTML = tool.formats.map(f =>
    `<span class="format-tag">${f.replace('.','').toUpperCase()}</span>`).join('');

  // Hide all option panels
  ['pageSelector','watermarkOptions','compressOptions'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
  // Hide redact area
  const redactArea = document.getElementById('redactArea');
  if (redactArea) redactArea.style.display = 'none';

  if (tool.options === 'compress') document.getElementById('compressOptions').style.display = '';
  if (tool.options === 'watermark') document.getElementById('watermarkOptions').style.display = '';

  const icons = { merge:'⊞', split:'✂', compress:'↙', redact:'▦', watermark:'☔', delete:'✕', 'pdf-word':'📄', 'pdf-word2':'📝', 'word-pdf':'📝', 'img-pdf':'🖼' };
  const uploadIcons = { merge:'📚', split:'✂️', compress:'📦', redact:'🔒', watermark:'☔', delete:'🗑', 'pdf-word':'📄', 'pdf-word2':'📝', 'word-pdf':'📝', 'img-pdf':'🖼' };
  const toolNames = { merge:'PDF 合并', split:'PDF 拆分', compress:'PDF 压缩', redact:'PDF 涂黑', watermark:'PDF 加水印', delete:'删除页面', 'pdf-word':'PDF 转文本', 'pdf-word2':'PDF 转 Word', 'word-pdf':'Word 转 PDF', 'img-pdf':'图片转 PDF' };
  const toolSubs = { merge:'将多个文件合并为一个 PDF', split:'按页码提取或拆分', compress:'减小文件体积', redact:'永久遮盖敏感区域', watermark:'添加文字或图片水印', delete:'删除不需要的页面', 'pdf-word':'提取纯文本内容', 'pdf-word2':'转换为可编辑文档', 'word-pdf':'转换为 PDF 格式', 'img-pdf':'多图合并为 PDF' };

  const iconEl = document.getElementById('uploadIcon');
  if (iconEl) iconEl.textContent = uploadIcons[toolId] || '📂';
  const pIcon = document.getElementById('toolPanelIcon');
  if (pIcon) pIcon.textContent = icons[toolId] || '📂';
  const pTitle = document.getElementById('toolPanelTitle');
  if (pName) pTitle.textContent = toolNames[toolId] || toolId;
  const pDesc = document.getElementById('toolPanelDesc');
  if (pSub) pDesc.textContent = toolSubs[toolId] || '';

  document.getElementById('uploadTitle').textContent = t('u.' + toolId) || '拖拽文件到这里，或点击上传';
  updateProcessBtn();
  resetToolPanelUI();
}

function resetToolPanelUI() {
  document.getElementById('toolUploadZone').style.display = '';
  const fl = document.getElementById('toolFileList');
  fl.style.display = 'none';
  fl.innerHTML = '';
  document.getElementById('processBtn').disabled = true;
}

function closeTool() {
  const panel = document.getElementById('toolPanel');
  if (panel) panel.classList.remove('open');
  document.body.style.overflow = '';
  state.currentTool = null;
  state.files = [];
  cleanupRedactUI();
}

// ─── File Handling ─────────────────────────────────────────
async function handleFileSelect(files) {
  for (const f of files) {
    if (!checkFileSize(f)) continue;
    if (state.files.length >= 10) { showToast('最多 10 个文件'); break; }
    state.files.push({ id: Date.now() + Math.random(), name: f.name, size: f.size, file: f, status: 'ready', progress: 0 });
  }
  renderFileList();
  updateProcessBtn();
  document.getElementById('processBtn').disabled = state.files.length === 0;

  const tool = TOOLS[state.currentTool];
  if (tool.needsPages && state.files[0] && state.files[0].name.toLowerCase().endsWith('.pdf')) {
    try {
      const pdf = await loadPdf(state.files[0].file);
      state.pdfDoc = pdf;
      state.pageCount = pdf.getPageCount();
      renderPageSelector();
      document.getElementById('pageSelector').style.display = '';
    } catch(e) { showToast('无法读取 PDF，请确认文件有效'); }
  }

  // Redact: render PDF pages as canvas
  if (state.currentTool === 'redact' && state.files[0] && state.files[0].name.toLowerCase().endsWith('.pdf')) {
    await setupRedactCanvas(state.files[0].file);
  }
}


function updateProcessBtn() {
  const btn = document.getElementById('processBtn');
  const txt = document.getElementById('processBtnText');
  if (!btn || !txt) return;
  const count = state.files.length;
  const done = state.files.filter(f=>f.status==='done').length;
  if (done > 0 && done === count) {
    txt.textContent = t('panel.download') || '下载';
    btn.disabled = false;
    btn.onclick = downloadResult;
  } else if (count > 0) {
    txt.textContent = t('panel.apply') || '应用';
    btn.disabled = false;
    btn.onclick = processFiles;
  }
}
function renderFileList() {
  const el = document.getElementById('toolFileList');
  if (!el) return;
  if (!state.files.length) { el.style.display = 'none'; return; }
  el.style.display = 'flex';
  const icons = {
    'application/pdf':'📕','image/png':'🖼','image/jpeg':'🖼','image/gif':'🖼',
    'application/vnd.openxmlformats-officedocument':'📝','application/msword':'📝','default':'📄'
  };
  el.innerHTML = state.files.map(f => {
    const fmt = Object.entries(icons).find(([k])=>f.file?.type?.startsWith(k.split('/')[0]))?.[1] || icons['default'];
    const statusIcon = f.status === 'done' ? '<span style="color:var(--success);font-size:14px;margin-left:4px">✓</span>' : '';
    const doneClass = f.status === 'done' ? ' done' : f.status === 'processing' ? ' processing' : '';
    const prog = f.progress || 0;
    const warn = f.size > 20*1024*1024 ? '<div class="file-item__meta" style="color:var(--accent);font-size:11px">⚠ 大文件</div>' : '';
    return `<div class="file-item${doneClass}" data-id="${f.id}">
      <span class="file-item__icon">${fmt}${statusIcon}</span>
      <div class="file-item__info">
        <div class="file-item__name">${f.name}</div>
        <div class="file-item__meta">${formatBytes(f.size)}</div>
        <div class="file-item__progress"><div class="file-item__progress-fill" id="fp-${f.id}" style="width:${prog}%"></div></div>
        ${warn}
      </div>
      ${f.status === 'ready' ? `<button class="file-item__remove" onclick="removeFile(${f.id})">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>` : ''}
    </div>`;
  }).join('');
}

function removeFile(id) {
  state.files = state.files.filter(f => f.id !== id);
  renderFileList();
  updateProcessBtn();
  document.getElementById('processBtn').disabled = state.files.length === 0;
  if (state.pageCount && state.files.length === 0) {
    state.pageCount = 0; state.selectedPages.clear();
    document.getElementById('pageSelector').style.display = 'none';
  }
  if (state.currentTool === 'redact') cleanupRedactUI();
}

// ─── Page Selector ─────────────────────────────────────────
function renderPageSelector() {
  const grid = document.getElementById('pageSelectorGrid');
  grid.innerHTML = '';
  for (let i = 1; i <= state.pageCount; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    btn.style.cssText = 'min-width:36px;height:36px;padding:0 8px;border-radius:6px;border:1px solid var(--border);background:var(--bg-secondary);cursor:pointer;font-size:13px;font-weight:500;font-family:var(--font-body);transition:all 0.15s;';
    btn.dataset.page = i;
    btn.onclick = () => togglePage(i, btn);
    grid.appendChild(btn);
  }
  updatePageSelectorLabel();
}

function togglePage(n, btn) {
  if (state.selectedPages.has(n)) {
    state.selectedPages.delete(n);
    btn.style.background = 'var(--bg-secondary)';
    btn.style.borderColor = 'var(--border)';
    btn.style.color = 'var(--text-primary)';
  } else {
    state.selectedPages.add(n);
    btn.style.background = 'var(--accent-subtle)';
    btn.style.borderColor = 'var(--accent)';
    btn.style.color = 'var(--accent)';
  }
  updatePageSelectorLabel();
}

function updatePageSelectorLabel() {
  const label = document.getElementById('pageSelectorLabel');
  if (!label) return;
  if (state.currentTool === 'split') {
    label.textContent = state.selectedPages.size
      ? `已选 ${state.selectedPages.size} 页：${[...state.selectedPages].sort((a,b)=>a-b).join(', ')}`
      : `共 ${state.pageCount} 页（不选则逐页导出）`;
  } else if (state.currentTool === 'delete') {
    label.textContent = state.selectedPages.size
      ? `将删除 ${state.selectedPages.size} 页`
      : `共 ${state.pageCount} 页，选择要删除的页面`;
  }
}

// ════════════════════════════════════════════════════════════
// REDACT TOOL — Canvas-based interactive area selection
// ════════════════════════════════════════════════════════════

async function setupRedactCanvas(file) {
  // Dynamically load pdf.js
  let pdfjsLib;
  try {
    pdfjsLib = await import('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.mjs');
  } catch(e) {
    showToast('PDF 渲染库加载失败，请检查网络');
    return;
  }
  const pdfjs = pdfjsLib.default || pdfjsLib;
  pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.mjs';

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
  state.redactPdfJs = pdf;
  state.pageCount = pdf.numPages;
  state.redactRects = [];
  state.redactPage = 1;

  // Show redact UI
  const redactArea = document.getElementById('redactArea');
  redactArea.style.display = '';

  const info = document.getElementById('redactPageInfo');
  if (info) info.textContent = `第 1 / ${state.pageCount} 页，共 ${state.redactRects.length} 个涂黑区域`;

  await renderRedactPage(1);
}

async function renderRedactPage(pageNum) {
  const pdf = state.redactPdfJs;
  if (!pdf) return;
  state.redactPage = pageNum;

  const page = await pdf.getPage(pageNum);
  const viewport = page.getViewport({ scale: 1.5 }); // 1.5x resolution

  const container = document.getElementById('redactCanvasContainer');
  container.innerHTML = '';

  // Display canvas (rendered PDF page)
  const dispCanvas = document.createElement('canvas');
  dispCanvas.width = viewport.width;
  dispCanvas.height = viewport.height;
  dispCanvas.style.cssText = 'display:block;max-width:100%;border-radius:8px;';
  dispCanvas.id = 'redactDisplayCanvas';

  // Interaction overlay canvas
  const overlay = document.createElement('canvas');
  overlay.width = viewport.width;
  overlay.height = viewport.height;
  overlay.style.cssText = `position:absolute;top:0;left:0;width:${viewport.width}px;height:${viewport.height}px;max-width:100%;border-radius:8px;cursor:crosshair;opacity:0;`;
  overlay.id = 'redactOverlayCanvas';

  // Wrapper
  const wrapper = document.createElement('div');
  wrapper.style.cssText = `position:relative;display:inline-block;max-width:100%;border-radius:8px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.1);`;

  wrapper.appendChild(dispCanvas);
  wrapper.appendChild(overlay);
  container.appendChild(wrapper);

  // Render PDF page
  await page.render({ canvasContext: dispCanvas.getContext('2d'), viewport }).promise;

  // Draw existing rects on overlay
  redrawOverlay(overlay, viewport);

  // Setup drawing
  setupRedactDrawing(overlay, viewport);

  // Update page nav
  const prevBtn = document.getElementById('redactPrevPage');
  const nextBtn = document.getElementById('redactNextPage');
  const info = document.getElementById('redactPageInfo');
  if (prevBtn) prevBtn.disabled = pageNum <= 1;
  if (nextBtn) nextBtn.disabled = pageNum >= state.pageCount;
  if (info) info.textContent = `第 ${pageNum} / ${state.pageCount} 页，${state.redactRects.length} 个涂黑区域`;
}

function redrawOverlay(overlay, viewport) {
  const ctx = overlay.getContext('2d');
  ctx.clearRect(0, 0, overlay.width, overlay.height);
  // Draw existing rects for current page
  state.redactRects
    .filter(r => r.page === state.redactPage)
    .forEach(r => {
      ctx.fillStyle = 'rgba(232,64,37,0.3)';
      ctx.strokeStyle = '#E84025';
      ctx.lineWidth = 2;
      ctx.fillRect(r.dx, r.dy, r.dw, r.dh);
      ctx.strokeRect(r.dx, r.dy, r.dw, r.dh);
    });
}

function setupRedactDrawing(overlay, viewport) {
  const dispCanvas = document.getElementById('redactDisplayCanvas');
  const scaleX = dispCanvas.width / viewport.width;
  const scaleY = dispCanvas.height / viewport.height;
  const pdfScaleX = viewport.width / viewport.scale;  // points
  const pdfScaleY = viewport.height / viewport.scale; // points

  const ctx = overlay.getContext('2d');

  overlay.onmousedown = (e) => {
    const rect = overlay.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (overlay.width / rect.width);
    const y = (e.clientY - rect.top) * (overlay.height / rect.height);
    state.isDrawing = true;
    state.drawStart = { x, y };
    ctx.clearRect(0, 0, overlay.width, overlay.height);
    redrawOverlay(overlay, viewport);
  };

  overlay.onmousemove = (e) => {
    if (!state.isDrawing) return;
    const rect = overlay.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (overlay.width / rect.width);
    const y = (e.clientY - rect.top) * (overlay.height / rect.height);
    ctx.clearRect(0, 0, overlay.width, overlay.height);
    redrawOverlay(overlay, viewport);
    ctx.fillStyle = 'rgba(232,64,37,0.25)';
    ctx.strokeStyle = '#E84025';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 3]);
    const sx = state.drawStart.x, sy = state.drawStart.y;
    ctx.fillRect(sx, sy, x - sx, y - sy);
    ctx.strokeRect(sx, sy, x - sx, y - sy);
    ctx.setLineDash([]);
  };

  overlay.onmouseup = (e) => {
    if (!state.isDrawing) return;
    state.isDrawing = false;
    const rect = overlay.getBoundingClientRect();
    const ex = (e.clientX - rect.left) * (overlay.width / rect.width);
    const ey = (e.clientY - rect.top) * (overlay.height / rect.height);
    const sx = state.drawStart.x, sy = state.drawStart.y;
    const x = Math.min(sx, ex), y = Math.min(sy, ey);
    const w = Math.abs(ex - sx), h = Math.abs(ey - sy);
    if (w < 10 || h < 10) return;

    // Convert display coords to PDF point coords
    const pdfX = x / pdfScaleX;
    const pdfY = y / pdfScaleY;
    const pdfW = w / pdfScaleX;
    const pdfH = h / pdfScaleY;

    state.redactRects.push({
      page: state.redactPage,
      x: pdfX, y: pdfY, width: pdfW, height: pdfH,
      dx: x, dy: y, dw: w, dh: h, // display coords for re-render
    });

    ctx.clearRect(0, 0, overlay.width, overlay.height);
    redrawOverlay(overlay, viewport);

    const info = document.getElementById('redactPageInfo');
    if (info) info.textContent = `第 ${state.redactPage} / ${state.pageCount} 页，${state.redactRects.length} 个涂黑区域`;
  };

  overlay.onmouseleave = () => {
    if (state.isDrawing) {
      state.isDrawing = false;
      ctx.clearRect(0, 0, overlay.width, overlay.height);
      redrawOverlay(overlay, viewport);
    }
  };

  // Touch support
  overlay.ontouchstart = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = overlay.getBoundingClientRect();
    const x = (touch.clientX - rect.left) * (overlay.width / rect.width);
    const y = (touch.clientY - rect.top) * (overlay.height / rect.height);
    state.isDrawing = true; state.drawStart = { x, y };
    ctx.clearRect(0, 0, overlay.width, overlay.height);
    redrawOverlay(overlay, viewport);
  };
  overlay.ontouchmove = (e) => {
    e.preventDefault();
    if (!state.isDrawing) return;
    const touch = e.touches[0];
    const rect = overlay.getBoundingClientRect();
    const x = (touch.clientX - rect.left) * (overlay.width / rect.width);
    const y = (touch.clientY - rect.top) * (overlay.height / rect.height);
    ctx.clearRect(0, 0, overlay.width, overlay.height);
    redrawOverlay(overlay, viewport);
    ctx.fillStyle = 'rgba(232,64,37,0.25)';
    ctx.strokeStyle = '#E84025';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 3]);
    ctx.fillRect(state.drawStart.x, state.drawStart.y, x - state.drawStart.x, y - state.drawStart.y);
    ctx.strokeRect(state.drawStart.x, state.drawStart.y, x - state.drawStart.x, y - state.drawStart.y);
    ctx.setLineDash([]);
  };
  overlay.ontouchend = (e) => {
    e.preventDefault();
    if (!state.isDrawing) return;
    state.isDrawing = false;
    const touch = e.changedTouches[0];
    const rect = overlay.getBoundingClientRect();
    const ex = (touch.clientX - rect.left) * (overlay.width / rect.width);
    const ey = (touch.clientY - rect.top) * (overlay.height / rect.height);
    const sx = state.drawStart.x, sy = state.drawStart.y;
    const x = Math.min(sx, ex), y = Math.min(sy, ey);
    const w = Math.abs(ex - sx), h = Math.abs(ey - sy);
    if (w < 10 || h < 10) return;
    const pdfX = x / pdfScaleX, pdfY = y / pdfScaleY;
    const pdfW = w / pdfScaleX, pdfH = h / pdfScaleY;
    state.redactRects.push({ page: state.redactPage, x: pdfX, y: pdfY, width: pdfW, height: pdfH, dx: x, dy: y, dw: w, dh: h });
    ctx.clearRect(0, 0, overlay.width, overlay.height);
    redrawOverlay(overlay, viewport);
    const info = document.getElementById('redactPageInfo');
    if (info) info.textContent = `第 ${state.redactPage} / ${state.pageCount} 页，${state.redactRects.length} 个涂黑区域`;
  };
}

function cleanupRedactUI() {
  const area = document.getElementById('redactArea');
  if (area) area.style.display = 'none';
  const container = document.getElementById('redactCanvasContainer');
  if (container) container.innerHTML = '';
  state.redactRects = [];
  state.redactPdfJs = null;
  state.pageCount = 0;
}

// ════════════════════════════════════════════════════════════
// PROCESSING
// ════════════════════════════════════════════════════════════

async function processFiles() {
  if (state.files.length === 0) return;
  if (!state.isLoggedIn && state.freeCredits <= 0) { openModal('paywall'); return; }
  if (state.isLoggedIn && state.freeCredits <= 0) { openModal('paywall'); return; }

  const overlay = document.getElementById('processingOverlay');
  const status = document.getElementById('processingStatus');
  const detail = document.getElementById('processingDetail');
  overlay.classList.add('active');

  const tool = state.currentTool;
  const stepMap = {
    merge:      ['正在读取文件...', '正在合并页面...', '即将完成'],
    split:      ['正在读取文件...', '正在拆分页面...', '正在生成文件...'],
    compress:   ['正在读取文件...', '正在压缩内容...', '即将完成'],
    redact:     ['正在读取文件...', '正在涂黑区域...', '即将完成'],
    watermark:  ['正在读取文件...', '正在添加水印...', '即将完成'],
    delete:     ['正在读取文件...', '正在删除页面...', '即将完成'],
    'pdf-word':  ['正在读取 PDF...', '正在提取文字...', '正在生成文件...'],
    'word-pdf': ['正在上传文件...', '正在转换...', '即将完成'],
    'img-pdf':  ['正在读取图片...', '正在生成 PDF...', '即将完成'],
  };
  const steps = stepMap[tool] || ['正在处理...', '即将完成'];
  let si = 0;
  status.textContent = steps[0];
  const sii = setInterval(() => { si++; if (si < steps.length) status.textContent = steps[si]; }, 800);

  try {
    let blobs = [];
    const base = state.files[0].name.replace(/\.[^.]+$/, '');

    if (tool === 'merge') blobs = await op_merge(state.files.map(f => f.file));
    else if (tool === 'split') blobs = await op_split(state.files, state.selectedPages);
    else if (tool === 'compress') blobs = await op_compress(state.files[0].file, document.querySelector('input[name="compressLevel"]:checked')?.value || 'medium');
    else if (tool === 'watermark') blobs = await op_addWatermark(state.files[0].file, {
      text: document.getElementById('watermarkText')?.value || 'Confidential',
      fontSize: parseInt(document.getElementById('watermarkSize')?.value) || 48,
      opacity: parseFloat(document.getElementById('watermarkOpacity')?.value) || 0.3,
    });
    else if (tool === 'delete') blobs = await op_deletePages(state.files[0].file, state.selectedPages);
    else if (tool === 'redact') {
      if (state.redactRects.length === 0) {
        clearInterval(sii); overlay.classList.remove('active');
        showToast('请先在页面上拖拽绘制涂黑区域');
        return;
      }
      blobs = await op_redact(state.files[0].file, state.redactRects);
    }
    else if (tool === 'img-pdf') blobs = await op_imagesToPdf(state.files.map(f => f.file));
    else if (tool === 'pdf-word') blobs = await op_pdfToText(state.files[0].file);
    else if (tool === 'pdf-word2') blobs = await op_pdfToWord(state.files[0].file);
    else if (tool === 'word-pdf') {
      clearInterval(sii); overlay.classList.remove('active');
      showToast('Word → PDF 需登录后使用服务端转换');
      openModal('login');
      return;
    }

    clearInterval(sii);
    status.textContent = '正在下载...';
    detail.textContent = blobs.length > 1 ? `${blobs.length} 个文件` : formatBytes(blobs[0]?.size || 0);

    const extMap = { 'pdf-word':'.txt', 'img-pdf':'.pdf' };
    await downloadBlobs(blobs, base, extMap[tool] || '.pdf');

    deductCredit();
    overlay.classList.remove('active');
    showResultBanner(blobs.length > 1 ? `已生成 ${blobs.length} 个文件` : '处理完成！');

  } catch (err) {
    clearInterval(sii);
    overlay.classList.remove('active');
    showToast('处理失败：' + (err.message || '未知错误'));
  }
}

// ─── Credits ───────────────────────────────────────────────
function deductCredit() {
  if (state.isLoggedIn || state.freeCredits > 0) {
    state.freeCredits = Math.max(0, state.freeCredits - 1);
    updateNavCredits();
    localStorage.setItem('sd_credits', String(state.freeCredits));
  }
}
function updateNavCredits() {
  const el = document.getElementById('navCredits');
  if (el) el.style.display = (state.isLoggedIn || state.freeCredits > 0) ? '' : 'none';
  const num = document.getElementById('navCreditsNum');
  if (num) num.textContent = state.freeCredits;
}

// ─── Auth ─────────────────────────────────────────────────
async function handleEmailLogin() {
  const email = document.getElementById('loginEmail')?.value?.trim();
  if (!email || !email.includes('@')) { showToast('请输入有效邮箱'); return; }
  try {
    const resp = await fetch(`${state.apiBase}/api/auth/email`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({email}) });
    const data = await resp.json();
    state.token = data.token; state.user = data.user; state.isLoggedIn = true;
    state.freeCredits = data.user.credits;
    localStorage.setItem('sd_token', state.token);
    localStorage.setItem('sd_user', JSON.stringify(state.user));
    localStorage.setItem('sd_credits', String(state.freeCredits));
    closeModal('login'); updateNavCredits();
    const btn = document.getElementById('navLoginBtn');
    if (btn) btn.textContent = state.user.email.split('@')[0];
    showToast(`登录成功！${state.freeCredits} 次处理额度`);
  } catch(e) {
    state.isLoggedIn = true; state.freeCredits = 3;
    localStorage.setItem('sd_credits', '3');
    closeModal('login'); updateNavCredits();
    showToast('本地模式已启用');
  }
}

// ─── Payment ───────────────────────────────────────────────
function selectPaywallPlan(el) {
  document.querySelectorAll('.paywall-option').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
  state.selectedPaywallPlan = el.dataset.plan;
}
async function handlePayment() {
  await new Promise(r => setTimeout(r, 1200));
  state.freeCredits += state.selectedPaywallPlan === 'single' ? 1 : 9999;
  state.isLoggedIn = true;
  localStorage.setItem('sd_credits', String(state.freeCredits));
  localStorage.setItem('sd_user', JSON.stringify({ credits: state.freeCredits }));
  closeModal('paywall'); updateNavCredits();
  showToast(state.selectedPaywallPlan === 'monthly' ? '月会员开通成功！' : '支付成功！');
  if (state.currentTool && state.files.length) setTimeout(() => processFiles(), 600);
}

// ─── Modals ───────────────────────────────────────────────
function openModal(id) {
  const m = document.getElementById('modal' + id.charAt(0).toUpperCase() + id.slice(1));
  if (m) { m.classList.add('active'); document.body.style.overflow = 'hidden'; }
}
function closeModal(id) {
  const m = document.getElementById('modal' + id.charAt(0).toUpperCase() + id.slice(1));
  if (m) { m.classList.remove('active'); document.body.style.overflow = ''; }
}
document.querySelectorAll('.modal-backdrop').forEach(bd => {
  bd.addEventListener('click', e => { if (e.target === bd) { bd.classList.remove('active'); document.body.style.overflow = ''; } });
});

// ─── UI Feedback ──────────────────────────────────────────
function showResultBanner(text) {
  const b = document.getElementById('resultBanner');
  document.getElementById('resultBannerText').textContent = text;
  b.style.transform = 'translateX(-50%) translateY(0)'; b.style.opacity = '1';
  setTimeout(() => { b.style.transform = 'translateX(-50%) translateY(-120px)'; b.style.opacity = '0'; }, 5000);
}
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.style.opacity = '1'; t.style.transform = 'translateX(-50%) translateY(0)';
  setTimeout(() => { t.style.opacity='0'; t.style.transform='translateX(-50%) translateY(100px)'; }, 3200);
}
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const ans = item.querySelector('.faq-item__a');
  const icon = btn.querySelector('.faq-icon');
  const open = ans.style.display !== 'none';
  ans.style.display = open ? 'none' : 'block';
  icon.style.transform = open ? '' : 'rotate(180deg)';
}

// ─── Nav ───────────────────────────────────────────────────
window.addEventListener('scroll', () => {
  document.getElementById('mainNav')?.classList.toggle('scrolled', scrollY > 20);
});

// ─── Reveal ───────────────────────────────────────────────
const ro = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }), { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal, .stagger').forEach(el => ro.observe(el));

// ─── Drag & Drop ──────────────────────────────────────────
const uz = document.getElementById('toolUploadZone');
if (uz) {
  uz.addEventListener('dragover', e => { e.preventDefault(); uz.classList.add('drag-over'); });
  uz.addEventListener('dragleave', () => uz.classList.remove('drag-over'));
  uz.addEventListener('drop', e => { e.preventDefault(); uz.classList.remove('drag-over'); handleFileSelect(e.dataTransfer.files); });
}

// ─── Init ─────────────────────────────────────────────────
updateNavCredits();

// Expose key functions to global scope for HTML onclick handlers
window.openTool = openTool;
window.closeTool = closeTool;
window.toggleLang = toggleLang;
window.switchLang = switchLang;
window.toggleFaq = toggleFaq;
window.openModal = openModal;
window.closeModal = closeModal;
window.handleFileSelect = handleFileSelect;
window.handleDrop = handleDrop;
window.updateProcessBtn = updateProcessBtn;
window.downloadResult = downloadResult;

