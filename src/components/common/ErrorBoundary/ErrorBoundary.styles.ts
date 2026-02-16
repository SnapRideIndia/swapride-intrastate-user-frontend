import { StyleSheet } from 'react-native';

export const ErrorBoundaryStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
    },
    errorContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#dc3545',
        marginBottom: 12,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#6c757d',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 22,
    },
    errorDetails: {
        width: '100%',
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 16,
        marginBottom: 24,
        borderLeftWidth: 4,
        borderLeftColor: '#dc3545',
    },
    errorDetailsTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#dc3545',
        marginBottom: 8,
    },
    errorMessage: {
        fontSize: 12,
        color: '#495057',
        fontFamily: 'monospace',
        marginBottom: 12,
    },
    errorStack: {
        fontSize: 10,
        color: '#6c757d',
        fontFamily: 'monospace',
        lineHeight: 14,
    },
    retryButton: {
        backgroundColor: '#007bff',
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderRadius: 8,
        minWidth: 120,
    },
    retryButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
});
