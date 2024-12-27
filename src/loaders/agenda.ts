import config from '../config';

export class SimpleJobScheduler {
  private jobs: Map<string, { handler: Function; options: any }>;
  private intervals: Map<string, NodeJS.Timeout>;
  private isRunning: boolean;

  constructor() {
    this.jobs = new Map();
    this.intervals = new Map();
    this.isRunning = false;
  }

  define(jobName: string, options: any, handler: Function) {
    this.jobs.set(jobName, { handler, options });
  }

  every(interval: string, jobName: string, data?: any) {
    const job = this.jobs.get(jobName);
    if (job && this.isRunning) {
      const intervalMs = this.parseInterval(interval);
      const timeoutId = setInterval(() => {
        job.handler(data);
      }, intervalMs);
      this.intervals.set(jobName, timeoutId);
    }
  }

  start() {
    this.isRunning = true;
  }

  stop() {
    this.isRunning = false;
    this.intervals.forEach((interval) => {
      clearInterval(interval);
    });
    this.intervals.clear();
  }

  private parseInterval(interval: string): number {
    const value = parseInt(interval);
    const unit = interval.slice(-1).toLowerCase();
    
    switch(unit) {
      case 's': return value * 1000;
      case 'm': return value * 60 * 1000;
      case 'h': return value * 60 * 60 * 1000;
      case 'd': return value * 24 * 60 * 60 * 1000;
      default: return value;
    }
  }
}

export default () => {
  return new SimpleJobScheduler();
};
