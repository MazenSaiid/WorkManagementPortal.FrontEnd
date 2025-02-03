import { ShiftType, WorkShiftDetailDto } from "./ListWorkShiftDto";

export interface WorkShiftDto {
    shiftType: ShiftType; 
    shiftName: string;
    isComplex: boolean;
    workShiftDetails?: WorkShiftDetailDto[];
  }
  