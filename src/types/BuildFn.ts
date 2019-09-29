import { Middleware } from './Middleware';

export type BuildFn = (...args: Middleware[]) => Promise<void>;
