import type { AlgorithmInput, Step, DSSnapshot } from './Step';
import { setSteps } from '../store/visualizerSlice';
import { store } from '../store/store';

export type AlgorithmGenerator = (input: never) => Generator<Step<DSSnapshot>, void, unknown>;

const MAX_VISUALIZATION_STEPS = 10_000;

const cloneStep = (step: Step<DSSnapshot>): Step<DSSnapshot> => ({
  action: step.action,
  indices: [...step.indices],
  snapshot: structuredClone(step.snapshot),
  meta: {
    line: step.meta.line,
    vars: structuredClone(step.meta.vars),
  },
});

export const runAlgorithm = (
  generator: AlgorithmGenerator,
  input: AlgorithmInput,
  initialSnapshot: DSSnapshot
) => {
  const gen = generator(input as never);
  const steps: Step<DSSnapshot>[] = [];

  for (let next = gen.next(); !next.done; next = gen.next()) {
    if (steps.length === 0 && next.value.action !== 'custom') {
      steps.push({
        action: "custom",
        indices: [],
        snapshot: structuredClone(initialSnapshot),
        meta: { line: 1, vars: {} },
      });
    }

    steps.push(cloneStep(next.value));

    if (steps.length >= MAX_VISUALIZATION_STEPS) {
      steps.push({
        action: 'custom',
        indices: [],
        snapshot: structuredClone(next.value.snapshot),
        meta: {
          line: next.value.meta.line,
          vars: { notice: `Visualization stopped at ${MAX_VISUALIZATION_STEPS.toLocaleString()} steps.` },
        },
      });
      break;
    }
  }

  store.dispatch(setSteps(steps));
};
