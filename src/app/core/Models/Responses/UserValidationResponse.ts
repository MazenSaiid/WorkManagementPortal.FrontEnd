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
  export interface UserValidationPaginatedResponse extends ValidationResponse {
    users: UserDto[];
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
}

  export interface AccountServiceValidationResponse extends ValidationResponse {
    username?: string;
    roles?: string[];
    localSessionExpiryDate?: string;
  }

  
