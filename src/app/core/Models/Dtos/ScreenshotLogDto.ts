import { ListWorkShiftDto } from "./ListWorkShiftDto";

export interface UserScreenShotLogDto{
    userId: string;
    userName: string;
    workShift: ListWorkShiftDto | null;  // Nullable work shift data
    screenshots: ScreenShotLogDto[];
  }

  export interface ScreenShotLogDto{
    id: number;
    screenShotTime: string;
    screenshotFile: any;
  }

  export enum ActivityFilterStatus {
    All =51, 
    Idle,
    NonIdle,
  }