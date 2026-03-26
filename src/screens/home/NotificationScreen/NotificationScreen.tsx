import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
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
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

const NotificationScreen = () => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const navigation = useNavigation();

  const { data: notificationList, isLoading, isError, error, refetch } = useFetchNotificationList();
  console.log("This is Notification List ===>", notificationList);
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

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainer}>
        {notificationList?.map((item, _idx) => (
          <NotificationCard data={item} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default NotificationScreen;

const NotificationCard = ({ data }: { data: INotification }) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);


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

const handlePressNotficationCard = (id: string)=>{
  try {
    readNotification({id});
  } catch (error) {
    console.error("This is error >>>", id);
  }
}

  return (
    <TouchableOpacity style={[styles.cardContainer, !data.read && styles.unreadStyle]} onPress={()=>handlePressNotficationCard(data?.id)}>
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <Image source={ImageSource.shuttel} style={styles.shuttelIcon} />
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
