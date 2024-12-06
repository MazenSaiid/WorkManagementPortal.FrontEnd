import { RolesListDto } from "../Dtos/RolesListDto";
import { ValidationResponse } from "./UserValidationResponse";

export interface RolesValidationResponse extends ValidationResponse {
    roles: RolesListDto[];
  }