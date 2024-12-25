import { Component } from '@angular/core';
import { ScreenShotLogDto, ScreenShotValidationResponse, UserScreenShotLogDto } from '../../../core/Models/Responses/ScreenShotValidationResponse';
import { ScreenshotsService } from '../../Services/screenshots.service';
import { ToastrService } from 'ngx-toastr';
import { UserDto } from '../../../core/Models/Dtos/UserDto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-screenshots',
  templateUrl: './all-screenshots.component.html',
  styleUrl: './all-screenshots.component.scss'
})
export class AllScreenshotsComponent {
  userScreenshotsData: UserScreenShotLogDto[] = [];
  selectedDate: string = '';     // Store selected date
  filteredUserScreenshotsData: UserScreenShotLogDto[] = [];   // This will hold the filtered users
  searchText: string = '';  // This binds to the search input field
  constructor(private toastrService: ToastrService, private screenshotService: ScreenshotsService,private router: Router) { }

  ngOnInit(): void {
    const today = new Date();
    this.selectedDate = this.formatDateWithTime(today);
    
    this.loadUserScreenshots();
  }
  filterUsers() {
    if (!this.searchText) {
      // If no search text, show all users
      this.filteredUserScreenshotsData = this.userScreenshotsData;
    } else {
      // Filter users based on the search text (by full name)
      this.filteredUserScreenshotsData = this.userScreenshotsData.filter(screenshot => {
        const fullName = (screenshot.userName).toLowerCase();
        return fullName.includes(this.searchText.toLowerCase());
      });
    }
  }
  getImageUrl(fileContent: any): string {
    // Check if the fileContent is a Base64 string
    if (fileContent && fileContent.fileContents) {
      // Combine with the appropriate data URI prefix
      return `data:${fileContent.contentType};base64,${fileContent.fileContents}`;
    } else {
      return ''; // Return empty string if not Base64 (for debugging)
    }
  }
   

  loadUserScreenshots(): void {
    this.screenshotService.getScreenshotsForAllUsers(this.selectedDate).subscribe({
      next: (response) => {
        if (response.success) {
          this.userScreenshotsData =this.filteredUserScreenshotsData = response.userScreenShotLogDtos; // Assuming the API response contains an array of screenshots
          console.log(this.userScreenshotsData);
        } else {
          this.toastrService.error(response.message, 'Error'); // Show error using Toastr
        }
      },
      error: (err) => {
        this.toastrService.error('An error occurred while fetching screenshots.', 'Error'); // Show error using Toastr
      }
      
    });
  }

  viewScreenshots(userId: string, userName: string, workShiftName: string | undefined, workShiftType: any, screenshots: any[]) {
    this.router.navigate(['/screenshots/user-screenshots', userId], {
      state: {
        screenshots: screenshots,
        workShiftName: workShiftName,
        workShiftType: workShiftType,
        userId: userId,
        userName: userName
      }
    }
  );
  }
  
  
    // Handle date change and fetch work logs for the selected date
    onDateChange(event: any): void {
      this.selectedDate = event.target.value;  // Get the selected date (date part)
      if (this.selectedDate) {
        this.selectedDate = this.appendCurrentTime(this.selectedDate);  // Append current time
        this.loadUserScreenshots(); // Fetch logs for the selected date
      }
    }
     // Format the date with time (YYYY-MM-DD HH:mm:ss)
     formatDateWithTime(date: Date): string {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const seconds = date.getSeconds().toString().padStart(2, '0');
      
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
  
    // Append the current time to the selected date (in case user selects a date)
    appendCurrentTime(date: string): string {
      const currentDate = new Date();
      const hours = currentDate.getHours().toString().padStart(2, '0');
      const minutes = currentDate.getMinutes().toString().padStart(2, '0');
      const seconds = currentDate.getSeconds().toString().padStart(2, '0');
      
      return `${date} ${hours}:${minutes}:${seconds}`;
    }
}
