const { PDFDocument, StandardFonts, rgb, degrees } = PDFLib;
      pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js";
      const state = { files: [] };
      const $ = (s) => document.querySelector(s);
      const tool = $("#tool");
      const activeTool = $("#activeTool");
      const fileInput = $("#fileInput");
      const drop = $(".drop");
      const filesEl = $("#files");
      const results = $("#results");
      const progress = $("#progress");
      const progressText = $("#progressText");
      const progressNumber = $("#progressNumber");
      const progressBar = $("#progressBar");
      const rangeInput = $("#rangeInput");
      const watermarkInput = $("#watermarkInput");
      const angleInput = $("#angleInput");
      const redactInput = $("#redactInput");
      const rangeWrap = $("#rangeWrap");
      const watermarkWrap = $("#watermarkWrap");
      const angleWrap = $("#angleWrap");
      const redactWrap = $("#redactWrap");
      const notice = $("#toolNotice");
      const acceptText = $("#acceptText");

      const toolInfo = {
        merge: ["PDF 合并", "已实现：将多个 PDF 合并为一个新 PDF。", ".pdf"],
        split: ["PDF 拆分", "已实现：按页码范围生成拆分后的 PDF。例：1-3,4-6", ".pdf"],
        delete: ["删除指定页面", "已实现：输入要删除的页码。例：2,4-6", ".pdf"],
        extract: ["页面提取 / 重排", "已实现：输入保留页面顺序。例：3,1,2 或 1-2,5", ".pdf"],
        rotate: ["PDF 页面旋转", "已实现：输入页码范围并选择旋转角度。留空表示全部页面。", ".pdf"],
        watermark: ["PDF 加水印", "已实现：在每页绘制文字水印并导出。", ".pdf"],
        images: ["图片转 PDF", "已实现：按图片顺序生成 PDF。", ".png,.jpg,.jpeg,.webp"],
        pdfimages: ["PDF 转图片", "已实现：把 PDF 每页渲染为 PNG，并打包为 ZIP 下载。", ".pdf"],
        compress: ["PDF 压缩（有限）", "有限实现：重写 PDF 对象流，无法保证图片型 PDF 明显变小。", ".pdf"],
        redact: ["PDF 涂黑（安全栅格化）", "已实现：自动识别文本层敏感信息并栅格化导出。扫描件图片需要 OCR 才能自动识别。", ".pdf"],
        pdf2word: ["PDF 转 Word（需转换引擎）", "暂不伪装：高保真 PDF 转 Word 需要专门转换引擎。", ".pdf"],
        office2pdf: ["Word/PPT 转 PDF（需转换引擎）", "暂不伪装：Office 转 PDF 需要 LibreOffice、云端转换或桌面引擎。", ".doc,.docx,.ppt,.pptx"],
      };

      function formatBytes(bytes) {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
      }

      function setProgress(value, text) {
        progress.classList.add("active");
        progressBar.style.width = `${value}%`;
        progressNumber.textContent = `${value}%`;
        progressText.textContent = text;
      }

      function addResult(name, bytes) {
        const blob = new Blob([bytes], { type: name.endsWith(".zip") ? "application/zip" : "application/pdf" });
        const url = URL.createObjectURL(blob);
        const item = document.createElement("div");
        item.className = "resultItem";
        item.innerHTML = `<div><strong>${name}</strong><small>${formatBytes(blob.size)}</small></div>`;
        const link = document.createElement("a");
        link.className = "download";
        link.href = url;
        link.download = name;
        link.textContent = "下载";
        item.append(link);
        results.append(item);
      }

      function renderFiles() {
        filesEl.innerHTML = state.files.length
          ? state.files.map((file, index) => `<div class="file"><div><strong>${file.name}</strong><small>${formatBytes(file.size)} · ${file.type || "文件"}</small></div><button class="secondary" data-remove="${index}">移除</button></div>`).join("")
          : '<p class="empty">还没有选择文件。</p>';
      }

      function parseRanges(input, pageCount) {
        const text = (input || `1-${pageCount}`).replace(/\s/g, "");
        const pages = [];
        text.split(",").filter(Boolean).forEach((part) => {
          if (part.includes("-")) {
            const [start, end] = part.split("-").map(Number);
            if (!start || !end || start > end) throw new Error(`页码范围不合法：${part}`);
            for (let i = start; i <= end; i++) pages.push(i - 1);
          } else {
            const page = Number(part);
            if (!page) throw new Error(`页码不合法：${part}`);
            pages.push(page - 1);
          }
        });
        pages.forEach((page) => {
          if (page < 0 || page >= pageCount) throw new Error(`页码超出范围：${page + 1}`);
        });
        return pages;
      }

      async function readPdf(file) {
        return PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
      }

      async function mergePdfs() {
        if (state.files.length < 2) throw new Error("PDF 合并至少需要 2 个 PDF 文件。");
        const out = await PDFDocument.create();
        for (const file of state.files) {
          const src = await readPdf(file);
          const pages = await out.copyPages(src, src.getPageIndices());
          pages.forEach((page) => out.addPage(page));
        }
        addResult("merged.pdf", await out.save({ useObjectStreams: true }));
      }

      async function splitPdf() {
        if (state.files.length !== 1) throw new Error("PDF 拆分一次请选择 1 个 PDF。");
        const src = await readPdf(state.files[0]);
        const ranges = (rangeInput.value || `1-${src.getPageCount()}`).split(";").map((part) => part.trim()).filter(Boolean);
        for (let i = 0; i < ranges.length; i++) {
          const out = await PDFDocument.create();
          const indices = parseRanges(ranges[i], src.getPageCount());
          const pages = await out.copyPages(src, indices);
          pages.forEach((page) => out.addPage(page));
          addResult(`split-${i + 1}.pdf`, await out.save({ useObjectStreams: true }));
        }
      }

      async function extractPdf() {
        if (state.files.length !== 1) throw new Error("页面提取/重排一次请选择 1 个 PDF。");
        const src = await readPdf(state.files[0]);
        const indices = parseRanges(rangeInput.value, src.getPageCount());
        const out = await PDFDocument.create();
        const pages = await out.copyPages(src, indices);
        pages.forEach((page) => out.addPage(page));
        addResult("pages-reordered.pdf", await out.save({ useObjectStreams: true }));
      }

      async function deletePagesPdf() {
        if (state.files.length !== 1) throw new Error("删除页面一次请选择 1 个 PDF。");
        const src = await readPdf(state.files[0]);
        const remove = new Set(parseRanges(rangeInput.value, src.getPageCount()));
        if (remove.size >= src.getPageCount()) throw new Error("不能删除全部页面。");
        const keep = src.getPageIndices().filter((index) => !remove.has(index));
        const out = await PDFDocument.create();
        const pages = await out.copyPages(src, keep);
        pages.forEach((page) => out.addPage(page));
        addResult("pages-deleted.pdf", await out.save({ useObjectStreams: true }));
      }

      async function rotatePdf() {
        if (state.files.length !== 1) throw new Error("旋转页面一次请选择 1 个 PDF。");
        const pdf = await readPdf(state.files[0]);
        const indices = parseRanges(rangeInput.value || `1-${pdf.getPageCount()}`, pdf.getPageCount());
        const angle = Number(angleInput.value);
        indices.forEach((index) => {
          const page = pdf.getPage(index);
          const current = page.getRotation().angle || 0;
          page.setRotation(degrees((current + angle) % 360));
        });
        addResult("pages-rotated.pdf", await pdf.save({ useObjectStreams: true }));
      }

      async function watermarkPdf() {
        if (state.files.length !== 1) throw new Error("加水印一次请选择 1 个 PDF。");
        const pdf = await readPdf(state.files[0]);
        const font = await pdf.embedFont(StandardFonts.HelveticaBold);
        const text = watermarkInput.value || "Confidential";
        pdf.getPages().forEach((page) => {
          const { width, height } = page.getSize();
          page.drawText(text, {
            x: width * 0.18,
            y: height * 0.48,
            size: Math.min(width, height) * 0.08,
            font,
            color: rgb(0.72, 0.08, 0.06),
            opacity: 0.22,
            rotate: degrees(-28),
          });
        });
        addResult("watermarked.pdf", await pdf.save({ useObjectStreams: true }));
      }

      async function imagesToPdf() {
        if (!state.files.length) throw new Error("请至少选择 1 张图片。");
        const out = await PDFDocument.create();
        for (const file of state.files) {
          const bytes = await file.arrayBuffer();
          const lower = file.name.toLowerCase();
          const image = lower.endsWith(".png") ? await out.embedPng(bytes) : await out.embedJpg(bytes);
          const maxW = 595.28;
          const maxH = 841.89;
          const scale = Math.min(maxW / image.width, maxH / image.height, 1);
          const w = image.width * scale;
          const h = image.height * scale;
          const page = out.addPage([maxW, maxH]);
          page.drawImage(image, { x: (maxW - w) / 2, y: (maxH - h) / 2, width: w, height: h });
        }
        addResult("images.pdf", await out.save({ useObjectStreams: true }));
      }

      async function pdfToImages() {
        if (state.files.length !== 1) throw new Error("PDF 转图片一次请选择 1 个 PDF。");
        const src = await pdfjsLib.getDocument({ data: await state.files[0].arrayBuffer() }).promise;
        const zip = new JSZip();
        for (let pageNum = 1; pageNum <= src.numPages; pageNum++) {
          setProgress(Math.round((pageNum / src.numPages) * 85), `正在渲染第 ${pageNum} / ${src.numPages} 页`);
          const page = await src.getPage(pageNum);
          const viewport = page.getViewport({ scale: 2 });
          const canvas = document.createElement("canvas");
          canvas.width = Math.ceil(viewport.width);
          canvas.height = Math.ceil(viewport.height);
          const ctx = canvas.getContext("2d", { alpha: false });
          await page.render({ canvasContext: ctx, viewport }).promise;
          const pngBytes = await new Promise((resolve) => {
            canvas.toBlob(async (blob) => resolve(await blob.arrayBuffer()), "image/png");
          });
          zip.file(`page-${String(pageNum).padStart(3, "0")}.png`, pngBytes);
        }
        const zipBytes = await zip.generateAsync({ type: "uint8array" });
        addResult("pdf-pages.zip", zipBytes);
      }

      async function compressPdf() {
        if (state.files.length !== 1) throw new Error("压缩一次请选择 1 个 PDF。");
        const pdf = await readPdf(state.files[0]);
        addResult("optimized.pdf", await pdf.save({ useObjectStreams: true, addDefaultPage: false }));
      }

      function redactPatterns() {
        const keywords = redactInput.value
          .split(/\n+/)
          .map((item) => item.trim())
          .filter(Boolean);
        const escaped = keywords.map((item) => item.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
        return [
          /1[3-9]\d{9}/,
          /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i,
          /\d{6}(?:19|20)\d{2}\d{7}[\dXx]/,
          /\b\d{16,19}\b/,
          ...escaped.map((item) => new RegExp(item, "i")),
        ];
      }

      function textRect(item, viewport) {
        const tx = pdfjsLib.Util.transform(viewport.transform, item.transform);
        const x = tx[4];
        const y = tx[5];
        const width = Math.max(8, item.width * viewport.scale);
        const height = Math.max(8, Math.abs(tx[3]) || item.height * viewport.scale || 12);
        return { x: x - 2, y: y - height - 2, width: width + 4, height: height + 4 };
      }

      async function redactPdf() {
        if (state.files.length !== 1) throw new Error("安全涂黑一次请选择 1 个 PDF。");
        const bytes = await state.files[0].arrayBuffer();
        const src = await pdfjsLib.getDocument({ data: bytes }).promise;
        const out = await PDFDocument.create();
        const patterns = redactPatterns();
        let totalMatches = 0;

        for (let pageNum = 1; pageNum <= src.numPages; pageNum++) {
          setProgress(Math.round((pageNum / src.numPages) * 80), `正在安全重绘第 ${pageNum} / ${src.numPages} 页`);
          const page = await src.getPage(pageNum);
          const viewport = page.getViewport({ scale: 2 });
          const canvas = document.createElement("canvas");
          canvas.width = Math.ceil(viewport.width);
          canvas.height = Math.ceil(viewport.height);
          const ctx = canvas.getContext("2d", { alpha: false });
          await page.render({ canvasContext: ctx, viewport }).promise;

          const textContent = await page.getTextContent();
          ctx.save();
          ctx.fillStyle = "#000";
          textContent.items.forEach((item) => {
            const text = item.str || "";
            if (!text || !patterns.some((pattern) => pattern.test(text))) return;
            const rect = textRect(item, viewport);
            ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
            totalMatches += 1;
          });
          ctx.restore();

          const pngBytes = await new Promise((resolve) => {
            canvas.toBlob(async (blob) => resolve(new Uint8Array(await blob.arrayBuffer())), "image/png");
          });
          const image = await out.embedPng(pngBytes);
          const outPage = out.addPage([viewport.width / 2, viewport.height / 2]);
          outPage.drawImage(image, { x: 0, y: 0, width: viewport.width / 2, height: viewport.height / 2 });
        }

        if (!totalMatches) {
          throw new Error("没有在文本层中识别到可自动涂黑的内容。扫描件图片需要 OCR，或请输入关键词后重试。");
        }
        addResult("redacted-safe-raster.pdf", await out.save({ useObjectStreams: true }));
      }

      function unsupported() {
        throw new Error(toolInfo[tool.value][1]);
      }

      async function run() {
        results.innerHTML = "";
        if (!state.files.length) {
          alert("请先选择文件。");
          return;
        }
        try {
          setProgress(10, "读取本地文件");
          const current = tool.value;
          if (current === "merge") await mergePdfs();
          else if (current === "split") await splitPdf();
          else if (current === "delete") await deletePagesPdf();
          else if (current === "extract") await extractPdf();
          else if (current === "rotate") await rotatePdf();
          else if (current === "watermark") await watermarkPdf();
          else if (current === "images") await imagesToPdf();
          else if (current === "pdfimages") await pdfToImages();
          else if (current === "compress") await compressPdf();
          else if (current === "redact") await redactPdf();
          else unsupported();
          setProgress(100, "处理完成，未上传服务器");
        } catch (error) {
          setProgress(100, "处理停止");
          results.innerHTML = `<div class="notice bad">${error.message}</div>`;
        }
      }

      function syncTool() {
        const info = toolInfo[tool.value];
        activeTool.textContent = info[0];
        notice.textContent = info[1];
        notice.className = tool.value === "pdf2word" || tool.value === "office2pdf" ? "notice bad" : tool.value === "compress" || tool.value === "redact" ? "notice warn" : "notice";
        fileInput.accept = info[2];
        acceptText.textContent = tool.value === "images" ? "当前功能需要图片文件。" : "当前功能需要 PDF 文件。";
        rangeWrap.style.display = tool.value === "split" || tool.value === "extract" || tool.value === "delete" || tool.value === "rotate" ? "grid" : "none";
        watermarkWrap.style.display = tool.value === "watermark" ? "grid" : "none";
        angleWrap.style.display = tool.value === "rotate" ? "grid" : "none";
        redactWrap.style.display = tool.value === "redact" ? "grid" : "none";
        document.querySelector(".settings").classList.toggle("wide", tool.value === "redact");
        results.innerHTML = "";
        progress.classList.remove("active");
      }

      fileInput.addEventListener("change", (event) => {
        state.files = Array.from(event.target.files);
        renderFiles();
        results.innerHTML = "";
      });
      drop.addEventListener("dragover", (event) => {
        event.preventDefault();
        drop.classList.add("drag");
      });
      drop.addEventListener("dragleave", () => drop.classList.remove("drag"));
      drop.addEventListener("drop", (event) => {
        event.preventDefault();
        drop.classList.remove("drag");
        state.files = Array.from(event.dataTransfer.files);
        renderFiles();
        results.innerHTML = "";
      });
      filesEl.addEventListener("click", (event) => {
        const index = event.target.dataset.remove;
        if (index === undefined) return;
        state.files.splice(Number(index), 1);
        renderFiles();
      });
      tool.addEventListener("change", syncTool);
      $("#runBtn").addEventListener("click", run);
      $("#clearBtn").addEventListener("click", () => {
        state.files = [];
        fileInput.value = "";
        renderFiles();
        results.innerHTML = "";
        progress.classList.remove("active");
      });
      renderFiles();
      syncTool();
