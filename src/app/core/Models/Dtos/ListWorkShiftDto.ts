export interface ListWorkShiftDto {
    id: number;
    shiftType: ShiftType;
    shiftName: string;
    shiftTypeName: string;
    isComplex: boolean;
    workShiftDetails?: WorkShiftDetailDto[];
  }
  export interface WorkShiftDetailDto {
    day: DayOfWeek;    // Day of the week for this work shift detail
    startTime: string; // Serialized TimeOnly as string
    endTime: string;   // Serialized TimeOnly as string
  }
  
  // Enum for DayOfWeek based on .NET
  export enum DayOfWeek {
    Sunday = 0,
    Monday = 1,
    Tuesday = 2,
    Wednesday = 3,
    Thursday = 4,
    Friday = 5,
    Saturday = 6,
  }
  export enum ShiftType {
    Morning =31,
    MidDay,
    Evening,
    Night,
    // Add other shift types as needed
  }
  
  