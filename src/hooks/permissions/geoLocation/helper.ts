import { Platform } from "react-native";
import { PERMISSIONS, Permission, RESULTS, PermissionStatus, checkLocationAccuracy, checkMultiple, requestMultiple } from "react-native-permissions";
import Geolocation from 'react-native-geolocation-service';

export const fallBackLocationConfig = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
};

export const loactionPermissions: Permission[] = Platform.OS === "android" ? [PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION, PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION] : [PERMISSIONS.IOS.LOCATION_WHEN_IN_USE];

export const initialMapRegion = {
    latitude: fallBackLocationConfig.latitude,
    longitude: fallBackLocationConfig.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
}

export const permissionStatusHelper = async (permissionStatuses: Record<Permission, PermissionStatus>)=>{
    const grantedAllPermissions = loactionPermissions.every((perm)=>permissionStatuses[perm] === RESULTS.GRANTED)
    
    // On iOS 14+, check location accuracy but don't require "full" - reduced accuracy still works
    const majorVersionIOS = parseInt(Platform.Version.toString(),10);
    if(Platform.OS === "ios" && majorVersionIOS >= 14){
        if (!grantedAllPermissions) {
            return false;
        }
        // Check accuracy but allow both "full" and "reduced" - both can get coordinates
        const locationAccuracy = await checkLocationAccuracy();
        console.log('iOS location accuracy:', locationAccuracy);
        // Return true if permission is granted, regardless of accuracy level
        // Reduced accuracy can still provide coordinates, just less precise
        return true;
    }
    return grantedAllPermissions;
}

export const checkPermissionsHelper = async()=>{
    try {
        const permissionStatuses = await checkMultiple(loactionPermissions);
        return permissionStatusHelper(permissionStatuses);
    } catch (error) {
        console.error("checkPermissions error - ", error);
        return false;
    }
}

export const requestPermissionHelper = async()=>{
    try {
        console.log('Requesting location permissions...');
        const permissionStatuses = await requestMultiple(loactionPermissions);
        console.log('Permission statuses:', permissionStatuses);
        
        const granted = await permissionStatusHelper(permissionStatuses);
        
        if(!granted){
            const majorVersionIOS = parseInt(Platform.Version.toString(),10);
            if(Platform.OS === "ios" && majorVersionIOS >= 14){
                const locationAccuracy = await checkLocationAccuracy();
                console.warn('iOS location accuracy:', locationAccuracy);
                if(locationAccuracy !== "full"){
                    console.warn('Location accuracy is not full. User may need to enable precise location in Settings.');
                }
            }
            console.warn('Location permission not granted. Status:', permissionStatuses);
        }
        return granted;
    } catch (error) {
        console.warn("Error requesting location permission: ", error);
        return false;
    }
}

const getLocationWithOptions = (options: Geolocation.GeoOptions): Promise<Geolocation.GeoPosition> => {
    return new Promise<Geolocation.GeoPosition>((resolve, reject) => {
        Geolocation.getCurrentPosition(
            position => {
                console.log('Location fetched successfully:', {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy
                });
                resolve(position);
            },
            error => {
                console.error('Geolocation error details:', {
                    code: error.code,
                    message: error.message,
                    platform: Platform.OS,
                    enableHighAccuracy: options.enableHighAccuracy
                });
                reject(error);
            },
            options
        );
    });
};

export const getCurrentLocationHelper = async () => {
    try {
        console.log('Starting getCurrentLocationHelper...');
        const granted = await requestPermissionHelper();
        if (!granted) {
            console.warn('Location permission not granted');
            throw new Error('Location permission not granted');
        }

        // On iOS, request authorization from react-native-geolocation-service
        // This ensures the geolocation service is properly initialized
        if (Platform.OS === 'ios') {
            try {
                const authorizationStatus = await Geolocation.requestAuthorization('whenInUse');
                console.log('Geolocation authorization status:', authorizationStatus);
                
                if (authorizationStatus !== 'granted') {
                    console.warn('Geolocation authorization not granted:', authorizationStatus);
                    // Still try to get location, as permission might be granted via react-native-permissions
                }
            } catch (authError) {
                console.warn('Error requesting geolocation authorization:', authError);
                // Continue anyway, as permission might already be granted
            }
        }

        // Configure geolocation options based on platform
        const highAccuracyOptions: Geolocation.GeoOptions = {
            enableHighAccuracy: true,
            timeout: 20000, // Increased timeout for iOS
            maximumAge: 10000,
        };

        // showLocationDialog is Android-specific and should not be used on iOS
        if (Platform.OS === 'android') {
            highAccuracyOptions.showLocationDialog = true;
        }

        console.log('Requesting location with high accuracy options:', highAccuracyOptions);

        try {
            // First attempt with high accuracy
            return await getLocationWithOptions(highAccuracyOptions);
        } catch (error: any) {
            // If high accuracy fails (especially on iOS with reduced accuracy), try with lower accuracy
            if (Platform.OS === 'ios' && (error.code === 2 || error.code === 3)) {
                console.warn('High accuracy failed, trying with reduced accuracy...');
                
                const reducedAccuracyOptions: Geolocation.GeoOptions = {
                    enableHighAccuracy: false,
                    timeout: 20000,
                    maximumAge: 10000,
                };

                try {
                    return await getLocationWithOptions(reducedAccuracyOptions);
                } catch (fallbackError: any) {
                    console.error('Fallback location request also failed:', fallbackError);
                    throw fallbackError;
                }
            }
            
            // Provide more specific error messages
            let errorMessage = 'Failed to get location';
            if (error.code === 1) {
                errorMessage = 'Location permission denied';
            } else if (error.code === 2) {
                errorMessage = 'Location unavailable';
            } else if (error.code === 3) {
                errorMessage = 'Location request timeout';
            }
            
            console.error(errorMessage);
            throw new Error(errorMessage);
        }
    } catch (error: any) {
        console.error('getCurrentLocation error:', error);
        return null;
    }
};

