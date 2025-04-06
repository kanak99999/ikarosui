import exp from 'constants';
import {CRUDAPIResponse, ManagerOption, ReviewerOption} from './Common'

export interface ShowPartnerAPIResponse extends CRUDAPIResponse{
    body: Body;
}

interface Body{
  data: ShowPartnerData;
}
export type Field ={
    id: number;
    name: string;
    apiName: string;
    editableHtmlType: 'date' | 'multiselect' | 'text' | 'number' | 'complexField';
    isMultiSelect: boolean;
    values?: string | number | string[]; // The `values` field can be a single value or an array depending on the context
  }
  interface Role {
    name: string;
    roleCategory: Field;
    description: string;
    active: boolean;
    removalNotAllowed: boolean;
    global: boolean;
    id: number;
  }
  export type ShowPartnerData = {
    establishedDate: Field;
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
    userRoles: {
      id: number;
      name: string;
      values: (Role | undefined)[];
      options: {
        data: (Role | undefined)[];
      };
      apiName: string;
      editableHtmlType: string;
    };
    businessClass: Field;
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
    shortCodeId: Field;
    industryType: Field;
    screens: Field;
    businessCategory: Field;
    name: Field;
    averageSellingPrice: Field;
    alias: Field;
    location: Field;
    entityTypeId: Field;
    id: Field;
    email: Field;
  }
  