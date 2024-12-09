import { ShiftType } from "./ListWorkShiftDto";

export interface WorkShiftDto {
    shiftType: ShiftType;
    startTime: string;
    endTime: string; 
    shiftName: string;
  }
  