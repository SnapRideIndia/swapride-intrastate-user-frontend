import { Image, ScrollView, View } from 'react-native'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '../../../theme/ThemeProvider'
import { useStyles } from './BusSelction.styles'
import PrimaryHeader from '../../../components/common/SwHeader/PrimaryHeader/PrimaryHeader'
import { useNavigation } from '@react-navigation/native'
import TopDateTabBar from '../../../components/common/TopDateTabBar/TopDateTabBar'
import { SwText as Text } from '../../../components/common/SwText/SwText'
import { ImageSource } from '../../../constants/images'
import BusSelectionCard from '../../../components/domain/busSelection/card/BusSelectionCard/BusSelectionCard'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../store'
import { setActiveDateIndex, setCommuteData } from '../../../slice/commuteSlice'
import { useSearchTrips } from '../../../hooks/useSearch'

const BusSelection = () => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {commuteData, dateTabs: storedTabs, activeDateIndex: storedActiveIndex, searchBaseParams} = useSelector((store: RootState)=>store.commute);

  const [activeTabIndex, setActiveTabIndex] = useState(storedActiveIndex ?? 0);
  const { mutate: searchTrips } = useSearchTrips(
    (data: any) => dispatch(setCommuteData(data)),
    (e: any) => console.log('searchTrips error >>>', e),
  );

  useEffect(() => {
    setActiveTabIndex(storedActiveIndex ?? 0);
  }, [storedActiveIndex]);

  const formatDayWithSuffix = (day: number) => {
    if (day > 3 && day < 21) return `${day}th`;
    switch (day % 10) {
      case 1:
        return `${day}st`;
      case 2:
        return `${day}nd`;
      case 3:
        return `${day}rd`;
      default:
        return `${day}th`;
    }
  };

  const monthShortNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const weekDayShortNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const fallbackTabs = useMemo(() => {
    const today = new Date();

    return Array.from({ length: 10 }).map((_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() + index);

      const isToday =
        date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();

      const dayWithSuffix = formatDayWithSuffix(date.getDate());
      const month = monthShortNames[date.getMonth()];
      const weekDay = weekDayShortNames[date.getDay()];

      const title = isToday ? `Today, ${dayWithSuffix} ${month}` : `${weekDay}, ${dayWithSuffix} ${month}`;

      return {
        id: `${date.getTime()}`,
        title,
        date: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`,
      };
    });
  }, []);

  const tabs = storedTabs?.length ? storedTabs : fallbackTabs;

  const handleTabPress = useCallback((index: number) => {
    setActiveTabIndex(index);
    dispatch(setActiveDateIndex(index));

    const tab = tabs[index] as any;
    const tripDate = tab?.date;
    if (!tripDate || !searchBaseParams) return;

    searchTrips({ ...searchBaseParams, tripDate });
  }, [dispatch, searchBaseParams, searchTrips, tabs]);

  useEffect(() => {
    const renderHeader = () => <PrimaryHeader title={'Buses'} onEdit={() => {}} />;
    navigation.setOptions({
      headerShown: true,
      header: renderHeader,
    });
  }, [navigation]);

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <TopDateTabBar
        tabs={tabs}
        activeIndex={activeTabIndex}
        onTabPress={handleTabPress}
      />
      <View style={styles.bannerCard}>
        <Text variant="semi-bold" style={styles.bannerText}>
          Showing nearest stops & bus timings on your route
        </Text>
        <Image source={ImageSource.shuttel} style={styles.shuttel} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainer}>
        {
          commuteData?.map((item, _idx)=> <BusSelectionCard key={item.routeId} showLabel={true} data={item} />)
        }
      </ScrollView>
    </SafeAreaView>
  );
};

export default BusSelection;
