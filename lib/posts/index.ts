import { strategyPatternPost } from './strategy-pattern-design-pattern';
import { singletonPatternPost } from './singleton-design-pattern';
import { repositoryPatternPost } from './repository-pattern';
import { nvidiaSpectrumXPost } from './nvidia-spectrum-x-switches';
import { dependencyInversionPost } from './dependency-inversion-principle';
import { aspNetCoreMiddlewarePost } from './aspnet-core-middleware-pattern';
import { designPatternsAspNetCorePost } from './design-patterns-aspnet-core';
import { BlogPost } from './types';

export const blogPosts: BlogPost[] = [
  designPatternsAspNetCorePost,
  aspNetCoreMiddlewarePost,
  dependencyInversionPost,
  strategyPatternPost,
  singletonPatternPost,
  repositoryPatternPost,
  nvidiaSpectrumXPost
];

export * from './types';
