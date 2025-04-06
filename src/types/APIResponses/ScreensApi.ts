import {CRUDAPIResponse, ManagerOption, ReviewerOption} from './Common'

export interface ShowScreensAPIResponse extends CRUDAPIResponse{
    body: Body;
}

interface Body{
  data: ScreenData;
}

export interface Field {
id?: number;
name: string;
values?: string | number | String[];  // `values` can be either a string, number, or array of objects depending on the field.
apiName?: string;
editableHtmlType?: string;
isMultiSelect: boolean;
}

export interface ScreenData {
shortCodeId: Field;
manager: Field;
name: Field;
installationDate: Field;
description: Field;
entityTypeId: Field;
reviewer: Field;
id: Field;
}