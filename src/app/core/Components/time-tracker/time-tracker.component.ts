import { Component, OnDestroy, OnInit } from '@angular/core';
@Component({
  selector: 'app-time-tracker',
  templateUrl: './time-tracker.component.html',
  styleUrl: './time-tracker.component.scss'
})
export class TimeTrackerComponent implements OnInit, OnDestroy {
  timeElapsed: number = 0;  // Total time spent (working + paused)
  timeWorked: number = 0;   // Time spent working in seconds
  timePaused: number = 0;   // Time spent paused in seconds (break + meeting)
  breakTime: number = 0;    // Time spent on break pauses in seconds
  meetingTime: number = 0;  // Time spent on meeting pauses in seconds
  workingInterval: any = null;  // Interval for working
  pausedInterval: any = null;   // Interval for paused time
  isWorking: boolean = false;  // Is the user currently working
  isPaused: boolean = false;   // Is the user currently paused
  pauseType: string = '';      // Type of pause (either "Break" or "Meeting")
  isStopped: boolean = false;  // Has the timer been stopped
  greetingMessage: string = '';  // Greeting message for the user

  // Chart data
  chartOptions: any;

  constructor() {}

  ngOnInit(): void {
    this.updateGreetingMessage();
    this.initializeChart(); // Initialize the chart
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
      this.timeWorked++;   // Increment time spent working
      this.timeElapsed++;  // Increment total time
      this.updateChartData();  // Update chart data
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
      this.breakTime++;   // Increment break time
      this.timePaused++;  // Increment total paused time
      this.updateChartData();  // Update chart data
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
      this.meetingTime++;  // Increment meeting time
      this.timePaused++;   // Increment total paused time
      this.updateChartData();  // Update chart data
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
      this.timeWorked++;   // Increment time spent working
      this.timeElapsed++;  // Increment total time
      this.updateChartData();  // Update chart data
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
    this.greetingMessage = `Your total time worked is ${this.getFormattedTime()}.`;

    this.updateChartData();  // Update chart data
  }

  // Format the time as HH:MM:SS
  getFormattedTime(): string {
    const hours = Math.floor(this.timeElapsed / 3600);
    const minutes = Math.floor((this.timeElapsed % 3600) / 60);
    const seconds = this.timeElapsed % 60;
    return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`;
  }

  // Helper method to pad single digits with a leading zero
  private pad(value: number): string {
    return value < 10 ? '0' + value : value.toString();
  }

  // Initialize chart options
  initializeChart(): void {
    this.chartOptions = {
      theme: "light2", // Chart theme
      title: {
        text: "Time Tracker Summary", // Chart title
        fontSize: 24,  // Font size for the title
      },
      animationEnabled: true, // Enable animation
      data: [{
        type: "pie",  // Pie chart
        indexLabel: "{label}: {y} seconds",  // Format for pie slices
        indexLabelFontSize: 14,  // Font size for the index labels
        toolTipContent: "{label}: {y} seconds",  // Tooltip content
        dataPoints: [
          { label: "Working", y: this.timeWorked },
          { label: "Paused (Break)", y: this.breakTime },
          { label: "Paused (Meeting)", y: this.meetingTime },
          { label: "Total", y: this.timeElapsed }
        ]
      }]
    };
  }

  // Update the chart with new values (working, paused, total time)
  updateChart(): void {
    this.chartOptions.data[0].dataPoints = [
      { label: "Working", y: this.timeWorked },
      { label: "Paused (Break)", y: this.breakTime },
      { label: "Paused (Meeting)", y: this.meetingTime },
      { label: "Total", y: this.timeElapsed + this.timePaused }
    ];
  }

  // Call this method whenever the time is updated (checkIn, pause, resume, stop)
  updateChartData(): void {
    this.updateChart();  // Update chart data points
    this.chartOptions = { ...this.chartOptions };  // Trigger chart re-render
  }
}


