import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// Test component that throws an error when button is pressed
const ErrorTestComponent = () => {
    const [shouldThrow, setShouldThrow] = useState(false);

    if (shouldThrow) {
        throw new Error('This is a test error to verify error boundary functionality');
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Error Boundary Test</Text>
            <Text style={styles.subtitle}>
                Click the button below to trigger an error and test the error boundary
            </Text>
            <TouchableOpacity
                style={styles.button}
                onPress={() => setShouldThrow(true)}
            >
                <Text style={styles.buttonText}>Trigger Error</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f8f9fa',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#333',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 32,
        color: '#666',
        lineHeight: 22,
    },
    button: {
        backgroundColor: '#dc3545',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default ErrorTestComponent;
