import { User as UserModel } from '../../models/User';

declare global {
  namespace Express {
    // Extend the User interface
    interface User {
      id: string;
      email: string;
      name: string;
      skill_level: string;
    }
  }
}

export {};
