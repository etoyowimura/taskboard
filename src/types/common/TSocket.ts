import { TCall } from "../CallRequests/TCall";
import { TRequests } from "../Requests/TRequests";
import { TTask } from "../Tasks/TTasks";

export type TSocket = {
    type: string;
    task?: TTask;
    callback_request?: TCall;
    driver_request?: TRequests; 
  };
  