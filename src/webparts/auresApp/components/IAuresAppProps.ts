import { SPFI } from '@pnp/sp';
import { GraphFI } from '@pnp/graph';
import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface IAuresAppProps {
  sp: SPFI;
  graph: GraphFI;
  context: WebPartContext;
  hrEmail: string;
}
