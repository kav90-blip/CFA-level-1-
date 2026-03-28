import { Topic } from './types';
import { ethics } from './ethics';
import { quant } from './quant';
import { economics } from './economics';
import { fsa } from './fsa';
import { corporate } from './corporate';
import { equity } from './equity';
import { fixedIncome } from './fixedIncome';
import { derivatives } from './derivatives';
import { alternatives } from './alternatives';
import { portfolio } from './portfolio';

export const topics: Topic[] = [
  ethics,
  quant,
  economics,
  fsa,
  corporate,
  equity,
  fixedIncome,
  derivatives,
  alternatives,
  portfolio,
];

export type { Topic };
