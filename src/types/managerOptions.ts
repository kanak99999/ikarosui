export interface ManagerOptionsApiResponse{
    responseCode: string;
    errorMessage: string;
    success:false;
    response: managerOption[];
}

type managerOption = {
    id:number,
    name:string
}