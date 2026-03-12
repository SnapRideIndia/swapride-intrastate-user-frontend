import React, { useEffect, useRef } from 'react';
import { ScrollView, TouchableOpacity, View, LayoutChangeEvent, Image } from 'react-native';
import { useTheme } from '../../../theme/ThemeProvider';
import { SwText as Text } from '../SwText/SwText';
import { useStyles } from './TopDateTabBar.styles';
import { ImageSource } from '../../../constants/images';

type TopDateTab = {
  id: string;
  title: string;
  date?: string;
};

type Props = {
  tabs: TopDateTab[];
  activeIndex: number;
  onTabPress: (index: number) => void;
  onPressCalendar?: () => void;
};

const TopDateTabBar: React.FC<Props> = ({ tabs, activeIndex, onTabPress, onPressCalendar }) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const scrollRef = useRef<ScrollView | null>(null);
  const tabLayouts = useRef<{ x: number; width: number }[]>([]);
  const scrollWidth = useRef(0);

  const scrollToIndex = (index: number) => {
    if (!scrollRef.current || !tabLayouts.current[index]) return;
    const { x, width } = tabLayouts.current[index];
    const offset = x - scrollWidth.current / 2 + width / 2;
    scrollRef.current.scrollTo({
      x: Math.max(0, offset),
      animated: true,
    });
  };

  const handleTabPress = (index: number) => {
    onTabPress(index);
    scrollToIndex(index);
  };

  const handleTabLayout = (index: number) => (e: LayoutChangeEvent) => {
    const { x, width } = e.nativeEvent.layout;
    tabLayouts.current[index] = { x, width };
  };

  useEffect(() => {
    if (tabs.length && tabLayouts.current[activeIndex]) {
      scrollToIndex(activeIndex);
    }
  }, [activeIndex, tabs.length]);

  const onScrollViewLayout = (e: LayoutChangeEvent) => {
    scrollWidth.current = e.nativeEvent.layout.width;
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContentContainer}
          style={styles.tabsScroll}
          onLayout={onScrollViewLayout}
        >
          {tabs.map((tab, index) => {
            const isActive = index === activeIndex;
            return (
              <TouchableOpacity
                key={tab.id}
                activeOpacity={0.7}
                onPress={() => handleTabPress(index)}
                onLayout={handleTabLayout(index)}
                style={styles.tabItem}
              >
              <Text
                variant={isActive ? 'semi-bold' : 'regular'}
                style={[styles.tabTitle, isActive && styles.tabTitleActive]}
                numberOfLines={1}
              >
                  {tab.title}
                </Text>
                {isActive && <View style={styles.indicator} />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {onPressCalendar && (
          <TouchableOpacity activeOpacity={0.8} onPress={onPressCalendar} style={styles.calendarButton}>
            <Image source={ImageSource.calenderBlue} style={styles.calendarIcon} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default TopDateTabBar;
