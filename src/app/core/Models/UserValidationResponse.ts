import { RolesListDto } from "./RolesListDto";
import { UserDto } from "./UserDto";

export interface ValidationResponse {
    success: boolean;
    message: string;
    token?: string;
  }
  
  export interface UserValidationResponse extends ValidationResponse {
    users: UserDto[];
  }

  
