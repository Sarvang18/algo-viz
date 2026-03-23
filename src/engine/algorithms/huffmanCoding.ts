import type { Step, DSSnapshot } from '../Step';

export function* huffmanCoding(_arr: number[]): Generator<Step<DSSnapshot>, void, unknown> {
  // Character frequencies
  const chars = ['a', 'b', 'c', 'd', 'e', 'f'];
  const freqs = [5, 9, 12, 13, 16, 45];

  // Show frequencies as bars
  yield {
    action: "custom", indices: [],
    snapshot: { type: 'array', data: [...freqs] },
    meta: { line: 1, vars: { chars: chars.join(','), info: 'Character frequencies' } }
  };

  // Simulate Huffman building with a priority queue (array-based)
  interface HNode { freq: number; label: string; }
  const pq: HNode[] = chars.map((c, i) => ({ freq: freqs[i], label: c }));
  pq.sort((a, b) => a.freq - b.freq);

  let step = 0;
  while (pq.length > 1) {
    const display = pq.map(n => n.freq);

    yield {
      action: "compare", indices: [0, 1],
      snapshot: { type: 'array', data: display },
      meta: { line: 4, vars: { step: ++step, merge: `${pq[0].label}(${pq[0].freq}) + ${pq[1].label}(${pq[1].freq})`, queueSize: pq.length } }
    };

    const left = pq.shift()!;
    const right = pq.shift()!;
    const merged: HNode = { freq: left.freq + right.freq, label: `(${left.label}+${right.label})` };

    // Insert merged node back in sorted position
    let insertIdx = pq.findIndex(n => n.freq >= merged.freq);
    if (insertIdx === -1) insertIdx = pq.length;
    pq.splice(insertIdx, 0, merged);

    const newDisplay = pq.map(n => n.freq);
    yield {
      action: "found", indices: [insertIdx],
      snapshot: { type: 'array', data: newDisplay },
      meta: { line: 6, vars: { merged: merged.label, freq: merged.freq, queueSize: pq.length } }
    };
  }

  yield {
    action: "found", indices: [0],
    snapshot: { type: 'array', data: [pq[0].freq] },
    meta: { line: 10, vars: { root: pq[0].label, totalFreq: pq[0].freq, info: 'Huffman tree built' } }
  };
}

export const huffmanCodingCode = `function huffmanCoding(chars, freqs) {
  let pq = chars.map((c, i) => ({freq: freqs[i], label: c}));
  pq.sort((a, b) => a.freq - b.freq);
  while (pq.length > 1) {
    let left = pq.shift();
    let right = pq.shift();
    let merged = {freq: left.freq + right.freq,
      label: left.label + right.label};
    // Insert in sorted order
    let idx = pq.findIndex(n => n.freq >= merged.freq);
    if (idx === -1) idx = pq.length;
    pq.splice(idx, 0, merged);
  }
  return pq[0]; // root of Huffman tree
}`;
