import { APIResponse } from "./Common";

export interface WorkFlowAPIResponse extends APIResponse{
    response: WorkFlowData;
}

export interface WorkFlowData{
    currentState: WorkFlowState,
    actionList: WorkFlowState[],
    action: WorkFlowState | null,
}

export interface WorkFlowState{
    id: number;
    name: string;
}