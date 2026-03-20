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

import strings from 'AuresAppWebPartStrings';
import AuresApp from './components/AuresApp';
import { IAuresAppProps } from './components/IAuresAppProps';

export interface IAuresAppWebPartProps {
  description: string;
  hrEmails: string;
}

export default class AuresAppWebPart extends BaseClientSideWebPart<IAuresAppWebPartProps> {
  private _sp!: SPFI;

  protected async onInit(): Promise<void> {
    await super.onInit();
    this._sp = spfi().using(SPFx(this.context));
  }

  public render(): void {
    const element: React.ReactElement<IAuresAppProps> = React.createElement(
      AuresApp,
      {
        sp: this._sp,
        context: this.context,
        hrEmails: (this.properties.hrEmails ?? '').split(',').map(e => e.trim()).filter(e => e.length > 0)
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
                PropertyPaneTextField('hrEmails', {
                  label: strings.HrEmailsFieldLabel,
                  multiline: true,
                  rows: 3
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
