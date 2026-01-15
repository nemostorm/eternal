import { strategyPatternPost } from './strategy-pattern-design-pattern';
import { singletonPatternPost } from './singleton-design-pattern';
import { repositoryPatternPost } from './repository-pattern';
import { nvidiaSpectrumXPost } from './nvidia-spectrum-x-switches';
import { dependencyInversionPost } from './dependency-inversion-principle';
import { aspNetCoreMiddlewarePost } from './aspnet-core-middleware-pattern';
import { csharpDotnetBackendPost } from './csharp-dotnet-backend-development';
import { rabbitMqDotnetPost } from './rabbitmq-dotnet-message-queues';
import { linuxPipingStreamsPost } from './linux-piping-streams';
import { algorithmsWhenToUsePost } from './algorithms-when-to-use';
import { BlogPost } from './types';

export const blogPosts: BlogPost[] = [
  rabbitMqDotnetPost,
  csharpDotnetBackendPost,
  linuxPipingStreamsPost,
  algorithmsWhenToUsePost,
  aspNetCoreMiddlewarePost,
  dependencyInversionPost,
  strategyPatternPost,
  singletonPatternPost,
  repositoryPatternPost,
  nvidiaSpectrumXPost
];

export * from './types';
