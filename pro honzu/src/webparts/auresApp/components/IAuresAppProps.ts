import { SPFI } from '@pnp/sp';
import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface IAuresAppProps {
  sp: SPFI;
  context: WebPartContext;
  hrEmails: string[];
}
