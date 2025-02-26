import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core'; 
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-screenshots',
  templateUrl: './user-screenshots.component.html',
  styleUrls: ['./user-screenshots.component.scss']
})
export class UserScreenshotsComponent implements OnInit{
  userId: string | null = null;
  screenshots: any[] = [];  // Full array of screenshots
  filteredScreenshots: any[] = []; // Array to hold filtered screenshots
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
  filterType: string = 'All';

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

      this.setFilter(this.filterType);
      this.getIdlePercentage();
    } else {
      console.error("No data passed via navigation state.");
    }
  }
  getIdlePercentage(): number {
    if (this.screenshots.length === 0) {
      return 0;
    }
    const idleCount = this.screenshots.filter(screenshot => screenshot.isIdle).length;
    return Math.round((idleCount / this.screenshots.length) * 100);
  }
  
  setFilter(filter: string): void {
    this.filterType = filter;
    this.updateFilteredScreenshots();
    this.updatePaginatedScreenshots();
  }

  updateFilteredScreenshots(): void {
    switch (this.filterType) {
      case 'Idle':
        this.filteredScreenshots = this.screenshots.filter(s => s.isIdle);
        console.log(this.filteredScreenshots);
        break;
      case 'NonIdle':
        this.filteredScreenshots = this.screenshots.filter(s => !s.isIdle);
        break;
      default:
        this.filteredScreenshots = [...this.screenshots];
        break;
    }
    this.totalCount = this.filteredScreenshots.length;
    this.totalPages = Math.ceil(this.totalCount / this.itemsPerPage);
  }

  updatePaginatedScreenshots(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedScreenshots = this.filteredScreenshots.slice(startIndex, endIndex);
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
