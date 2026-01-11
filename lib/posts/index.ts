import { strategyPatternPost } from './strategy-pattern-design-pattern';
import { singletonPatternPost } from './singleton-design-pattern';
import { nvidiaSpectrumXPost } from './nvidia-spectrum-x-switches';
import { BlogPost } from './types';

export const blogPosts: BlogPost[] = [
  strategyPatternPost,
  singletonPatternPost,
  nvidiaSpectrumXPost
];

export * from './types';
