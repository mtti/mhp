import { EmitFunc } from './EmitFunc';

export type WithVarsArgs = {
  emit: EmitFunc;
  withVars: WithVarsFunc;
};

export type WithVarsBody = (args: WithVarsArgs) => Promise<void>;

export type WithVarsFunc = (
  vars: Record<string, unknown>,
  body: WithVarsBody,
) => Promise<void>;
