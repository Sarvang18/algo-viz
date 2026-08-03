import { cppTranslations } from './translations/cpp';
import { javaTranslations } from './translations/java';
import { pythonTranslations } from './translations/python';

export type CodeLanguage = 'cpp' | 'java' | 'javascript' | 'python';

export const codeLanguages: ReadonlyArray<{ id: CodeLanguage; label: string }> = [
  { id: 'cpp', label: 'C++' },
  { id: 'java', label: 'Java' },
  { id: 'javascript', label: 'JavaScript' },
  { id: 'python', label: 'Python' },
];

export const translatedAlgorithmIds = {
  cpp: Object.keys(cppTranslations),
  java: Object.keys(javaTranslations),
  python: Object.keys(pythonTranslations),
};

export function getAlgorithmCode(
  algorithmId: string,
  javascriptCode: string,
  language: CodeLanguage,
): string {
  if (language === 'javascript') return javascriptCode;

  const translations = language === 'cpp'
    ? cppTranslations
    : language === 'java'
      ? javaTranslations
      : pythonTranslations;

  return translations[algorithmId] ?? languageMissing(language, algorithmId);
}

function languageMissing(language: Exclude<CodeLanguage, 'javascript'>, algorithmId: string): string {
  const comments = language === 'python' ? ['#', '#'] : ['//', '//'];
  return `${comments[0]} ${algorithmId || 'Algorithm'}\n${comments[1]} ${language} implementation is unavailable.`;
}
