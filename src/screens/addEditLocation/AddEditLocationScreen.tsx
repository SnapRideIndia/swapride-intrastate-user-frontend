import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Image, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useTheme } from '../../theme/ThemeProvider';
import { useStyles } from './AddEditLocationScreen.styles';
import PrimaryHeader from '../../components/common/SwHeader/PrimaryHeader/PrimaryHeader';
import PrimaryButton from '../../components/common/SwButton/PrimaryButton/PrimaryButton';
import { SwTextInput } from '../../components/common/SwTextInput/SwTextInput';
import { SwLocationSearchBottomSheet } from '../../components/common/SwLocationSearchBottomSheet/SwLocationSearchBottomSheet';
import { ImageSource } from '../../constants/images';
import SearchService from '../../services/SearchService';
import type { SwLocationSearchItem } from '../../types/placeAutofill.types';
import type { RootStackParamList } from '../../navigation/types';
import { showToast } from '../../utils/showToast';
import { usePlaceAutocomplete, useRecentSearch, useSavedLocations } from '../../hooks/useSearch';
import uuid from 'react-native-uuid';

type AddEditLocationRoute = RouteProp<RootStackParamList, 'AddEditLocationScreen'>;

function toSearchItem(prefilled: AddEditLocationRoute['params']['prefilledLocation']): SwLocationSearchItem | null {
  if (!prefilled) return null;
  return {
    id: prefilled.id,
    title: prefilled.title,
    subtitle: prefilled.subtitle,
    latitude: prefilled.latitude,
    longitude: prefilled.longitude,
  };
}

function toSearchItemFromEdit(item: AddEditLocationRoute['params']['itemToEdit']): SwLocationSearchItem | null {
  if (!item) return null;
  return {
    id: item.id,
    title: item.label,
    subtitle: item.address,
    latitude: item.latitude,
    longitude: item.longitude,
  };
}

export default function AddEditLocationScreen() {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const navigation = useNavigation();
  const route = useRoute<AddEditLocationRoute>();
  const params = route.params;
  const mode = params?.mode ?? 'add';
  const prefilledLocation = params?.prefilledLocation;
  const itemToEdit = params?.itemToEdit;

  const [location, setLocation] = useState<SwLocationSearchItem | null>(() =>
    mode === 'edit' && itemToEdit ? toSearchItemFromEdit(itemToEdit) : toSearchItem(prefilledLocation ?? undefined),
  );
  const [label, setLabel] = useState(() => (mode === 'edit' && itemToEdit ? itemToEdit.label : ''));
  const [isSaving, setIsSaving] = useState(false);

  const sheetRef = useRef<BottomSheetModal>(null);
  const sessionTokenRef = useRef<string | null>(null);
  const [locationQuery, setLocationQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SwLocationSearchItem[]>([]);
  const [savedAddresses, setSavedAddresses] = useState<SwLocationSearchItem[]>([]);
  const [recentSearches, setRecentSearches] = useState<SwLocationSearchItem[]>([]);
  const [savedRecentLoading, setSavedRecentLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const { getPlaceAutocompleteItems } = usePlaceAutocomplete();
  const { getRecentSearchItems } = useRecentSearch();
  const { getSavedLocationItems } = useSavedLocations();

  const loadSheetData = useCallback(async () => {
    setSavedRecentLoading(true);
    try {
      const [saved, recent] = await Promise.all([getSavedLocationItems(), getRecentSearchItems('pickup')]);
      setSavedAddresses(saved);
      setRecentSearches(recent);
    } catch {
      setSavedAddresses([]);
      setRecentSearches([]);
    } finally {
      setSavedRecentLoading(false);
    }
  }, [getSavedLocationItems, getRecentSearchItems]);

  const openSheet = useCallback(() => {
    setLocationQuery('');
    setSearchResults([]);
    setSearchLoading(false);
    loadSheetData();
    sheetRef.current?.present();
  }, [loadSheetData]);

  const onSelectFromSheet = useCallback((item: SwLocationSearchItem) => {
    setLocation(item);
    sheetRef.current?.dismiss();
  }, []);

  const onSheetClose = useCallback(() => {
    setLocationQuery('');
    setSearchResults([]);
    sessionTokenRef.current = null;
  }, []);

  useEffect(() => {
    const q = locationQuery.trim();
    if (!q || q.length < 2) {
      setSearchResults([]);
      return;
    }
    setSearchLoading(true);
    let cancelled = false;
    if (!sessionTokenRef.current) sessionTokenRef.current = String(uuid.v4());
    getPlaceAutocompleteItems(q, sessionTokenRef.current)
      .then(items => {
        if (!cancelled) setSearchResults(items ?? []);
      })
      .catch(() => {
        if (!cancelled) setSearchResults([]);
      })
      .finally(() => {
        if (!cancelled) setSearchLoading(false);
      });
    return () => { cancelled = true; };
  }, [locationQuery, getPlaceAutocompleteItems]);

  const handleSave = useCallback(async () => {
    const trimmedLabel = label.trim();
    if (!trimmedLabel) {
      showToast('error', 'Please enter a name (e.g. Home, Office)', '', 2000);
      return;
    }
    if (!location) {
      showToast('error', 'Please select a location', '', 2000);
      return;
    }
    setIsSaving(true);
    try {
      const payload = {
        label: trimmedLabel,
        address: location.subtitle || location.title || '',
        latitude: location.latitude ?? 0,
        longitude: location.longitude ?? 0,
      };
      if (mode === 'edit' && itemToEdit) {
        await SearchService.updateSavedLocation(itemToEdit.id, payload);
        showToast('success', 'Location updated', '', 2000);
      } else {
        await SearchService.createSavedLocation(payload);
        showToast('success', 'Location saved', '', 2000);
      }
      navigation.goBack();
    } catch (e: any) {
      showToast('error', e?.message ?? 'Failed to save location', '', 2000);
    } finally {
      setIsSaving(false);
    }
  }, [mode, itemToEdit, location, label, navigation]);

  const title = mode === 'edit' ? 'Edit location' : 'Add location';
  const saveButtonTitle = isSaving ? 'Saving...' : 'Save';

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <PrimaryHeader title={title} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <TouchableOpacity onPress={openSheet} activeOpacity={0.7}>
            <SwTextInput
              title="Location"
              renderTitleIcon={() => <Image source={ImageSource.mapPin} style={styles.locationIcon} resizeMode="contain" />}
              value={location ? [location.title, location.subtitle].filter(Boolean).join(', ') : ''}
              editable={false}
              placeholder="Search address"
              pointerEvents="none"
            />
          </TouchableOpacity>
          <SwTextInput
            title="Save as"
            renderTitleIcon={() => <Image source={ImageSource.bookmarkOutline} style={styles.bookmarkIcon} />}
            placeholder="e.g. Home, Office"
            value={label}
            onChangeText={setLabel}
          />
          <PrimaryButton
            title={saveButtonTitle}
            onPress={handleSave}
            disabled={isSaving}
            btnStyle={styles.saveButton}
            textStyle={styles.saveButtonText}
          />
        </View>
      </ScrollView>

      <SwLocationSearchBottomSheet
        ref={sheetRef}
        title="Search address"
        query={locationQuery}
        onChangeQuery={setLocationQuery}
        searchResults={searchResults}
        isSearchResultsLoading={searchLoading}
        isSavedAddressesLoading={savedRecentLoading}
        isRecentSearchesLoading={savedRecentLoading}
        showUseCurrentLocation={false}
        savedAddresses={savedAddresses}
        recentSearches={recentSearches}
        onPressItem={onSelectFromSheet}
        onClose={onSheetClose}
      />
    </SafeAreaView>
  );
}
