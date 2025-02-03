import { ListWorkShiftDto } from "../Dtos/ListWorkShiftDto";
import { ValidationResponse } from "./UserValidationResponse";

export interface WorkShiftValidationResponse extends ValidationResponse {
    workShifts: ListWorkShiftDto[];
  }

  export interface WorkShiftValidationPaginatedResponse extends ValidationResponse {
    workShifts: ListWorkShiftDto[];
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  }