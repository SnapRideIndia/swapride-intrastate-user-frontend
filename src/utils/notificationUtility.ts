import notifee, { AndroidImportance, EventType, Notification } from '@notifee/react-native';
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { requestNotificationPermission } from './PermissionHelper';
import { setFcmToken } from '../slice/authSlice';
import { store } from '../store';
import { storage } from './store';
import { StorageKeys } from '../constants/storage/storageKeys';

export const DEFAULT_CHANNEL_ID = 'default';

export const ensureFcmToken = async () => {
  const existingToken =
    store.getState().auth.fcm_token || storage.getString(StorageKeys.FCM_TOKEN) || '';

  if (existingToken) {
    if (!store.getState().auth.fcm_token) {
      store.dispatch(setFcmToken(existingToken));
    }
    return existingToken;
  }

  try {
    await messaging().registerDeviceForRemoteMessages();
    const token = await messaging().getToken();
    if (token) {
      store.dispatch(setFcmToken(token));
      storage.set(StorageKeys.FCM_TOKEN, token);
    }
    return token ?? '';
  } catch (error) {
    console.log('Error fetching FCM token:', error);
    return '';
  }
};

export const setupNotificationChannel = async () => {
  await notifee.createChannel({
    id: DEFAULT_CHANNEL_ID,
    name: 'Default',
    importance: AndroidImportance.HIGH,
  });
};

interface DisplayNotificationParams {
  title: string;
  body: string;
  data?: Record<string, string>;
}

export const displayLocalNotification = async ({ title, body, data }: DisplayNotificationParams) => {
  await setupNotificationChannel();

  await notifee.displayNotification({
    title,
    body,
    data,
    android: {
      channelId: DEFAULT_CHANNEL_ID,
      smallIcon: 'ic_launcher',
      pressAction: {
        id: 'default',
      },
    },
  });
};

const getRemoteMessageText = (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
  const titleFromNotification = remoteMessage.notification?.title;
  const bodyFromNotification = remoteMessage.notification?.body;
  const titleFromData = remoteMessage.data?.title;
  const bodyFromData = remoteMessage.data?.body;

  return {
    title: titleFromNotification ?? titleFromData ?? 'Notification',
    body: bodyFromNotification ?? bodyFromData ?? 'You have a new message',
  };
};

export const displayRemoteMessageNotification = async (
  remoteMessage: FirebaseMessagingTypes.RemoteMessage,
) => {
  const { title, body } = getRemoteMessageText(remoteMessage);
  const data = (remoteMessage.data ?? {}) as Record<string, string>;

  await displayLocalNotification({ title, body, data });
};

const registerMessagingForegroundHandler = () => {
  return messaging().onMessage(async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
    await displayRemoteMessageNotification(remoteMessage);
  });
};

const registerNotifeeForegroundEvents = () => {
  return notifee.onForegroundEvent(async ({ type, detail }) => {
    const { notification, pressAction } = detail;

    if (type === EventType.PRESS && pressAction?.id === 'default') {
      // Handle press on default action, e.g. navigate based on notification data
      console.log('Notification pressed in foreground:', notification?.id, notification?.data);
    }
  });
};

export const handleInitialNotification = async (): Promise<Notification | null> => {
  const initial = await notifee.getInitialNotification();

  if (initial) {
    const { notification, pressAction } = initial;
    console.log('App opened from notification:', notification?.id, notification?.data, pressAction);
    return notification ?? null;
  }

  return null;
};

export const initNotifications = async () => {
  const status = await requestNotificationPermission();

  if (status !== 'granted') {
    console.log('Notification permission not granted, status:', status);
    return () => {};
  }

  try {
    const token = await ensureFcmToken();
    console.log('FCM token:', token);
  } catch (error) {
    console.log('Error registering for remote messages:', error);
  }

  const unsubscribeMessaging = registerMessagingForegroundHandler();
  const unsubscribeNotifee = registerNotifeeForegroundEvents();

  return () => {
    unsubscribeMessaging();
    unsubscribeNotifee();
  };
};

export const onDisplayTestNotification = async () => {
  await displayLocalNotification({
    title: 'Notification Title',
    body: 'Main body content of the notification',
  });
};
