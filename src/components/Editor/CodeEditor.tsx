import React, { useRef, useEffect, useState } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { getAlgorithmById } from '../../engine/catalog';
import { translateAlgorithmCode } from '../../engine/translations';

export const CodeEditor: React.FC = () => {
  const monacoInstance = useMonaco();
  const editorRef = useRef<any>(null);
  const decorationsRef = useRef<string[]>([]);
  const { steps, stepIndex, currentAlgorithm } = useSelector((state: RootState) => state.visualizer);
  
  const [language, setLanguage] = useState<string>('cpp');

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const activeAlgo = currentAlgorithm ? getAlgorithmById(currentAlgorithm) : null;
  const jsCode = activeAlgo?.code || '// Code mapping empty';
  
  const displayCode = translateAlgorithmCode(currentAlgorithm || '', jsCode, language);

  useEffect(() => {
    if (!monacoInstance || !editorRef.current || steps.length === 0) return;

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
        
        <select 
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-black/80 border border-white/20 text-white shadow-lg text-xs px-3 py-1.5 rounded outline-none focus:border-blue-500 cursor-pointer font-mono font-bold transition-colors"
        >
          <option value="cpp">C++</option>
          <option value="java">Java</option>
          <option value="python">Python</option>
          <option value="js">JavaScript</option>
        </select>
      </div>
      
      <div className="flex-1 min-h-0 relative mt-1">
        <Editor
          height="100%"
          language={language === 'js' ? 'javascript' : language}
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
