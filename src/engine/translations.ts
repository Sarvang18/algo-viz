export function translateAlgorithmCode(_algoId: string, jsCode: string, lang: string): string {
  if (lang === 'js') return jsCode;

  let code = jsCode;

  if (lang === 'cpp') {
    return code
      .replace(/function/g, 'auto')
      .replace(/let /g, 'int ')
      .replace(/const /g, 'int ')
      .replace(/Math\.floor\(([^)]+)\)/g, '$1')
      .replace(/Math\.max/g, 'max')
      .replace(/Math\.min/g, 'min')
      .replace(/\.length/g, '.size()')
      .replace(/\.push\(/g, '.push_back(')
      .replace(/\.pop\(\)/g, '.pop_back()')
      .replace(/===/g, '==')
      .replace(/!==/g, '!=')
      .replace(/new Map\(\)/g, 'unordered_map<int, int>()')
      .replace(/new Set\(\)/g, 'unordered_set<int>()')
      .replace(/new Array\(([^)]+)\)\.fill\(([^)]+)\)/g, 'vector<int>($1, $2)')
      .replace(/Array\.from\(\{length: ([^}]+)\}, \(\) => \[\]\)/g, 'vector<vector<int>>($1)')
      .replace(/\[\.\.\.([^\]]+)\]/g, '$1')
      .replace(/\[([^,]+),\s*([^\]]+)\]\s*=\s*\[[^\]]+\]/g, 'swap($1, $2)')
      .replace(/null/g, 'nullptr');
  }

  if (lang === 'java') {
    return code
      .replace(/function ([a-zA-Z0-9_]+)/g, 'public static Object $1')
      .replace(/let /g, 'int ')
      .replace(/const /g, 'int ')
      .replace(/Math\.floor\(([^)]+)\)/g, '(int)($1)')
      .replace(/===/g, '==')
      .replace(/!==/g, '!=')
      .replace(/\.push\(/g, '.add(')
      .replace(/\.pop\(\)/g, '.remove(size() - 1)')
      .replace(/new Map\(\)/g, 'new HashMap<>()')
      .replace(/new Set\(\)/g, 'new HashSet<>()')
      .replace(/new Array\(([^)]+)\)\.fill\(([^)]+)\)/g, 'new int[$1]')
      .replace(/\[\.\.\.([^\]]+)\]/g, '$1')
      .replace(/\[([^,]+),\s*([^\]]+)\]\s*=\s*\[[^\]]+\]/g, 'int temp = $1; $1 = $2; $2 = temp;');
  }

  if (lang === 'python') {
    const lines = code.split('\n');
    const pyLines = lines.map(line => {
      let pyLine = line
        .replace(/function ([a-zA-Z0-9_]+)\((.*)\) \{/, 'def $1($2):')
        .replace(/\} else if \((.*)\) \{/, 'elif $1:')
        .replace(/\} else \{/, 'else:')
        .replace(/if \((.*)\) \{/, 'if $1:')
        .replace(/while \((.*)\) \{/, 'while $1:')
        .replace(/for \(int i = 0; i < (.*); i\+\+\) \{/, 'for i in range($1):')
        .replace(/for \(let i = 0; i < (.*); i\+\+\) \{/, 'for i in range($1):')
        .replace(/let /g, '')
        .replace(/const /g, '')
        .replace(/Math\.floor\(([^)]+)\)/g, 'int($1)')
        .replace(/Math\.max/g, 'max')
        .replace(/Math\.min/g, 'min')
        .replace(/===/g, '==')
        .replace(/!==/g, '!=')
        .replace(/&&/g, 'and')
        .replace(/\|\|/g, 'or')
        .replace(/\.push\(/g, '.append(')
        .replace(/new Array\(([^)]+)\)\.fill\(([^)]+)\)/g, '[$2] * $1')
        .replace(/new Map\(\)/g, '{}')
        .replace(/;/g, '')
        .replace(/\{/g, '# {');
      
      if (pyLine.trim() === '}') {
         return '        pass # } end block'; 
      }
      return pyLine;
    });
    return pyLines.join('\n');
  }

  return code;
}
