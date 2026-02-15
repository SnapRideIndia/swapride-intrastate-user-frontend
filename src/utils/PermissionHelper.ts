import { Platform, Alert } from 'react-native';
import {
    check,
    request,
    checkMultiple,
    requestMultiple,
    RESULTS,
    openSettings,
    Permission,
    PERMISSIONS,
} from 'react-native-permissions';

/**
 * Enum of supported permissions
 */
export enum PermissionType {
    LOCATION = 'location',
    CAMERA = 'camera',
    STORAGE = 'storage',
    MICROPHONE = 'microphone',
    CONTACTS = 'contacts',
    NOTIFICATIONS = 'notifications',
}

/**
 * Map logical permission types to platform-specific permissions
 */
const PermissionMap: Record<PermissionType, Permission[]> = {
    [PermissionType.LOCATION]: Platform.select({
        ios: [PERMISSIONS.IOS.LOCATION_WHEN_IN_USE],
        android: [PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION],
    })!,
    [PermissionType.CAMERA]: Platform.select({
        ios: [PERMISSIONS.IOS.CAMERA],
        android: [PERMISSIONS.ANDROID.CAMERA],
    })!,
    [PermissionType.STORAGE]: Platform.select({
        ios: [PERMISSIONS.IOS.PHOTO_LIBRARY],
        android: [
            PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
            PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
        ],
    })!,
    [PermissionType.MICROPHONE]: Platform.select({
        ios: [PERMISSIONS.IOS.MICROPHONE],
        android: [PERMISSIONS.ANDROID.RECORD_AUDIO],
    })!,
    [PermissionType.CONTACTS]: Platform.select({
        ios: [PERMISSIONS.IOS.CONTACTS],
        android: [PERMISSIONS.ANDROID.READ_CONTACTS],
    })!,
    [PermissionType.NOTIFICATIONS]: []
};

/**
 * Show alert and open app settings if permission is blocked
 */
const handleBlocked = (type: PermissionType) => {
    Alert.alert(
        'Permission Required',
        `Please enable ${type} permission from settings.`,
        [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => openSettings() },
        ]
    );
};

/**
 * Request a single logical permission
 */
export const requestSinglePermission = async (
    type: PermissionType
): Promise<'granted' | 'denied' | 'blocked'> => {
    const perms = PermissionMap[type];
    if (!perms) return 'denied';

    for (const perm of perms) {
        const status = await check(perm);

        if (status === RESULTS.GRANTED) continue;

        if (status === RESULTS.BLOCKED) {
            handleBlocked(type);
            return 'blocked';
        }

        const result = await request(perm);

        if (result === RESULTS.BLOCKED) {
            handleBlocked(type);
            return 'blocked';
        }

        if (result !== RESULTS.GRANTED) return 'denied';
    }

    return 'granted';
};

/**
 * Request multiple permissions at once
 */
export interface PermissionResult {
    granted: PermissionType[];
    denied: PermissionType[];
    blocked: PermissionType[];
}

export const requestMultiplePermissions = async (
    types: PermissionType[]
): Promise<PermissionResult> => {
    const allPerms = types.flatMap((t) => PermissionMap[t] || []);
    const statuses = await checkMultiple(allPerms);

    const toRequest = Object.entries(statuses)
        .filter(([_, s]) => s !== RESULTS.GRANTED)
        .map(([perm]) => perm);

    const reqResults = toRequest.length ? await requestMultiple(toRequest) : {};

    const granted: PermissionType[] = [];
    const denied: PermissionType[] = [];
    const blocked: PermissionType[] = [];

    for (const type of types) {
        const perms = PermissionMap[type] || [];
        const isGranted = perms.every(
            (p) => statuses[p] === RESULTS.GRANTED || reqResults[p] === RESULTS.GRANTED
        );
        const isBlocked = perms.some(
            (p) => statuses[p] === RESULTS.BLOCKED || reqResults[p] === RESULTS.BLOCKED
        );

        if (isBlocked) blocked.push(type);
        else if (isGranted) granted.push(type);
        else denied.push(type);
    }

    blocked.forEach((t) => handleBlocked(t));

    return { granted, denied, blocked };
};
