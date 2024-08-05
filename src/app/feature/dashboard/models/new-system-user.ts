import { SystemUser } from './schemas/system-user';

export interface NewSystemUser extends SystemUser {
  password: string;
}
