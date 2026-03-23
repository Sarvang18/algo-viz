import type { Step, DSSnapshot } from './Step';
import { setSteps } from '../store/visualizerSlice';
import { store } from '../store/store';

export const runAlgorithm = (
  generator: (input: any) => Generator<Step<DSSnapshot>, void, unknown>, 
  input: any, 
  initialSnapshot: DSSnapshot
) => {
  const gen = generator(input);
  const steps: Step<DSSnapshot>[] = [];
  
  const first = gen.next();
  if (!first.done) {
    if (first.value.action === 'custom') {
      steps.push(first.value);
    } else {
      steps.push({
        action: "custom",
        indices: [],
        snapshot: initialSnapshot,
        meta: { line: 1, vars: {} }
      });
      steps.push(first.value);
    }
  }

  for (const step of gen) {
    steps.push(step);
  }
  
  store.dispatch(setSteps(steps as any)); // cast safely for redux
};
