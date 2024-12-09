import { RolesListDto } from "../Dtos/RolesListDto";
import { UserDto } from "../Dtos/UserDto";

export interface ValidationResponse {
  success: boolean;
  message: string;
  token?: string;
  }
  
  export interface UserValidationResponse extends ValidationResponse {
    users: UserDto[];
  }
  export interface AccountServiceValidationResponse extends ValidationResponse {
    username?: string;
    roles?: string[];
    localSessionExpiryDate?: string;
  }

  
