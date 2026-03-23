import type { Step, DSSnapshot } from '../Step';

export function* towerOfHanoi(n: number): Generator<Step<DSSnapshot>, void, unknown> {
  let pegs: number[][] = [
    Array.from({length: n}, (_, i) => n - i),
    [],
    []
  ];

  yield {
    action: "custom",
    indices: [],
    snapshot: { type: 'hanoi', pegs: [ [...pegs[0]], [...pegs[1]], [...pegs[2]] ] },
    meta: { line: 1, vars: { n } }
  };

  function* moveDisk(source: number, dest: number): Generator<Step<DSSnapshot>, void, unknown> {
    const disk = pegs[source].pop()!;
    yield {
      action: "highlight",
      indices: [source, dest],
      snapshot: { type: 'hanoi', pegs: [ [...pegs[0]], [...pegs[1]], [...pegs[2]] ] },
      meta: { line: 3, vars: { source, dest, disk } }
    };
    
    pegs[dest].push(disk);

    yield {
      action: "swap",
      indices: [dest],
      snapshot: { type: 'hanoi', pegs: [ [...pegs[0]], [...pegs[1]], [...pegs[2]] ] },
      meta: { line: 6, vars: { source, dest, disk } }
    };
  }

  function* solve(diskCount: number, source: number, aux: number, dest: number): Generator<Step<DSSnapshot>, void, unknown> {
    if (diskCount === 1) {
       yield* moveDisk(source, dest);
       return;
    }
    yield { action: "custom", indices: [diskCount], snapshot: { type: 'hanoi', pegs: [ [...pegs[0]], [...pegs[1]], [...pegs[2]] ] }, meta: { line: 11, vars: { diskCount, status: "Recursively moving top bounds..." } } };
    
    yield* solve(diskCount - 1, source, dest, aux);
    yield* moveDisk(source, dest);
    yield* solve(diskCount - 1, aux, source, dest);
  }

  yield* solve(n, 0, 1, 2);

  yield {
    action: "found",
    indices: [],
    snapshot: { type: 'hanoi', pegs: [ [...pegs[0]], [...pegs[1]], [...pegs[2]] ] },
    meta: { line: 16, vars: { result: "Recursion Stack Solved!" } }
  };
}

export const towerOfHanoiCode = `function towerOfHanoi(n, source, aux, dest) {
  if (n === 1) {
    moveDisk(source, dest); // Target swap wrapper
    return;
  }
  // Step 1: Move n-1 disks from source => auxiliary peg
  towerOfHanoi(n - 1, source, dest, aux);
  
  // Step 2: Move remainder bottom largest disk from source => destination peg
  moveDisk(source, dest);
  
  // Step 3: Move n-1 disks from auxiliary => destination peg
  towerOfHanoi(n - 1, aux, source, dest);
}`;
