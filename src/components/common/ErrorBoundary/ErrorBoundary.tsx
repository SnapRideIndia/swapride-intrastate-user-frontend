import { Component, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ErrorBoundaryStyles } from './ErrorBoundary.styles';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
    resetOnPropsChange?: boolean;
    resetKeys?: Array<string | number>;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
    private resetTimeoutId: NodeJS.Timeout | null = null;

    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error: Error): State {
        return {
            hasError: true,
            error,
            errorInfo: null,
        };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        this.setState({
            error,
            errorInfo,
        });

        // Call the onError callback if provided
        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }

        // Log error for debugging
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    componentDidUpdate(prevProps: Props) {
        const { resetKeys, resetOnPropsChange } = this.props;
        const { hasError } = this.state;

        if (hasError && prevProps.resetKeys !== resetKeys) {
            if (resetKeys && resetKeys.length > 0) {
                const hasResetKeyChanged = resetKeys.some(
                    (key, index) => key !== prevProps.resetKeys?.[index]
                );
                if (hasResetKeyChanged) {
                    this.resetErrorBoundary();
                }
            }
        }

        if (hasError && resetOnPropsChange && prevProps.children !== this.props.children) {
            this.resetErrorBoundary();
        }
    }

    componentWillUnmount() {
        if (this.resetTimeoutId) {
            clearTimeout(this.resetTimeoutId);
        }
    }

    resetErrorBoundary = () => {
        if (this.resetTimeoutId) {
            clearTimeout(this.resetTimeoutId);
        }

        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
    };

    render() {
        if (this.state.hasError) {
            // Custom fallback UI
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Default error UI
            return (
                <SafeAreaView edges={["top", "bottom"]} style={ErrorBoundaryStyles.container}>
                    <ScrollView contentContainerStyle={ErrorBoundaryStyles.scrollContainer} showsVerticalScrollIndicator={false}>
                        <View style={ErrorBoundaryStyles.errorContainer}>
                            <Text style={ErrorBoundaryStyles.title}>Oops! Something went wrong</Text>
                            <Text style={ErrorBoundaryStyles.subtitle}>
                                We're sorry, but something unexpected happened. Please try again.
                            </Text>

                            {__DEV__ && this.state.error && (
                                <View style={ErrorBoundaryStyles.errorDetails}>
                                    <Text style={ErrorBoundaryStyles.errorDetailsTitle}>Error Details:</Text>
                                    <Text style={ErrorBoundaryStyles.errorMessage}>
                                        {this.state.error.toString()}
                                    </Text>

                                    {this.state.errorInfo && (
                                        <Text style={ErrorBoundaryStyles.errorStack}>
                                            {this.state.errorInfo.componentStack}
                                        </Text>
                                    )}
                                </View>
                            )}

                            <TouchableOpacity
                                style={ErrorBoundaryStyles.retryButton}
                                onPress={this.resetErrorBoundary}
                                activeOpacity={0.8}
                            >
                                <Text style={ErrorBoundaryStyles.retryButtonText}>Try Again</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
