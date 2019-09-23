import { Middleware } from './Middleware';

export type EmitFunc = (
  uri: string,
  ...middleware: Middleware[]
) => Promise<void>;
