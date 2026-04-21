function createPreviewHtml(markdown, parser = globalThis.marked) {
  const source = (markdown || '').trim();

  if (!source) {
    return '<p class="preview-empty">미리보기가 여기에 표시됩니다.</p>';
  }

  if (!parser || typeof parser.parse !== 'function') {
    throw new Error('Markdown parser is not available');
  }

  return parser.parse(source);
}

async function readMarkdownFile(file) {
  if (!file || !/\.md$/i.test(file.name || '')) {
    throw new Error('Markdown 파일만 업로드할 수 있습니다.');
  }

  return file.text();
}

function renderPreview(textarea, preview) {
  preview.innerHTML = createPreviewHtml(textarea.value);
}

function setupMarkdownPreview(doc = document) {
  const textarea = doc.getElementById('markdown-input');
  const preview = doc.getElementById('markdown-preview');
  const fileInput = doc.getElementById('markdown-file');
  const fileName = doc.getElementById('file-name');

  if (!textarea || !preview || !fileInput || !fileName) {
    return;
  }

  const update = () => renderPreview(textarea, preview);

  textarea.addEventListener('input', update);

  fileInput.addEventListener('change', async (event) => {
    const [file] = event.target.files || [];
    if (!file) return;

    try {
      textarea.value = await readMarkdownFile(file);
      fileName.textContent = file.name;
      update();
    } catch (error) {
      fileName.textContent = error.message;
    }
  });

  update();
}

if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => setupMarkdownPreview());
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createPreviewHtml, readMarkdownFile, setupMarkdownPreview };
}
