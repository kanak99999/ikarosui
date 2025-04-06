import {APIResponse} from '@/types/APIResponses/Common';

export interface HomeAPIData{
    listData: ListData
}

export interface HomeAPIResponse extends APIResponse{
    response: HomeAPIData
}
type ListData = {
    [key: string]: MenuChild[]; // Each key holds an array of MenuChild objects
  };
export interface MenuChild{
    id: string;
    name: string;
}
export interface MC{
    key:string,
    label:string
}