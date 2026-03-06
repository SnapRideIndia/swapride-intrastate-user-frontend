import { Image, ScrollView, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../theme/ThemeProvider';
import { useStyles } from './SetCommuteScreen.styles';
import PrimaryHeader from '../../../components/common/SwHeader/PrimaryHeader/PrimaryHeader';
import { useNavigation } from '@react-navigation/native';
import { SwText as Text } from '../../../components/common/SwText/SwText';
import { SwPickupDropInputCard } from '../../../components/common/SwPickupDropInputCard/SwPickupDropInputCard';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { ImageSource } from '../../../constants/images';
import PrimaryButton from '../../../components/common/SwButton/PrimaryButton/PrimaryButton';
import {
  SwLocationSearchBottomSheet,
  SwLocationSearchItem,
} from '../../../components/common/SwLocationSearchBottomSheet/SwLocationSearchBottomSheet';
import { fetchData } from '../../../services/ApiUtility';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../../store';
import { setCurrentLocation } from '../../../slice/profileSlice';
import { getCurrentLocationHelper } from '../../../hooks/permissions/geoLocation/helper';
import { ScreenNames } from '../../../navigation/constant';

type PlaceSuggestion = {
  text: string;
  placeId: string;
  mainText: string;
  lat: number;
  lng: number;
};

const SetCommuteScreen = () => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const navigation = useNavigation();

  const dispatch = useDispatch<AppDispatch>();

  const [pickupLocation, setPickupLocation] = useState('');
  const [dropLocation, setDropLocation] = useState('');
  const [activeLocationField, setActiveLocationField] = useState<'pickup' | 'drop'>('pickup');
  const locationSheetRef = useRef<BottomSheetModal>(null);
  const [locationQuery, setLocationQuery] = useState('');
  const sessionTokenRef = useRef<string | null>(null);
  const [searchResults, setSearchResults] = useState<SwLocationSearchItem[]>([]);

  const getSessionToken = useCallback(() => {
    if (!sessionTokenRef.current) {
      sessionTokenRef.current = Math.random().toString(36).substring(2, 15);
    }
    return sessionTokenRef.current;
  }, []);

  const savedAddresses = useMemo<SwLocationSearchItem[]>(
    () => [
      {
        id: 'home',
        title: 'Home',
        subtitle: '12-9 kilometers off from\nHarminder - 61507',
        iconSource: ImageSource.Home,
      },
      {
        id: 'work',
        title: 'Work',
        subtitle: '12-9 kilometers off from\nHarminder - 61507',
        iconSource: ImageSource.office,
      },
    ],
    [],
  );

  const recentSearches = useMemo<SwLocationSearchItem[]>(
    () => [
      {
        id: 'recent-1',
        title: 'Lohoet 3532',
        subtitle: '12-9 kilometers off from\nHarminder - 61507',
        iconSource: ImageSource.clock,
      },
    ],
    [],
  );

  const handleUseCurrentLocation = useCallback(async () => {
    const position = await getCurrentLocationHelper();
    if (!position || !position.coords) {
      return;
    }

    const { latitude, longitude } = position.coords;
    dispatch(setCurrentLocation({ latitude, longitude }));
  }, [dispatch]);

  useEffect(() => {
    if (!locationQuery || locationQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const token = getSessionToken();

    const timeoutId = setTimeout(() => {
      (async () => {
        const res = await fetchData<PlaceSuggestion[]>('/search/place-autocomplete', {
          params: {
            input: locationQuery,
            sessionToken: token,
          },
        });

        if (!res.success || !res.data) {
          setSearchResults([]);
          return;
        }

        const items: SwLocationSearchItem[] = res.data.map(place => ({
          id: place.placeId,
          title: place.mainText || place.text,
          subtitle: place.text,
          iconSource: ImageSource.searhIcon,
        }));

        setSearchResults(items);
      })();
    }, 400);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [locationQuery, getSessionToken]);

  const handleSelectLocation = useCallback(
    (item: SwLocationSearchItem) => {
      if (activeLocationField === 'pickup') setPickupLocation(item.title);
      else setDropLocation(item.title);
      locationSheetRef.current?.dismiss();
    },
    [activeLocationField],
  );

  const openLocationSheet = useCallback((field: 'pickup' | 'drop') => {
    setActiveLocationField(field);
    setLocationQuery('');
    setSearchResults([]);
    sessionTokenRef.current = null;
    locationSheetRef.current?.present();
  }, []);

  useEffect(() => {
    const renderHeader = () => <PrimaryHeader title="" />;
    navigation.setOptions({
      headerShown: true,
      header: renderHeader,
    });
  }, [navigation]);

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainer}>
        <Text variant="semi-bold" style={styles.title}>
          Tell us about your commute !
        </Text>

        <View style={styles.card}>
          <SwPickupDropInputCard
            pickupInputProps={{
              title: 'Preffered Pickup location',
              placeholder: 'Enter pickup location',
              value: pickupLocation,
              onChangeText: setPickupLocation,
              renderTitleIcon: () => <Image source={ImageSource.Home} style={styles.titleIcon} />,
            }}
            dropInputProps={{
              title: 'Preffered Drop location',
              placeholder: 'Enter drop location',
              value: dropLocation,
              onChangeText: setDropLocation,
              renderTitleIcon: () => <Image source={ImageSource.office} style={styles.titleIcon} />,
            }}
            onPressPickup={() => openLocationSheet('pickup')}
            onPressDrop={() => openLocationSheet('drop')}
          />

          <View style={styles.timeInputContainer}>
            <View style={styles.inputTitle}>
              <Image source={ImageSource.clock} style={styles.clock} />
              <Text>Office Timing</Text>
            </View>
            <View style={styles.timeInputsWrapper}>
              <TouchableOpacity style={styles.timeInput}>
                <Text>00:00 AM</Text>
              </TouchableOpacity>
              <Text>to</Text>
              <TouchableOpacity style={styles.timeInput}>
                <Text>00:00 PM</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.btnContainer}>
            <PrimaryButton
              title="Submit"
              btnStyle={styles.btnStyle}
              textStyle={styles.textStyle}
              onPress={() => navigation.navigate(ScreenNames.BUS_SELECTION_SCREEN as never)}
            />
          </View>
        </View>

        <SwLocationSearchBottomSheet
          ref={locationSheetRef}
          title={activeLocationField === 'pickup' ? 'Search Pickup Address' : 'Search Drop Address'}
          query={locationQuery}
          onChangeQuery={setLocationQuery}
          searchResults={searchResults}
          showUseCurrentLocation
          onPressUseCurrentLocation={handleUseCurrentLocation}
          savedAddresses={savedAddresses}
          recentSearches={recentSearches}
          onPressItem={handleSelectLocation}
          onClose={() => {
            setLocationQuery('');
            setSearchResults([]);
            sessionTokenRef.current = null;
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default SetCommuteScreen;
