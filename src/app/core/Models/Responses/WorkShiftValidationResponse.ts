import { ListWorkShiftDto } from "../Dtos/ListWorkShiftDto";
import { ValidationResponse } from "./UserValidationResponse";

export interface WorkShiftValidationResponse extends ValidationResponse {
    workShifts: ListWorkShiftDto[];
  }