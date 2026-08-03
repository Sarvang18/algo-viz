import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { cppTranslations } from '../src/engine/translations/cpp.ts';
import { javaTranslations } from '../src/engine/translations/java.ts';
import { pythonTranslations } from '../src/engine/translations/python.ts';

const catalogSource = readFileSync(new URL('../src/engine/catalog.ts', import.meta.url), 'utf8');
const enabledIds = [...catalogSource.matchAll(/\{ id: '([^']+)'[^\n]*implemented: true/g)]
  .map((match) => match[1])
  .sort();

test('every enabled algorithm has C++, Java, and Python source', () => {
  assert.equal(enabledIds.length, 77);

  for (const [language, translations] of Object.entries({
    cpp: cppTranslations,
    java: javaTranslations,
    python: pythonTranslations,
  })) {
    assert.deepEqual(Object.keys(translations).sort(), enabledIds, `${language} coverage differs from the catalog`);
    for (const algorithmId of enabledIds) {
      const source = translations[algorithmId];
      assert.ok(source.length > 40, `${language}/${algorithmId} is unexpectedly short`);
      assert.doesNotMatch(source, /TODO|implementation is unavailable/i, `${language}/${algorithmId} is a placeholder`);
    }
  }
});

test('language sources use their native syntax instead of regex-translated JavaScript', () => {
  for (const source of Object.values(cppTranslations)) {
    assert.match(source, /#include <bits\/stdc\+\+\.h>/);
    assert.doesNotMatch(source, /\bfunction\s+\w+\s*\(|\blet\s+\w+/);
  }
  for (const source of Object.values(javaTranslations)) {
    assert.match(source, /class Solution/);
    assert.doesNotMatch(source, /\bfunction\s+\w+\s*\(|\blet\s+\w+/);
  }
  for (const source of Object.values(pythonTranslations)) {
    assert.match(source, /\b(def|class)\b/);
    assert.doesNotMatch(source, /\b(function|let|const)\b|===|=>/);
  }
});
