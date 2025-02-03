import { RolesListDto } from "../Dtos/RolesListDto";
import { ValidationResponse } from "./UserValidationResponse";

export interface RolesValidationResponse extends ValidationResponse {
    roles: RolesListDto[];
  }
  export interface RolesValidationPaginatedResponse extends ValidationResponse {
    roles: RolesListDto[];
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  }