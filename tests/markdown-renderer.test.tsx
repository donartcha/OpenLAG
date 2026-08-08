import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MarkdownRenderer } from '../src/components/MarkdownRenderer.js';

test('MarkdownRenderer renders GitHub Flavored Markdown tables', () => {
  const markdown = [
    '| Term | Definition |',
    '| --- | --- |',
    '| Project | A container for related work. |',
  ].join('\n');

  const html = renderToStaticMarkup(<MarkdownRenderer content={markdown} />);

  assert.match(html, /<table/);
  assert.match(html, /<th[^>]*>Term<\/th>/);
  assert.match(html, /<td[^>]*>Project<\/td>/);
  assert.doesNotMatch(html, /\| Term \| Definition \|/);
});
