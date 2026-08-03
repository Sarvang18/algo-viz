import React, { useRef, useEffect, useMemo, useState } from 'react';
import Editor, { useMonaco, type OnMount } from '@monaco-editor/react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { getAlgorithmById } from '../../engine/catalog';
import { codeLanguages, getAlgorithmCode, type CodeLanguage } from '../../engine/languageCode';

const LANGUAGE_STORAGE_KEY = 'dsa-viz-code-language';

const getInitialLanguage = (): CodeLanguage => {
  try {
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (codeLanguages.some(({ id }) => id === stored)) return stored as CodeLanguage;
  } catch {
    // The editor still works when storage is blocked by the browser.
  }
  return 'cpp';
};

export const CodeEditor: React.FC = () => {
  const monacoInstance = useMonaco();
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);
  const decorationsRef = useRef<string[]>([]);
  const { steps, stepIndex, currentAlgorithm } = useSelector((state: RootState) => state.visualizer);
  const [language, setLanguage] = useState<CodeLanguage>(getInitialLanguage);
  
  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

  const activeAlgo = currentAlgorithm ? getAlgorithmById(currentAlgorithm) : null;
  const jsCode = activeAlgo?.code || '// Code mapping empty';
  const displayCode = useMemo(
    () => getAlgorithmCode(currentAlgorithm || '', jsCode, language),
    [currentAlgorithm, jsCode, language],
  );

  const handleLanguageChange = (nextLanguage: CodeLanguage) => {
    setLanguage(nextLanguage);
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
    } catch {
      // A private browsing policy may disable storage; selection still works.
    }
  };

  useEffect(() => {
    if (!monacoInstance || !editorRef.current) return;

    if (language !== 'javascript' || steps.length === 0) {
      decorationsRef.current = editorRef.current.deltaDecorations(decorationsRef.current, []);
      return;
    }

    const currentStep = steps[stepIndex];
    if (!currentStep) return;
    
    const lineToHighlight = currentStep.meta?.line;

    if (lineToHighlight) {
      decorationsRef.current = editorRef.current.deltaDecorations(decorationsRef.current, [
        {
          range: new monacoInstance.Range(lineToHighlight, 1, lineToHighlight, 1),
          options: {
            isWholeLine: true,
            className: 'bg-blue-500/30 border-l-4 border-blue-500 block',
          },
        },
      ]);
      
      editorRef.current.revealLineInCenter(lineToHighlight);
    } else {
      decorationsRef.current = editorRef.current.deltaDecorations(decorationsRef.current, []);
    }
  }, [stepIndex, steps, monacoInstance, language]);

  return (
    <div className="h-full w-full flex flex-col bg-transparent">
      <div className="px-5 py-3 flex flex-row items-center justify-between border-b border-white/10 shrink-0 bg-white/5 shadow-inner">
        <span className="text-[11px] tracking-widest uppercase font-black text-white/50">Execution Code</span>
        
        <label className="sr-only" htmlFor="code-language">Code language</label>
        <select
          id="code-language"
          aria-label="Code language"
          value={language}
          onChange={(event) => handleLanguageChange(event.target.value as CodeLanguage)}
          className="cursor-pointer rounded border border-white/20 bg-black/80 px-3 py-1.5 font-mono text-xs font-bold text-white shadow-lg outline-none transition-colors hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
        >
          {codeLanguages.map(({ id, label }) => <option key={id} value={id}>{label}</option>)}
        </select>
      </div>
      
      <div className="flex-1 min-h-0 relative mt-1">
        <Editor
          height="100%"
          language={language}
          theme="vs-dark"
          value={displayCode}
          options={{
            readOnly: true,
            minimap: { enabled: false },
            fontSize: 14,
            scrollBeyondLastLine: false,
            padding: { top: 16 }
          }}
          onMount={handleEditorDidMount}
        />
      </div>
    </div>
  );
};
