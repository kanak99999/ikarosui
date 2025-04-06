import { CRUDAPIResponse } from "./Common";

export interface CreateUserFormAPIResponse extends CRUDAPIResponse{
    body: Body;
}

export type RoleCategory = {
    id: number;
    name: string;
  };
  
  export type Role = {
    id: number;
    name: string;
    active: boolean;
    description: string;
    removalNotAllowed: boolean;
    global: boolean;
    roleCategory: RoleCategory;
  };
  
  export type Options = {
    data: Role[];
    size: number;
  };
  
  export type Field = {
    id: number;
    name: string;
    apiName: string;
    editableHtmlType: string;
    isMultiSelect?: boolean;
    options?: {
      api: string;
    };
    values?: string | number | string[];
  };
  
  export type UserData = {
    userRoles: {
      id: number;
      name: string;
      options: Options;
      apiName: string;
      editableHtmlType: string;
      values: Role[];
    };
    firstName: Field;
    lastName: Field;
    shortCodeId: Field;
    manager: Field;
    client: Field;
    description: Field;
    entityTypeId: Field;
    reviewer: Field;
    id: Field;
    userName: Field;
    email: Field;
  };
  
  export type Body = {
    data: UserData;
  };