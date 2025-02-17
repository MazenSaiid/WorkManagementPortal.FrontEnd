import { ListWorkShiftDto } from "../Dtos/ListWorkShiftDto";
import { ValidationResponse } from "./UserValidationResponse";

// Define the ScreenShotLogDto interface to represent a single screenshot
export interface ScreenShotValidationResponse extends ValidationResponse {
  userScreenShotLogDtos: UserScreenShotLogDto[];
  }
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
  export interface ScreenShotValidationPaginatedResponse extends ValidationResponse {
    userScreenShotLogDtos: UserScreenShotLogDto[];
      currentPage: number;
      pageSize: number;
      totalCount: number;
      totalPages: number;
    }