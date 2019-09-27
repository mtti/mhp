import { EmitFunc } from './EmitFunc';
import { WithVarsFunc } from './withVars';

export type MainArgs = {
  emit: EmitFunc;
  withVars: WithVarsFunc;
};
