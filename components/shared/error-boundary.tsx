'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error caught by boundary:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-[200px] items-center justify-center p-4">
          <Alert variant="destructive" className="max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription className="mt-2">
              <p className="mb-4 text-sm">
                {this.state.error?.message || 'An unexpected error occurred'}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={this.handleRetry}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Try again
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    return this.props.children;
  }
}

interface ErrorDisplayProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorDisplay({
  title = 'Error loading data',
  message = 'Something went wrong. Please try again.',
  onRetry,
  className,
}: ErrorDisplayProps) {
  return (
    <div className={`flex min-h-[200px] items-center justify-center p-4 ${className || ''}`}>
      <Alert variant="destructive" className="max-w-md">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription className="mt-2">
          <p className="mb-4 text-sm">{message}</p>
          {onRetry && (
            <Button variant="outline" size="sm" onClick={onRetry} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>
          )}
        </AlertDescription>
      </Alert>
    </div>
  );
}
