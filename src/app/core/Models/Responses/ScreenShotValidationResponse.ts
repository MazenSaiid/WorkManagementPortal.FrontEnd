import { ListWorkShiftDto } from "../Dtos/ListWorkShiftDto";
import { ValidationResponse } from "./UserValidationResponse";

// Define the ScreenShotLogDto interface to represent a single screenshot
export interface ScreenShotValidationResponse extends ValidationResponse {
  screenshots: ScreenShotLogDto[];
  }
  export interface ScreenShotLogDto{
    id: number;
    screenShotTime: string;  // DateTime in ISO format
    userId: string;
    userName: string;
    screenshotBase64: string;  // Base64 encoded image string
    workShift: ListWorkShiftDto | null;  // Nullable work shift data
  }