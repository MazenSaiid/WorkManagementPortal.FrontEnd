import { Component, OnInit } from '@angular/core'; 
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-screenshots',
  templateUrl: './user-screenshots.component.html',
  styleUrls: ['./user-screenshots.component.scss']
})
export class UserScreenshotsComponent implements OnInit {
  userId: string | null = null;
  screenshots: any[] = [];  // Full array of screenshots
  paginatedScreenshots: any[] = []; // Array to hold paginated screenshots
  userName: string | null = null;  // To hold the username (if available)
  workShiftName: string | undefined = '';
  workShiftType: any;
  isVisible: boolean = false;
  selectedImage: any | null = null;  // Store the selected image
  currentPage: number = 1;
  itemsPerPage: number = 15; 
  totalCount: number = 0;
  totalPages: number = 0;

  constructor(private router: Router, private route: ActivatedRoute) {}

  // Method to open the modal and set the selected image
  viewImage(screenshot: any): void {
    this.selectedImage = screenshot;  // Set the selected image
    this.isVisible = true;  // Open modal
  }
  
  onPageChange(page: number) {
    this.currentPage = page;
    this.updatePaginatedScreenshots();
  }

  closeModal(): void {
    this.selectedImage = null;
    this.isVisible = false;
  }

  ngOnInit(): void {
    const state = history.state;

    if (state && state.screenshots) {
      this.screenshots = state.screenshots;
      this.workShiftName = state.workShiftName;
      this.workShiftType = state.workShiftType;
      this.userId = state.userId;
      this.userName = state.userName;

      // Set totalCount and calculate totalPages
      this.totalCount = this.screenshots.length;
      this.totalPages = Math.ceil(this.totalCount / this.itemsPerPage);

      // Initialize paginated data
      this.updatePaginatedScreenshots();
    } else {
      console.error("No data passed via navigation state.");
    }
  }

  updatePaginatedScreenshots(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedScreenshots = this.screenshots.slice(startIndex, endIndex);
  }

  getImageUrl(fileContent: any): string {
    if (fileContent && fileContent.fileContents) {
      return `data:${fileContent.contentType};base64,${fileContent.fileContents}`;
    } else {
      return ''; // Return empty string if not Base64
    }
  }
  

  goBack(): void {
    this.router.navigate(['/screenshots/all']);  // Navigate to the screenshots/all route
  }
}
