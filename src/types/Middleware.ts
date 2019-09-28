import { BuildContext } from './BuildContext';
import { Environment } from './Environment';

export type Middleware = (
  env: Environment,
  context: BuildContext,
) => Promise<BuildContext>;
