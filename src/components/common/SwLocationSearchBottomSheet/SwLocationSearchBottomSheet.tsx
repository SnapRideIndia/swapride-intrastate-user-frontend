import React, { forwardRef, useCallback, useMemo } from 'react';
import { Image, TouchableOpacity, View, Dimensions } from 'react-native';
import { Easing } from 'react-native-reanimated';
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
import { SwLocationSearchItem } from '../../../types/placeAutofill.types';
import { LocationSearchRowSkeleton } from '../../domain/locationSearch';

type Props = {
  title: string;
  query: string;
  onChangeQuery: (text: string) => void;

  searchResults?: SwLocationSearchItem[];

  showUseCurrentLocation?: boolean;
  onPressUseCurrentLocation?: () => void;

  savedAddresses?: SwLocationSearchItem[];
  recentSearches?: SwLocationSearchItem[];

  isSearchResultsLoading?: boolean;
  isSavedAddressesLoading?: boolean;
  isRecentSearchesLoading?: boolean;

  onPressItem?: (item: SwLocationSearchItem) => void;
  onClose?: () => void;
  hideBackdrop?: boolean;
  onChange?: (index: number) => void;
};

const SEARCH_RESULTS_SKELETON_COUNT = 4;
const SAVED_RECENT_SKELETON_COUNT = 3;

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
      isSearchResultsLoading = false,
      isSavedAddressesLoading = false,
      isRecentSearchesLoading = false,
      onPressItem,
      onClose,
      hideBackdrop = false,
      onChange,
    },
    ref,
  ) => {
    const { colors } = useTheme();
    const styles = useStyles(colors);
    const insets = useSafeAreaInsets();

    const { height: screenHeight } = Dimensions.get('window');
    const snapPoints = useMemo(() => [screenHeight * 0.85], [screenHeight]);
    const animationConfigs = useMemo(() => ({ duration: 380, easing: Easing.out(Easing.cubic) }), []);
    const isDropdownOpen = !!query && searchResults.length > 0;
    const showSearchResultsShimmer = !!query && isSearchResultsLoading;
    const showSavedAndRecentSection = !isDropdownOpen && !isSearchResultsLoading;

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
      // @ts-expect-error BottomSheetModal ref type
      ref?.current?.dismiss?.();
    }, [ref]);

    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
        enablePanDownToClose
        animationConfigs={animationConfigs}
        keyboardBehavior="padding"
        keyboardBlurBehavior="none"
        android_keyboardInputMode="adjustResize"
        enableContentPanningGesture={false}
        onDismiss={handleDismiss}
        onChange={onChange}
        backdropComponent={hideBackdrop ? undefined : renderBackdrop}
        backgroundStyle={styles.sheetBackground}
        handleIndicatorStyle={styles.handleIndicator}
      >
        <BottomSheetScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="none"
        >
          <View style={styles.header}>
            <Text variant="semi-bold" style={styles.title}>
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

          <View>
            <View style={styles.searchContainer}>
              <Image source={ImageSource.searhIcon} style={styles.searchIcon} />
              <BottomSheetTextInput
                placeholder="Search your address"
                placeholderTextColor={colors.contenttertiary}
                value={query}
                onChangeText={onChangeQuery}
                style={styles.searchInput}
                autoCorrect={false}
                autoCapitalize="none"
                returnKeyType="search"
              />
            </View>

            {showSearchResultsShimmer && (
              <View style={styles.dropdownContainer}>
                {Array.from({ length: SEARCH_RESULTS_SKELETON_COUNT }).map((_, i) => (
                  <View key={i} style={styles.dropdownItem}>
                    <LocationSearchRowSkeleton iconSize={36} showSubtitle />
                  </View>
                ))}
              </View>
            )}
            {!!query && !isSearchResultsLoading && searchResults.length > 0 && (
              <View style={styles.dropdownContainer}>
                {searchResults.map((item, index) => (
                  <TouchableOpacity
                    key={item.id || index.toString()}
                    activeOpacity={0.85}
                    onPress={() => onPressItem?.(item)}
                    style={styles.dropdownItem}
                  >
                    <View style={styles.dropdownItemIcon}>
                      <Image source={item.iconSource ?? ImageSource.searhIcon} style={styles.dropdownItemIconImg} />
                    </View>
                    <View style={styles.dropdownItemTextWrap}>
                      <Text variant="medium" style={styles.dropdownItemTitle} numberOfLines={1}>
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
              </View>
            )}
          </View>

          {showSavedAndRecentSection && (
            <>
              {showUseCurrentLocation && (
                <TouchableOpacity onPress={onPressUseCurrentLocation} activeOpacity={0.85} style={styles.useCurrentLocationRow}>
                  <View style={styles.useCurrentLocationIconWrap}>
                    <Image source={ImageSource.gpsIcon} style={styles.useCurrentLocationIcon} />
                  </View>
                  <Text variant="semi-bold" style={styles.useCurrentLocationText}>
                    Use current location
                  </Text>
                </TouchableOpacity>
              )}

              <Text variant="semi-bold" style={styles.sectionTitle}>
                Saved Addresses
              </Text>
              {isSavedAddressesLoading &&
                Array.from({ length: SAVED_RECENT_SKELETON_COUNT }).map((_, i) => (
                  <LocationSearchRowSkeleton key={i} iconSize={45} showSubtitle />
                ))}
              {!isSavedAddressesLoading && savedAddresses.length === 0 && (
                <Text style={styles.emptyStateText}>No saved addresses yet</Text>
              )}
              {!isSavedAddressesLoading &&
                savedAddresses.map((item) => (
                  <View key={item.id}>
                    <TouchableOpacity activeOpacity={0.85} onPress={() => onPressItem?.(item)} style={styles.listRow}>
                      <View style={styles.listIconWrap}>
                        <Image source={item.iconSource ?? ImageSource.Home} style={styles.listIcon} />
                      </View>
                      <View style={styles.listTextWrap}>
                        <Text variant="medium" style={styles.listTitle}>
                          {item.title}
                        </Text>
                        {!!item.subtitle && <Text style={styles.listSubtitle}>{item.subtitle}</Text>}
                      </View>
                    </TouchableOpacity>
                  </View>
                ))}

              <Text style={styles.sectionTitle}>Recent Searches</Text>
              {isRecentSearchesLoading &&
                Array.from({ length: SAVED_RECENT_SKELETON_COUNT }).map((_, i) => (
                  <LocationSearchRowSkeleton key={i} iconSize={45} showSubtitle />
                ))}
              {!isRecentSearchesLoading && recentSearches.length === 0 && (
                <Text style={styles.emptyStateText}>No recent searches yet</Text>
              )}
              {!isRecentSearchesLoading &&
                recentSearches.map((item) => (
                  <View key={item.id}>
                    <TouchableOpacity activeOpacity={0.85} onPress={() => onPressItem?.(item)} style={styles.listRow}>
                      <View style={styles.listIconWrap}>
                        <Image source={item.iconSource ?? ImageSource.clock} style={styles.listIcon} />
                      </View>
                      <View style={styles.listTextWrap}>
                        <Text variant="semi-bold" style={styles.listTitle}>
                          {item.title}
                        </Text>
                        {!!item.subtitle && <Text style={styles.listSubtitle}>{item.subtitle}</Text>}
                      </View>
                    </TouchableOpacity>
                  </View>
                ))}
            </>
          )}
        </BottomSheetScrollView>
      </BottomSheetModal>
    );
  },
);
