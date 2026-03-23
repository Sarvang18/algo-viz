import type { Step, DSSnapshot } from '../Step';

export function* kmp(): Generator<Step<DSSnapshot>, void, unknown> {
  const text = "ABEABABDABACDABABC";
  const pat = "ABABC";
  const state = [...text, '|', ...pat];
  const offset = text.length + 1; 

  yield { action: "custom", indices: [], snapshot: { type: 'array', data: [...state] }, meta: { line: 1, vars: { text, pat } } };

  yield { action: "custom", indices: Array.from({length: pat.length}, (_,i)=>i+offset), snapshot: { type: 'array', data: [...state] }, meta: { line: 2, vars: { status: "Building LPS Array" } } };
  const lps = Array(pat.length).fill(0);
  let len = 0, i = 1;
  while(i < pat.length) {
    yield { action: "compare", indices: [offset+i, offset+len], snapshot: { type: 'array', data: [...state] }, meta: { line: 5, vars: { i, len } } };
    if (pat[i] === pat[len]) { len++; lps[i] = len; i++; }
    else {
      if (len !== 0) len = lps[len - 1]; else { lps[i] = 0; i++; }
    }
  }

  let i_txt = 0, j_pat = 0;
  while((text.length - i_txt) >= (pat.length - j_pat)) {
     yield { action: "highlight", indices: [i_txt, offset + j_pat], snapshot: { type: 'array', data: [...state] }, meta: { line: 14, vars: { i_txt, j_pat } } };
     if (pat[j_pat] === text[i_txt]) { i_txt++; j_pat++; }
     if (j_pat === pat.length) {
        yield { action: "found", indices: Array.from({length: pat.length}, (_,idx)=>i_txt - j_pat + idx), snapshot: { type: 'array', data: [...state] }, meta: { line: 17, vars: { matchAt_Index: i_txt - j_pat } } };
        j_pat = lps[j_pat - 1];
     } else if (i_txt < text.length && pat[j_pat] !== text[i_txt]) {
        yield { action: "swap", indices: [i_txt, offset + j_pat], snapshot: { type: 'array', data: [...state] }, meta: { line: 20, vars: { matchFailedStatus: true } } };
        if (j_pat !== 0) j_pat = lps[j_pat - 1]; else i_txt++;
     }
  }
}
export const kmpCode = `function KMP(text, pat) {
  let lps = Array(pat.length).fill(0);
  let len = 0, i = 1;
  while (i < pat.length) {
    if (pat[i] === pat[len]) lps[i++] = ++len;
    else if (len !== 0) len = lps[len - 1];
    else lps[i++] = 0;
  }
  let res = [], M = pat.length, N = text.length;
  i = 0; let j = 0;
  while ((N - i) >= (M - j)) {
    if (pat[j] === text[i]) { j++; i++; }
    if (j === M) { res.push(i - j); j = lps[j - 1]; }
    else if (i < N && pat[j] !== text[i]) {
      if (j !== 0) j = lps[j - 1];
      else i++;
    }
  }
  return res;
}`;

export function* rabinKarp(): Generator<Step<DSSnapshot>, void, unknown> {
  const text = "AABAACAADAABAAB";
  const pat = "AABA";
  const state = [...text, '|', ...pat];
  const offset = text.length + 1;
  
  yield { action: "custom", indices: [], snapshot: { type: 'array', data: [...state] }, meta: { line: 1, vars: { text, pat } } };

  const q = 101, d = 256;
  let p = 0, t = 0, h = 1;
  for(let i=0; i<pat.length-1; i++) h = (h * d) % q;
  
  for(let i=0; i<pat.length; i++) {
    p = (d * p + pat.charCodeAt(i)) % q;
    t = (d * t + text.charCodeAt(i)) % q;
  }

  yield { action: "highlight", indices: Array.from({length:pat.length},(_,i)=>offset+i), snapshot: { type: 'array', data: [...state] }, meta: { line: 7, vars: { templateHash: p } } };

  for(let i=0; i<=text.length - pat.length; i++) {
    let windowIndices = Array.from({length:pat.length},(_,idx)=>i+idx);
    yield { action: "compare", indices: [...windowIndices, ...Array.from({length:pat.length}, (_,ix)=>offset+ix)], snapshot: { type: 'array', data: [...state] }, meta: { line: 11, vars: { windowHash: t, targetHash: p } } };
    
    if (p === t) {
      let match = true;
      for(let j=0; j<pat.length; j++) {
        if(text[i+j] !== pat[j]) { match = false; break; }
      }
      if(match) yield { action: "found", indices: windowIndices, snapshot: { type: 'array', data: [...state] }, meta: { line: 15, vars: { matchIndex: i } } };
    }
    
    if(i < text.length - pat.length) {
      t = (d*(t - text.charCodeAt(i)*h) + text.charCodeAt(i+pat.length)) % q;
      if (t < 0) t = t + q;
    }
  }
}
export const rabinKarpCode = `function rabinKarp(text, pat, q = 101) {
  let M = pat.length, N = text.length;
  let i, j, p = 0, t = 0, h = 1, d = 256;
  for (i = 0; i < M - 1; i++) h = (h * d) % q;
  for (i = 0; i < M; i++) {
    p = (d * p + pat.charCodeAt(i)) % q;
    t = (d * t + text.charCodeAt(i)) % q;
  }
  for (i = 0; i <= N - M; i++) {
    if (p === t) {
      for (j = 0; j < M; j++) if (text[i + j] !== pat[j]) break;
      if (j === M) console.log("Pattern at index " + i);
    }
    if (i < N - M) {
      t = (d * (t - text.charCodeAt(i) * h) + text.charCodeAt(i + M)) % q;
      if (t < 0) t = t + q;
    }
  }
}`;

export function* zAlgo(): Generator<Step<DSSnapshot>, void, unknown> {
  const text = "AABAACAADAABAABA";
  const pat = "AABA";
  const concat = pat + "$" + text;
  const state = [...concat];
  yield { action: "custom", indices: [], snapshot: { type: 'array', data: [...state] }, meta: { line: 1, vars: { concatString: concat } } };

  const Z = Array(concat.length).fill(0);
  let L = 0, R = 0, K = 0;
  for(let i=1; i<concat.length; i++) {
    if(i > R) {
      L = R = i;
      yield { action: "highlight", indices: [L, R], snapshot: { type: 'array', data: [...state] }, meta: { line: 6, vars: { pointer: i } } };
      while(R < concat.length && concat[R-L] === concat[R]) R++;
      Z[i] = R - L; R--;
    } else {
      K = i - L;
      if(Z[K] < R - i + 1) { Z[i] = Z[K]; }
      else {
        L = i;
        while(R < concat.length && concat[R-L] === concat[R]) R++;
        Z[i] = R-L; R--;
      }
    }
    if(Z[i] === pat.length) yield { action: "found", indices: Array.from({length:pat.length},(_,idx)=>i+idx), snapshot: { type: 'array', data: [...state] }, meta: { line: 17, vars: { matchedBaseIndex: i - pat.length - 1 } } };
  }
}
export const zAlgoCode = `function ZAlgorithm(text, pat) {
  let concat = pat + "$" + text;
  let l = concat.length;
  let Z = new Array(l).fill(0);
  let L = 0, R = 0, K;
  for(let i=1; i<l; i++) {
    if(i > R) {
      L = R = i;
      while(R < l && concat[R-L] === concat[R]) R++;
      Z[i] = R - L; R--;
    } else {
      K = i - L;
      if(Z[K] < R - i + 1) Z[i] = Z[K];
      else {
        L = i;
        while(R < l && concat[R-L] === concat[R]) R++;
        Z[i] = R - L; R--;
      }
    }
  }
  return Z;
}`;

export function* manacher(): Generator<Step<DSSnapshot>, void, unknown> {
  const s = "abacaba";
  let T = "#" + s.split("").join("#") + "#"; 
  const state = [...T];
  yield { action: "custom", indices: [], snapshot: { type: 'array', data: [...state] }, meta: { line: 1, vars: { transformedString: T } } };

  let N = T.length, P = Array(N).fill(0);
  let C = 0, R = 0;
  
  for(let i=1; i<N-1; i++) {
    let mirror = 2*C - i;
    if (R > i) P[i] = Math.min(R - i, P[mirror]);
    
    yield { action: "highlight", indices: [i, C], snapshot: { type: 'array', data: [...state] }, meta: { line: 6, vars: { trackingIndex: i, expandingCenter: C } } };
    
    while(i + 1 + P[i] < N && i - 1 - P[i] >= 0 && T[i + 1 + P[i]] === T[i - 1 - P[i]]) {
       P[i]++;
       yield { action: "compare", indices: [i + P[i], i - P[i]], snapshot: { type: 'array', data: [...state] }, meta: { line: 9, vars: { index: i, expansionRadius: P[i] } } };
    }
    
    if (i + P[i] > R) {
      C = i; R = i + P[i];
    }
    
    if(P[i] > 2) {
      yield { action: "found", indices: Array.from({length:2*P[i]+1},(_,idx)=>i-P[i]+idx), snapshot: { type: 'array', data: [...state] }, meta: { line: 14, vars: { currentPalindromeSize: P[i]*2 } } };
    }
  }
}
export const manacherCode = `function manacher(s) {
  let T = "#" + s.split("").join("#") + "#";
  let N = T.length, P = Array(N).fill(0);
  let C = 0, R = 0;
  for(let i=1; i<N-1; i++) {
    let mirror = 2*C - i;
    if (R > i) P[i] = Math.min(R - i, P[mirror]);
    while(i + 1 + P[i] < N && i - 1 - P[i] >= 0 && T[i + 1 + P[i]] === T[i - 1 - P[i]]) {
       P[i]++;
    }
    if (i + P[i] > R) {
      C = i; R = i + P[i];
    }
  }
  return P;
}`;
