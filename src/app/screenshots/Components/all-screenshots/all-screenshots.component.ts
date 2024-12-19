import { Component } from '@angular/core';
import { ScreenShotLogDto, ScreenShotValidationResponse } from '../../../core/Models/Responses/ScreenShotValidationResponse';
import { ScreenshotsService } from '../../Services/screenshots.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-all-screenshots',
  templateUrl: './all-screenshots.component.html',
  styleUrl: './all-screenshots.component.scss'
})
export class AllScreenshotsComponent {
  screenshots: ScreenShotLogDto[] = [];
  selectedDate: Date = new Date(); // Initialize with current date

  constructor(private toastrService: ToastrService, private screenshotService: ScreenshotsService) { }

  ngOnInit(): void {
    this.loadScreenshots();
  }

  loadScreenshots(): void {
    this.screenshotService.getScreenshotsForAllUsers(this.selectedDate).subscribe({
      next: (response) => {
        if (response.success) {
          this.screenshots = response.screenshots; // Assuming the API response contains an array of screenshots
          console.log(this.screenshots);
        } else {
          this.toastrService.error(response.message, 'Error'); // Show error using Toastr
        }
      },
      error: (err) => {
        this.toastrService.error('An error occurred while fetching screenshots.', 'Error'); // Show error using Toastr
      }
      
    });
  }

  // Navigate to another component to show the screenshots of the selected user
  viewScreenshots(userId: string): void {
    // Navigate to another component with the userId and selectedDate as parameters
  }
}
