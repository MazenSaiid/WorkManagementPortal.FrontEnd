import { UserScreenShotLogDto } from "../Dtos/ScreenshotLogDto";
import { ValidationResponse } from "./UserValidationResponse";

// Define the ScreenShotLogDto interface to represent a single screenshot
export interface ScreenShotValidationResponse extends ValidationResponse {
  userScreenShotLogDtos: UserScreenShotLogDto[];
  }

  export interface ScreenShotValidationPaginatedResponse extends ValidationResponse {
    userScreenShotLogDtos: UserScreenShotLogDto[];
      currentPage: number;
      pageSize: number;
      totalCount: number;
      totalPages: number;
    }
