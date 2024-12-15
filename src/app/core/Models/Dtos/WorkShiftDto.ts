import { ShiftType } from "./ListWorkShiftDto";

export interface WorkShiftDto {
    shiftType: ShiftType;
    startTime: Date;
    endTime: Date; 
    shiftName: string;
  }
  