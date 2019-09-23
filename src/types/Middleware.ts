import { BuildContext } from './BuildContext';

export type Middleware = (context: BuildContext) => Promise<BuildContext>;
