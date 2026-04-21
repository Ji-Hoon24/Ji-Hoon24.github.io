const test = require('node:test');
const assert = require('node:assert/strict');
const { createPreviewHtml, readMarkdownFile } = require('./app.js');

test('createPreviewHtml uses markdown parser output', () => {
  const html = createPreviewHtml('# title', {
    parse: (markdown) => `<h1>${markdown.slice(2)}</h1>`,
  });

  assert.equal(html, '<h1>title</h1>');
});

test('createPreviewHtml falls back to placeholder when markdown is empty', () => {
  const html = createPreviewHtml('', {
    parse: () => '<p>ignored</p>',
  });

  assert.match(html, /미리보기가 여기에 표시됩니다/);
});

test('readMarkdownFile rejects non-markdown files', async () => {
  await assert.rejects(
    () => readMarkdownFile({
      name: 'note.txt',
      text: async () => 'hello',
    }),
    /Markdown 파일만/
  );
});

test('readMarkdownFile returns file text for markdown files', async () => {
  const content = await readMarkdownFile({
    name: 'note.md',
    text: async () => '# hello',
  });

  assert.equal(content, '# hello');
});
