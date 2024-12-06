export interface ListWorkShiftDto {
    id: number;
    shiftType: ShiftType;
    startTime: string;
    endTime: string; 
    shiftName: string;
    shiftTypeName: string;
  }
  
  export enum ShiftType {
    Morning =31,
    MidDay,
    Evening,
    Night,
    // Add other shift types as needed
  }
  