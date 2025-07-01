// Performance monitoring and analytics
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  
  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Track page load times
  trackPageLoad(pageName: string) {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const loadTime = performance.now();
      this.sendMetric('page_load', pageName, loadTime);
    }
  }

  // Track user interactions
  trackUserAction(action: string, category: string, value?: number) {
    this.sendMetric('user_action', `${category}_${action}`, value);
  }

  // Track errors
  trackError(error: Error, context?: string) {
    this.sendMetric('error', context || 'unknown', 1, {
      message: error.message,
      stack: error.stack,
    });
  }

  // Track API response times
  trackAPICall(endpoint: string, duration: number, status: number) {
    this.sendMetric('api_call', endpoint, duration, { status });
  }

  private sendMetric(type: string, name: string, value?: number, metadata?: any) {
    // In production, send to your analytics service
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Metric] ${type}:${name}`, { value, metadata });
    }
    
    // Example: Send to analytics service
    // analytics.track(type, { name, value, metadata });
  }
}

// Error boundary for React components
export function withErrorBoundary<T extends object>(
  Component: React.ComponentType<T>
): React.ComponentType<T> {
  return function ErrorBoundaryWrapper(props: T) {
    const monitor = PerformanceMonitor.getInstance();
    
    try {
      return <Component {...props} />;
    } catch (error) {
      monitor.trackError(error as Error, Component.name);
      throw error;
    }
  };
}