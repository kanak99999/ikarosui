export type ReviewerOption = {
  id: number;
  name: string;
}
export type ReviewerOptions = ReviewerOption[];

export type ManagerOption = {
  id: number;
  name: string;
}
export type ManagerOptions = ManagerOption[];

 
 export interface APIResponse {
    responseCode: string;
    errorMessage: string;
    success:false;
    response: any;
 }
 export interface CRUDAPIResponse {
   body: any;
   status: string;
   header: any;
   actions: any;
 }

 export interface GetReviewerOptionsAPIResponse extends APIResponse{
  response: ReviewerOptions;
}

export interface GetManagerOptionsAPIResponse extends APIResponse{
  response: ManagerOptions;
}