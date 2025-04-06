import {CRUDAPIResponse, ManagerOption, ReviewerOption} from './Common'

export interface ShowAdvertisementAPIResponse extends CRUDAPIResponse{
    body: Body;
}

interface Body{
  data: AdvertisementData;
}
export type Field ={
    id: number;
    name: string;
    apiName: string;
    editableHtmlType: 'date' | 'multiselect' | 'text' | 'number' | 'complexField';
    isMultiSelect: boolean;
    values?: string | number | string[]; // The `values` field can be a single value or an array depending on the context
  }
export interface mediaContent {
    "extension": string,
    "name": string,
    "mediaType": string,
    "key": string
}
export interface AdvertisementData {
    mediaContents:{
        id: number;
        name: string;
        values: mediaContent[];
        apiName: string;
    };
    shortCodeId: Field;
    manager: {
        id: number;
        name: string;
        values: (ManagerOption | undefined)[];
        options: {
          api: string;
        };
        apiName: string;
        isMultiSelect: boolean;
        editableHtmlType: string;
      };
    name: Field;
    description: Field;
    entityTypeId: Field;
    reviewer: {
        id: number;
        name: string;
        values: (ReviewerOption | undefined)[];
        options: {
          api: string;
        };
        apiName: string;
        isMultiSelect: boolean;
        editableHtmlType: string;
      };
    id: Field;
    advertisementType: Field;
  }