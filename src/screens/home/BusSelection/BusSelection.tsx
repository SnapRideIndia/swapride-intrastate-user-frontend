import { View } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '../../../theme/ThemeProvider'
import { useStyles } from './BusSelction.styles'
import PrimaryHeader from '../../../components/common/SwHeader/PrimaryHeader/PrimaryHeader'
import { useNavigation } from '@react-navigation/native'
import TopDateTabBar from '../../../components/common/TopDateTabBar/TopDateTabBar'
import { SwText as Text } from '../../../components/common/SwText/SwText'

const BusSelection = () => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const navigation = useNavigation();

  const [activeTabIndex, setActiveTabIndex] = useState(0);

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

  const monthShortNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const weekDayShortNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const tabs = useMemo(() => {
    const today = new Date();

    return Array.from({ length: 10 }).map((_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() + index);

      const isToday =
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();

      const dayWithSuffix = formatDayWithSuffix(date.getDate());
      const month = monthShortNames[date.getMonth()];
      const weekDay = weekDayShortNames[date.getDay()];

      const title = isToday
        ? `Today, ${dayWithSuffix} ${month}`
        : `${weekDay}, ${dayWithSuffix} ${month}`;

      return {
        id: `${date.getTime()}`,
        title,
      };
    });
  }, []);

  useEffect(() => {
    const renderHeader = () => <PrimaryHeader title={'Buses'} onEdit={() => { }} />;
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
        onTabPress={setActiveTabIndex}
      />

      <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
        <Text varient="medium" style={{ fontSize: 16 }}>
          Selected: {tabs[activeTabIndex]?.title}
        </Text>
      </View>
    </SafeAreaView>
  );
}

export default BusSelection;