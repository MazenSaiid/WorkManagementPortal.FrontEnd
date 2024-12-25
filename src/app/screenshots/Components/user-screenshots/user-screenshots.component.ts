import { Component, OnInit } from '@angular/core'; 
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-screenshots',
  templateUrl: './user-screenshots.component.html',
  styleUrls: ['./user-screenshots.component.scss']
})
export class UserScreenshotsComponent implements OnInit {
  userId: string | null = null;
  screenshots: any[] = [];  // Array to hold screenshots for the user
  userName: string | null = null;  // To hold the username (if available)
  workShiftName: string | undefined = '';
  workShiftType: any;
  selectedImage: any | null = null;  // Store the selected image

  constructor(private router: Router, private route: ActivatedRoute) {}

  // Method to open the modal and set the selected image
  viewImage(screenshot: any): void {
    console.log('Opening image: ', screenshot);
    this.selectedImage = screenshot;
    console.log('Opening image: ', this.selectedImage);
  }
  

  closeModal(): void {
    this.selectedImage = null;
  }

  ngOnInit(): void {
    const state = history.state;

    if (state && state.screenshots) {
      this.screenshots = state.screenshots;
      this.workShiftName = state.workShiftName;
      this.workShiftType = state.workShiftType;
      this.userId = state.userId;
      this.userName = state.userName;
    } else {
      console.error("No data passed via navigation state.");
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

  goBack(): void {
    this.router.navigate(['/screenshots/all']);  // Navigate to the screenshots/all route
  }
}
