import { Image, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../../theme/ThemeProvider';
import { useStyles } from './HomeScreenHeader.styles';
import { ImageSource } from '../../../../constants/images';
import { SwText as Text } from '../../../common/SwText/SwText';
import { useNavigation } from '@react-navigation/native';
import { ScreenNames } from '../../../../navigation/constant';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { useGetNotificationStats } from '../../../../hooks/useNotification';
import { useWeather } from '../../../../hooks/useWeather';

const HomeScreenHeader = () => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const navigation = useNavigation();
  const drawer = navigation.getParent();
  const { profileData } = useSelector((store: RootState) => store.profile);
  const { data: notificationStats } = useGetNotificationStats();
  const unreadCount = notificationStats?.unreadCount ?? 0;
  const showUnreadBadge = unreadCount > 0;
  const unreadText = unreadCount > 99 ? '99+' : `${unreadCount}`;
  const { weather, loading } = useWeather();

  const openDrawer = () => {
    if (drawer && 'openDrawer' in drawer) {
      (drawer as { openDrawer: () => void }).openDrawer();
    }
  };

  const handlePressbellIcon = () => {
    navigation.navigate(ScreenNames.NOTIFICATION_SCREEN as never);
  };

  const getWeatherIcon = () => {
    if (!weather) return undefined;
    return { uri: `https://openweathermap.org/img/wn/${weather.icon}@2x.png` };
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View style={styles.innerContainer}>
        <TouchableOpacity onPress={openDrawer}>
          <Image source={ImageSource.menu} style={styles.menuIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handlePressbellIcon} style={styles.bellIconWrapper}>
          <Image source={ImageSource.bell} style={styles.bellIcon} />
          {showUnreadBadge && (
            <View style={styles.unreadBadge}>
              <Text variant="semi-bold" style={styles.unreadBadgeText}>
                {unreadText}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      <View style={[styles.innerContainer, { marginTop: 18, marginBottom: 14 }]}>
        <Text variant="medium" style={styles.greeting}>
          Good morning {profileData?.fullName?.split(' ')[0]},
        </Text>
        {!loading && weather && (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image source={getWeatherIcon()} style={styles.weatherIcon} />
            <Text variant="semi-bold" style={styles.tempText}>
              {Math.round(weather.temperature)}°C
            </Text>
            <Text variant="medium" style={styles.locationText}>
              {weather.city}
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default HomeScreenHeader;
