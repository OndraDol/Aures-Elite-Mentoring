import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { spfi, SPFI } from '@pnp/sp';
import { SPFx } from '@pnp/sp/behaviors/spfx';
import { graphfi, GraphFI } from '@pnp/graph';
import { SPFx as GraphSPFx } from '@pnp/graph/behaviors/spfx';

import * as strings from 'AuresAppWebPartStrings';
import AuresApp from './components/AuresApp';
import { IAuresAppProps } from './components/IAuresAppProps';

export interface IAuresAppWebPartProps {
  description: string;
  hrEmail: string;
}

export default class AuresAppWebPart extends BaseClientSideWebPart<IAuresAppWebPartProps> {
  private _sp: SPFI;
  private _graph: GraphFI;

  protected async onInit(): Promise<void> {
    this._sp = spfi().using(SPFx(this.context));
    this._graph = graphfi().using(GraphSPFx(this.context));
  }

  public render(): void {
    const element: React.ReactElement<IAuresAppProps> = React.createElement(
      AuresApp,
      {
        sp: this._sp,
        graph: this._graph,
        context: this.context,
        hrEmail: this.properties.hrEmail ?? ''
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }),
                PropertyPaneTextField('hrEmail', {
                  label: 'HR Admin Group Email (prijemce notifikaci)'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
