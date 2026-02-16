import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { useErrorReporting } from '../../hooks/useErrorReporting';
import ErrorBoundary from '../../components/common/ErrorBoundary/ErrorBoundary';
import { ScreenNames } from '../constant';
import HomeScreen from '../../screens/home/HomeScreen/HomeScreen';

const Stack = createNativeStackNavigator();

const ScreenWrapper = ({ children }: { children: React.ReactNode }) => {
    const { reportError } = useErrorReporting({
        logToConsole: true,
        showAlert: false,
    });

    return (
        <ErrorBoundary onError={reportError}>
            {children}
        </ErrorBoundary>
    );
};


const AppNavigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{ headerShown: false }}
                initialRouteName={ScreenNames.HOME_SCREEN}
            >
                 <Stack.Screen name={ScreenNames.HOME_SCREEN}>
                    {(props: any) => (
                        <ScreenWrapper>
                           <HomeScreen />
                        </ScreenWrapper>
                    )}
                </Stack.Screen>
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default AppNavigation;

const styles = StyleSheet.create({})