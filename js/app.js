// SecureDocs App — Interactive Controller

// ─── State ───────────────────────────────────────────────────────────────────
const state = {
  currentTool: null,
  files: [],
  isLoggedIn: false,
  freeCredits: 3,
  selectedPaywallPlan: 'single',
};

// ─── Tool Definitions ─────────────────────────────────────────────────────────
const TOOLS = {
  merge: {
    name: '合并 PDF',
    desc: '将多个 PDF 文件合并为一个',
    hint: '可一次上传多个 PDF',
    formats: ['.pdf'],
  },
  split: {
    name: '拆分 PDF',
    desc: '按页码范围或单页拆分',
    hint: '上传 PDF 并指定拆分段',
    formats: ['.pdf'],
  },
  compress: {
    name: '压缩 PDF',
    desc: '减小文件体积便于发送',
    hint: '支持轻度 / 标准 / 强力压缩',
    formats: ['.pdf'],
  },
  redact: {
    name: 'PDF 涂黑',
    desc: '永久遮盖敏感信息',
    hint: '框选区域进行涂黑处理',
    formats: ['.pdf'],
  },
  watermark: {
    name: 'PDF 加水印',
    desc: '添加文字或图片水印',
    hint: '自定义水印内容和位置',
    formats: ['.pdf'],
  },
  delete: {
    name: '删除页面',
    desc: '删除或重排 PDF 页面',
    hint: '选择要删除的页面并拖拽重排',
    formats: ['.pdf'],
  },
  'pdf-word': {
    name: 'PDF 转 Word',
    desc: '转换为可编辑 Word 文档',
    hint: '文字型 PDF 效果最佳',
    formats: ['.pdf'],
  },
  'word-pdf': {
    name: 'Word 转 PDF',
    desc: 'Word 文档转 PDF 格式',
    hint: '支持 .docx 格式',
    formats: ['.docx'],
  },
  'img-pdf': {
    name: '图片转 PDF',
    desc: '多张图片合并为一个 PDF',
    hint: '拖拽调整图片顺序',
    formats: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
  },
};

// ─── Navigation ───────────────────────────────────────────────────────────────
window.addEventListener('scroll', () => {
  const nav = document.getElementById('mainNav');
  if (window.scrollY > 20) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

// ─── Reveal Animations ────────────────────────────────────────────────────────
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal, .stagger').forEach((el) => {
  revealObserver.observe(el);
});

// ─── Tool Panel ───────────────────────────────────────────────────────────────
function openTool(toolId) {
  const tool = TOOLS[toolId];
  if (!tool) return;
  state.currentTool = toolId;
  state.files = [];

  document.getElementById('toolPanelTitle').textContent = tool.name;
  document.getElementById('toolPanelDesc').textContent = tool.desc;
  document.getElementById('toolUploadHint').textContent = tool.hint;

  // Set accepted file types
  const input = document.getElementById('toolFileInput');
  input.accept = tool.formats.map((f) => (f.startsWith('.') ? f : '.' + f)).join(',');

  // Show format tags
  const formatsEl = document.getElementById('toolFormats');
  formatsEl.innerHTML = tool.formats
    .map((f) => `<span class="format-tag">${f.replace('.', '').toUpperCase()}</span>`)
    .join('');

  // Reset UI
  renderFileList();
  document.getElementById('processBtn').disabled = true;

  // Slide up
  const panel = document.getElementById('toolPanel');
  panel.style.transform = 'translateY(0)';
  document.body.style.overflow = 'hidden';
}

function closeTool() {
  const panel = document.getElementById('toolPanel');
  panel.style.transform = 'translateY(100%)';
  document.body.style.overflow = '';
  state.currentTool = null;
  state.files = [];
}

// ─── File Handling ─────────────────────────────────────────────────────────────
function handleFileSelect(files) {
  for (const file of files) {
    if (state.files.length >= 10) {
      showToast('最多支持 10 个文件');
      break;
    }
    state.files.push({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      file: file,
    });
  }
  renderFileList();
  document.getElementById('processBtn').disabled = state.files.length === 0;
}

function renderFileList() {
  const list = document.getElementById('toolFileList');
  const fileList = document.getElementById('toolFileList');

  if (state.files.length === 0) {
    fileList.style.display = 'none';
    return;
  }

  fileList.style.display = 'flex';
  fileList.innerHTML = state.files
    .map(
      (f) => `
    <div class="file-item" data-id="${f.id}">
      <span class="file-item__icon">${getFileIcon(f.name)}</span>
      <div class="file-item__info">
        <div class="file-item__name">${f.name}</div>
        <div class="file-item__meta">${formatBytes(f.size)}</div>
      </div>
      <button class="file-item__remove" onclick="removeFile(${f.id})" title="移除">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>`
    )
    .join('');
}

function removeFile(id) {
  state.files = state.files.filter((f) => f.id !== id);
  renderFileList();
  document.getElementById('processBtn').disabled = state.files.length === 0;
}

function getFileIcon(name) {
  const ext = name.split('.').pop().toLowerCase();
  const icons = { pdf: '📕', docx: '📄', pptx: '📊', jpg: '🖼', jpeg: '🖼', png: '🖼', gif: '🖼', webp: '🖼' };
  return icons[ext] || '📄';
}

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
}

// Drag and drop
const toolUploadZone = document.getElementById('toolUploadZone');
if (toolUploadZone) {
  toolUploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    toolUploadZone.classList.add('drag-over');
  });
  toolUploadZone.addEventListener('dragleave', () => {
    toolUploadZone.classList.remove('drag-over');
  });
  toolUploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    toolUploadZone.classList.remove('drag-over');
    handleFileSelect(e.dataTransfer.files);
  });
}

// ─── Processing ──────────────────────────────────────────────────────────────
async function processFiles() {
  if (state.files.length === 0) return;

  if (!state.isLoggedIn && state.freeCredits <= 0) {
    openModal('paywall');
    return;
  }

  const overlay = document.getElementById('processingOverlay');
  const status = document.getElementById('processingStatus');
  const detail = document.getElementById('processingDetail');

  overlay.classList.add('active');

  const steps = [
    '正在读取文件...',
    '正在处理中...',
    '即将完成...',
  ];

  let step = 0;
  const stepInterval = setInterval(() => {
    step++;
    if (step < steps.length) {
      status.textContent = steps[step];
      detail.textContent = `${state.files.length} 个文件 · ${state.currentTool}`;
    }
  }, 800);

  await sleep(2800);

  clearInterval(stepInterval);
  overlay.classList.remove('active');

  // Deduct credit if logged in
  if (state.isLoggedIn) {
    state.freeCredits = Math.max(0, state.freeCredits - 1);
  }

  // Simulate result download
  const blob = new Blob([await simulateProcessing()], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = getOutputFileName();
  a.click();
  URL.revokeObjectURL(url);

  showToast(`处理完成！${state.isLoggedIn ? '剩余 ' + state.freeCredits + ' 次额度' : '请登录获取更多额度'}`);
  closeTool();
}

async function simulateProcessing() {
  // Return a minimal valid PDF
  const minPdf = '%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] >>\nendobj\nxref\n0 4\n0000000000 65535 f\n0000000009 00000 n\n0000000056 00000 n\n0000000115 00000 n\ntrailer\n<< /Size 4 /Root 1 0 R >>\nstartxref\n194\n%%EOF';
  return minPdf;
}

function getOutputFileName() {
  const tool = state.currentTool;
  const suffix = {
    merge: '_merged.pdf',
    split: '_split.pdf',
    compress: '_compressed.pdf',
    redact: '_redacted.pdf',
    watermark: '_watermarked.pdf',
    delete: '_edited.pdf',
    'pdf-word': '_converted.docx',
    'word-pdf': '_converted.pdf',
    'img-pdf': '_converted.pdf',
  };
  return (state.files[0]?.name.replace(/\.[^.]+$/, '') || 'document') + (suffix[tool] || '.pdf');
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// ─── Modals ────────────────────────────────────────────────────────────────────
function openModal(id) {
  const modal = document.getElementById('modal' + capitalize(id));
  if (!modal) return;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  const modal = document.getElementById('modal' + capitalize(id));
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// Close modal on backdrop click
document.querySelectorAll('.modal-backdrop').forEach((backdrop) => {
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) {
      backdrop.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
});

// ─── Paywall ──────────────────────────────────────────────────────────────────
function selectPaywallPlan(el) {
  document.querySelectorAll('.paywall-option').forEach((opt) => opt.classList.remove('selected'));
  el.classList.add('selected');
  state.selectedPaywallPlan = el.dataset.plan;
}

// ─── Simulated Login ───────────────────────────────────────────────────────────
function simulateLogin() {
  state.isLoggedIn = true;
  closeModal('login');
  showToast('登录成功！已获得 3 次高级处理体验');
}

// ─── Simulated Payment ─────────────────────────────────────────────────────────
function simulatePayment() {
  closeModal('paywall');
  showToast(state.selectedPaywallPlan === 'monthly' ? '月会员开通成功！' : '支付成功，正在继续处理...');
  if (state.currentTool && state.files.length > 0) {
    setTimeout(() => processFiles(), 600);
  }
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.style.opacity = '1';
  toast.style.transform = 'translateX(-50%) translateY(0)';
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(100px)';
  }, 3000);
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────
function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  const answer = item.querySelector('.faq-item__a');
  const icon = btn.querySelector('.faq-icon');
  const isOpen = answer.style.display !== 'none';
  answer.style.display = isOpen ? 'none' : 'block';
  icon.style.transform = isOpen ? '' : 'rotate(180deg)';
}

// ─── Nav Login Button ─────────────────────────────────────────────────────────
document.getElementById('navLoginBtn')?.addEventListener('click', (e) => {
  e.preventDefault();
  openModal('login');
});

// ─── Init ─────────────────────────────────────────────────────────────────────
document.querySelectorAll('.stagger').forEach((el) => revealObserver.observe(el));
