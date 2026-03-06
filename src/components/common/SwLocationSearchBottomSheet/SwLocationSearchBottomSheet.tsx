import React, { forwardRef, useCallback, useMemo } from 'react';
import type { ImageSourcePropType } from 'react-native';
import { Image, ScrollView, TouchableOpacity, View } from 'react-native';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetTextInput,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../theme/ThemeProvider';
import { ImageSource } from '../../../constants/images';
import { SwText as Text } from '../SwText/SwText';
import { useStyles } from './SwLocationSearchBottomSheet.styles';

export type SwLocationSearchItem = {
  id: string;
  title: string;
  subtitle?: string;
  iconSource?: ImageSourcePropType;
};

type Props = {
  title: string;
  query: string;
  onChangeQuery: (text: string) => void;

  // Autocomplete search results shown as dropdown suggestions
  searchResults?: SwLocationSearchItem[];

  showUseCurrentLocation?: boolean;
  onPressUseCurrentLocation?: () => void;

  savedAddresses?: SwLocationSearchItem[];
  recentSearches?: SwLocationSearchItem[];

  onPressItem?: (item: SwLocationSearchItem) => void;
  onClose?: () => void;
};

export const SwLocationSearchBottomSheet = forwardRef<BottomSheetModal, Props>(
  (
    {
      title,
      query,
      onChangeQuery,
      searchResults = [],
      showUseCurrentLocation = true,
      onPressUseCurrentLocation,
      savedAddresses = [],
      recentSearches = [],
      onPressItem,
      onClose,
    },
    ref,
  ) => {
    const { colors } = useTheme();
    const styles = useStyles(colors);
    const insets = useSafeAreaInsets();

    const snapPoints = useMemo(() => ['90%'], []);

    const renderBackdrop = useCallback(
      (props: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} pressBehavior="close" />
      ),
      [],
    );

    const handleDismiss = useCallback(() => {
      onClose?.();
    }, [onClose]);

    const handleClosePress = useCallback(() => {
      // @ts-ignore - BottomSheetModal ref
      ref?.current?.dismiss?.();
    }, [ref]);

    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        enableDynamicSizing
        enablePanDownToClose
        onDismiss={handleDismiss}
        backdropComponent={renderBackdrop}
        backgroundStyle={styles.sheetBackground}
        handleIndicatorStyle={styles.handleIndicator}
      >
        <BottomSheetScrollView
          contentContainerStyle={[
            styles.content,
            // { paddingBottom: Math.max(insets.bottom, 20) },
          ]}
          // keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text varient="semi-bold" style={styles.title}>
              {title}
            </Text>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Close location search"
              onPress={handleClosePress}
              style={styles.closeButton}
            >
              <Image source={ImageSource.cross} style={styles.closeIcon} />
            </TouchableOpacity>
          </View>

          {/* Search input with absolutely positioned dropdown */}
          <View style={{ position: 'relative' }}>
            <View style={styles.searchContainer}>
              <Image source={ImageSource.searhIcon} style={styles.searchIcon} />
              <BottomSheetTextInput
                placeholder="Search your address"
                placeholderTextColor={'#AAAAAA'}
                value={query}
                onChangeText={onChangeQuery}
                style={styles.searchInput}
                autoCorrect={false}
                autoCapitalize="none"
                returnKeyType="search"
              />
            </View>

            {!!query && searchResults.length > 0 && (
              <View style={styles.dropdownContainer}>
                <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={true} nestedScrollEnabled>
                  {searchResults.map((item, idx) => (
                    <TouchableOpacity
                      key={item.id}
                      activeOpacity={0.85}
                      onPress={() => onPressItem?.(item)}
                      style={[styles.dropdownItem, idx === searchResults.length - 1 && styles.dropdownItemLast]}
                    >
                      <View style={styles.dropdownItemIcon}>
                        <Image source={item.iconSource ?? ImageSource.searhIcon} style={styles.dropdownItemIconImg} />
                      </View>
                      <View style={styles.dropdownItemTextWrap}>
                        <Text varient="medium" style={styles.dropdownItemTitle} numberOfLines={1}>
                          {item.title}
                        </Text>
                        {!!item.subtitle && (
                          <Text style={styles.dropdownItemSubtitle} numberOfLines={2}>
                            {item.subtitle}
                          </Text>
                        )}
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          {showUseCurrentLocation && (
            <TouchableOpacity onPress={onPressUseCurrentLocation} activeOpacity={0.85} style={styles.useCurrentLocationRow}>
              <View style={styles.useCurrentLocationIconWrap}>
                <Image source={ImageSource.gpsIcon} style={styles.useCurrentLocationIcon} />
              </View>
              <Text varient="semi-bold" style={styles.useCurrentLocationText}>
                Use current location
              </Text>
            </TouchableOpacity>
          )}

          {/* <View style={styles.divider} /> */}

          <Text varient="semi-bold" style={styles.sectionTitle}>
            Saved Addresses
          </Text>
          {savedAddresses.map((item, idx) => (
            <View key={item.id}>
              <TouchableOpacity activeOpacity={0.85} onPress={() => onPressItem?.(item)} style={styles.listRow}>
                <View style={styles.listIconWrap}>
                  <Image source={item.iconSource ?? ImageSource.Home} style={styles.listIcon} />
                </View>
                <View style={styles.listTextWrap}>
                  <Text varient="medium" style={styles.listTitle}>
                    {item.title}
                  </Text>
                  {!!item.subtitle && <Text style={styles.listSubtitle}>{item.subtitle}</Text>}
                </View>
              </TouchableOpacity>
            </View>
          ))}

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Recent Searches</Text>
          {recentSearches.map((item, idx) => (
            <View key={item.id}>
              <TouchableOpacity activeOpacity={0.85} onPress={() => onPressItem?.(item)} style={styles.listRow}>
                <View style={styles.listIconWrap}>
                  <Image source={item.iconSource ?? ImageSource.clock} style={styles.listIcon} />
                </View>
                <View style={styles.listTextWrap}>
                  <Text varient="semi-bold" style={styles.listTitle}>
                    {item.title}
                  </Text>
                  {!!item.subtitle && <Text style={styles.listSubtitle}>{item.subtitle}</Text>}
                </View>
              </TouchableOpacity>
              {idx !== recentSearches.length - 1 && <View style={styles.rowSeparator} />}
            </View>
          ))}
        </BottomSheetScrollView>
      </BottomSheetModal>
    );
  },
);
