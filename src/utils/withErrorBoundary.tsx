import React, { ComponentType } from 'react';
import ErrorBoundary from '../components/ErrorBoundary/ErrorBoundary';

interface WithErrorBoundaryOptions {
    fallback?: React.ReactNode;
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
    resetOnPropsChange?: boolean;
    resetKeys?: Array<string | number>;
}

export function withErrorBoundary<P extends object>(
    WrappedComponent: ComponentType<P>,
    options: WithErrorBoundaryOptions = {}
) {
    const WithErrorBoundaryComponent = (props: P) => {
        return (
            <ErrorBoundary {...options}>
                <WrappedComponent {...props} />
            </ErrorBoundary>
        );
    };

    WithErrorBoundaryComponent.displayName = `withErrorBoundary(${WrappedComponent.displayName || WrappedComponent.name})`;

    return WithErrorBoundaryComponent;
}
