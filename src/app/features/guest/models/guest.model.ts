import {Status} from './status.enum';

export interface Guest {
  id: number;
  name: string;
  transportation: boolean;
  status: Status | string;
  comment: string;
}
