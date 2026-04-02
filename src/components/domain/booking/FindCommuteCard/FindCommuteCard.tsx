import React from 'react';
import { Image, ScrollView, StyleProp, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useTheme } from '../../../../theme/ThemeProvider';
import { SwText as Text } from '../../../common/SwText/SwText';
import { SwPickupDropInputCard } from '../../../common/SwPickupDropInputCard/SwPickupDropInputCard';
import PrimaryButton from '../../../common/SwButton/PrimaryButton/PrimaryButton';
import { ImageSource } from '../../../../constants/images';
import { useStyles } from './FindCommuteCard.styles';

export type FindCommuteCardDateTab = {
  id: string | number;
  title: string;
};

type Props = {
  pickupLocation: string;
  setPickupLocation: (v: string) => void;
  dropLocation: string;
  setDropLocation: (v: string) => void;
  onPressPickup: () => void;
  onPressDrop: () => void;
  dateTabs: FindCommuteCardDateTab[];
  activeDateIndex: number;
  onPressDateTab: (index: number) => void;
  onPressCalendar: () => void;
  onSwapLocations?: () => void;
  onSubmit: () => void;
  isSearching?: boolean;
  canSubmit?: boolean;
  submitButtonTitle?: string;
  containerStyle?: StyleProp<ViewStyle>;
};

export const FindCommuteCard = ({
  pickupLocation,
  setPickupLocation,
  dropLocation,
  setDropLocation,
  onPressPickup,
  onPressDrop,
  dateTabs,
  activeDateIndex,
  onPressDateTab,
  onPressCalendar,
  onSwapLocations,
  onSubmit,
  isSearching = false,
  canSubmit = true,
  submitButtonTitle = 'Search',
  containerStyle,
}: Props) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);

  return (
    <View style={[styles.card, containerStyle]}>
      <SwPickupDropInputCard
        pickupInputProps={{
          title: 'Pickup',
          placeholder: 'Enter pickup location',
          value: pickupLocation,
          onChangeText: setPickupLocation,
        }}
        dropInputProps={{
          title: 'Dropoff',
          placeholder: 'Enter drop location',
          value: dropLocation,
          onChangeText: setDropLocation,
        }}
        onPressPickup={onPressPickup}
        onPressDrop={onPressDrop}
        onSwap={onSwapLocations}
      />

      <View style={styles.dateSection}>
        <ScrollView contentContainerStyle={styles.dateList} horizontal showsHorizontalScrollIndicator={false}>
          {dateTabs.slice(0, 4).map((t, idx) => {
            const isActive = idx === activeDateIndex;
            return (
              <TouchableOpacity
                key={t.id}
                onPress={() => onPressDateTab(idx)}
                activeOpacity={0.8}
                style={[styles.dateTab, isActive && styles.activeDateTab]}
              >
                <Text style={isActive ? styles.activeDateText : styles.inactiveDateText}>
                  {t.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        <TouchableOpacity activeOpacity={0.8} onPress={onPressCalendar}>
          <Image source={ImageSource.calenderBlue} style={styles.calendarIcon} />
        </TouchableOpacity>
      </View>

      <View style={styles.btnContainer}>
        <PrimaryButton
          title={isSearching ? 'Searching...' : submitButtonTitle}
          btnStyle={styles.btnStyle}
          textStyle={styles.btnTextStyle}
          onPress={onSubmit}
          disabled={!canSubmit || isSearching}
        />
      </View>
    </View>
  );
};
