import { ActivityIndicator, Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../theme/ThemeProvider';
import { useStyles } from './NotificationScreen.styles';
import PrimaryHeader from '../../../components/common/SwHeader/PrimaryHeader/PrimaryHeader';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { ImageSource } from '../../../constants/images';
import { SwText as Text } from '../../../components/common/SwText/SwText';
import { useFetchNotificationList, useMarkAllNotificationsRead, useSingleNotificationRead } from '../../../hooks/useNotification';
import { INotification } from '../../../types/notificationsList.types';
import { NoResults } from '../../../components/common/NoResults/NoResults';
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { handleNotificationNavigation } from '../../../utils/notificationNavigation';
dayjs.extend(duration);

const NotificationScreen = () => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const navigation = useNavigation();

  const { data: notificationList, isLoading, isError, error, refetch } = useFetchNotificationList();
  console.log("=== Notification List ===", JSON.stringify(notificationList, null, 2));
  const { mutate: markAllNotificationsRead } = useMarkAllNotificationsRead();


  useEffect(() => {
    const renderHeader = () => <PrimaryHeader title={'Notification'} />;
    navigation.setOptions({
      headerShown: true,  
      header: renderHeader,
    });
  }, [navigation]);

  useFocusEffect(
    React.useCallback(() => {
      markAllNotificationsRead();
    }, [markAllNotificationsRead]),
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      {notificationList?.length === 0 ? (
        <View style={styles.loadingContainer}>
          <NoResults
            image={ImageSource.noNotificationsFound}
            title="No notifications yet"
            subtitle="Updates and alerts will appear here."
          />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainer}>
          {notificationList?.map((item, _idx) => (
            <NotificationCard key={item.id ?? _idx} data={item} />
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default NotificationScreen;

const NotificationCard = ({ data }: { data: INotification }) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const navigation = useNavigation<any>();


  const onSuccessNotificationRead = (data: any)=>{
    console.log("This is read notification response data ===>", data);
  };

  const onErrorNotificationRead = (error: any)=>{
    console.error("This is read notification error ===>", error?.toString())
  };

  const {mutate: readNotification} = useSingleNotificationRead(onSuccessNotificationRead, onErrorNotificationRead)

const getTimeAgo = (createdAt: string) => {
  const diff = dayjs.duration(dayjs().diff(dayjs(createdAt)));

  const days = diff.days();
  const hours = diff.hours();
  const minutes = diff.minutes();

  if (diff.asDays() >= 1) {
    return `${Math.floor(diff.asDays())}d ${hours}h ago`;
  } else if (diff.asHours() >= 1) {
    return `${Math.floor(diff.asHours())}h ${minutes}m ago`;
  } else {
    return `${Math.floor(diff.asMinutes())}m ago`;
  }
};

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'BOOKING':
    case 'BOOKING_ERROR':
      return ImageSource.ticket;
    case 'WALLET_UPDATE':
      return ImageSource.wallet;
    case 'PROXIMITY_ALERT':
    case 'TRIP_UPDATE':
      return ImageSource.shuttel;
    case 'STOP_SUGGESTION':
      return ImageSource.suggestYourStops;
    case 'RENTAL_REQUEST':
      return ImageSource.busOutline;
    default:
      return ImageSource.bell;
  }
};

const handlePressNotficationCard = (notification: INotification)=>{
  try {
    readNotification({id: notification.id});
    handleNotificationNavigation(notification, navigation);
  } catch (error) {
    console.error("This is error >>>", notification.id);
  }
}

  return (
    <TouchableOpacity style={[styles.cardContainer, !data.read && styles.unreadStyle]} onPress={()=>handlePressNotficationCard(data)}>
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <Image 
            source={getNotificationIcon(data.type)} 
            style={[
              styles.shuttelIcon, 
              getNotificationIcon(data.type) === ImageSource.bell && { 
                tintColor: colors.primaryLight,
                width: 20,
                height: 20 
              }
            ]} 
          />
        </View>
        <View style={{ flex: 1, gap: 8 }}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text variant="semi-bold" style={styles.title}>
              {data.title}
            </Text>
            <Text variant="semi-bold" style={styles.min}>
              {getTimeAgo(data?.createdAt)}
            </Text>
          </View>
          <Text variant="medium" style={styles.subTitle}>
            {data?.content}
          </Text>
        </View>
      </View>
      {
        data?.metadata?.images && <ScrollView
          style={{ marginTop: 29 }}
          contentContainerStyle={{
            flexGrow: 1,
            flexDirection: 'row',
            gap: 10,
            borderRadius: 15,
          }}
          showsHorizontalScrollIndicator={false}
          horizontal
        >
          {data?.metadata?.images?.map((item, index) => (
            <View
              key={`img-${index}`}
              style={{
                width: 214,
                height: 123,
                backgroundColor: 'gray',
                borderRadius: 15,
                overflow: "hidden"
              }}
            >
              <Image source={{uri: item}} style={{width: "100%", height: "100%", resizeMode: "contain"}} />
            </View>
          ))}
        </ScrollView>
      }
    </TouchableOpacity>
  );
};
