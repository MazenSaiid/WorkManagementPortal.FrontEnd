import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-time-tracker',
  templateUrl: './time-tracker.component.html',
  styleUrls: ['./time-tracker.component.scss']
})
export class TimeTrackerComponent implements OnInit, OnDestroy {
  checkoutModalVisible: boolean = false;
  openCheckoutModal(){
    this.checkoutModalVisible =true;
  }
closeCheckoutModal(event: boolean) {
this.checkoutModalVisible = event;
}
  timeElapsed: number = 0;  // Total time spent (working + paused)
  timeWorked: number = 0;    // Time spent working in seconds
  timePaused: number = 0;    // Time spent paused in seconds (break + meeting)
  pauseTimeElapsed: number = 0; // Total time spent in pause (combined for break and meeting)
  
  workingInterval: any = null;  // Interval for working
  pausedInterval: any = null;   // Interval for paused time

  isWorking: boolean = false;   // Is the user currently working
  isPaused: boolean = false;    // Is the user currently paused
  isStopped: boolean = false;   // Has the timer been stopped

  pauseType: string = '';       // Type of pause (either "Break" or "Meeting")
  greetingMessage: string = ''; // Greeting message for the user

  constructor() {}

  ngOnInit(): void {
    this.updateGreetingMessage();
  }

  ngOnDestroy(): void {
    // Clean up intervals when the component is destroyed
    if (this.workingInterval) {
      clearInterval(this.workingInterval);
    }
    if (this.pausedInterval) {
      clearInterval(this.pausedInterval);
    }
  }

  // Set the greeting message based on the current time of day
  updateGreetingMessage(): void {
    const currentHour = new Date().getHours();
    if (currentHour >= 5 && currentHour < 12) {
      this.greetingMessage = 'Good Morning, Worker!\n Welcome back, Ready to get started?';
    } else if (currentHour >= 12 && currentHour < 18) {
      this.greetingMessage = 'Good Afternoon, Worker!\n Welcome back, Ready to get started?';
    } else {
      this.greetingMessage = 'Good Evening, Worker!\n Welcome back, Ready to get started?';
    }
  }

  // Start the working interval when "Check In" is clicked
  checkIn(): void {
    if (this.isWorking || this.isStopped) return;

    this.isWorking = true;
    this.isStopped = false;
    this.greetingMessage = 'You\'re currently working...';

    // Start working interval
    this.workingInterval = setInterval(() => {
      this.timeWorked++;    // Increment time spent working
      this.timeElapsed++;   // Increment total time
    }, 1000);
  }

  // Pause the working interval for a break
  pauseBreak(): void {
    if (this.isPaused) return;  // If already paused, do nothing

    this.isWorking = false;
    this.isPaused = true;
    this.pauseType = 'Break';
    this.greetingMessage = 'You\'re currently on a break...';

    // Stop the working interval
    clearInterval(this.workingInterval);

    // Start paused interval for break
    this.pausedInterval = setInterval(() => {
      this.timePaused++;          // Increment total paused time
      this.pauseTimeElapsed++;    // Increment total pause time
    }, 1000);
  }

  // Pause the working interval for a meeting
  pauseMeeting(): void {
    if (this.isPaused) return;  // If already paused, do nothing

    this.isWorking = false;
    this.isPaused = true;
    this.pauseType = 'Meeting';
    this.greetingMessage = 'You\'re currently in a meeting...';

    // Stop the working interval
    clearInterval(this.workingInterval);

    // Start paused interval for meeting
    this.pausedInterval = setInterval(() => {
      this.timePaused++;          // Increment total paused time
      this.pauseTimeElapsed++;    // Increment total pause time
    }, 1000);
  }

  // Resume the working interval when "Resume" is clicked
  resume(): void {
    if (this.isWorking) return;

    this.isWorking = true;
    this.isPaused = false;
    this.isStopped = false;
    this.greetingMessage = 'You\'re currently working...';

    // Stop paused interval
    clearInterval(this.pausedInterval);

    // Start working interval again
    this.workingInterval = setInterval(() => {
      this.timeWorked++;    // Increment time spent working
      this.timeElapsed++;   // Increment total time
    }, 1000);
  }

  // Stop the timer and finalize the time
  stop(): void {
    if (this.workingInterval) {
      clearInterval(this.workingInterval);  // Stop the working interval
    }
    if (this.pausedInterval) {
      clearInterval(this.pausedInterval);   // Stop the paused interval
    }

    this.isWorking = false;
    this.isPaused = false;
    this.isStopped = true;

    // Update greeting message with both worked and paused time
    this.greetingMessage = `Your total time worked is ${this.getFormattedTime()}.\nYour total paused time is ${this.getFormattedPauseTime()}.`;
  }

  // Format the time as HH:MM:SS
  formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(secs)}`;
  }

  getFormattedTime(): string {
    return this.formatTime(this.timeElapsed);
  }

  getFormattedPauseTime(): string {
    return this.formatTime(this.pauseTimeElapsed);
  }

  // Helper method to pad single digits with a leading zero
  private pad(value: number): string {
    return value < 10 ? '0' + value : value.toString();
  }
}
