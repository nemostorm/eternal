import { strategyPatternPost } from './strategy-pattern-design-pattern';
import { singletonPatternPost } from './singleton-design-pattern';
import { repositoryPatternPost } from './repository-pattern';
import { nvidiaSpectrumXPost } from './nvidia-spectrum-x-switches';
import { BlogPost } from './types';

export const blogPosts: BlogPost[] = [
  strategyPatternPost,
  singletonPatternPost,
  repositoryPatternPost,
  nvidiaSpectrumXPost
];

export * from './types';
