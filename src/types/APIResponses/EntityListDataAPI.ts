import {APIResponse} from './Common'

export interface EntityListDataAPIResponse extends APIResponse{
    response: EntityListData;
}

export interface EntityListData{
    metadata: MetaData;
    listData:ListData;
    actions:Actions;
}
export interface MetaData{
    role:string;
    entityTypeId:string;
    columns:MetaColumn[];
}
export interface ListData{
    data:DataRow[];
    totalCount:number;
}

export interface Actions {
    [key : string]: Action
}

export interface MetaColumn {
    id:string;
    name:string;
    type:string;
    displayFormat:string;
    order:number;
    entityFiledId:string;
}
export type DataRow = DataColumn[];

export type DataColumn ={
    columnId:string;
    columnName:string;
    value:string;
}

export type Action ={
    api: string;
    requestType: string;
}