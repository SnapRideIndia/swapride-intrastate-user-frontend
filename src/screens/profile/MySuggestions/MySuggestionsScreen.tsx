import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Linking, ScrollView, TouchableOpacity, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../../theme/ThemeProvider';
import { useStyles } from './MySuggestionsScreen.styles';
import PrimaryHeader from '../../../components/common/SwHeader/PrimaryHeader/PrimaryHeader';
import { SwText as Text } from '../../../components/common/SwText/SwText';
import { SwModal } from '../../../components/common/SwModal';
import SuggestionService from '../../../services/SuggestionService';
import { showCustomToast } from '../../../utils/customToast';
import type { RootStackParamList } from '../../../navigation/types';
import type { StopSuggestionListItem } from '../../../types/suggestion.types';
import { ImageSource } from '../../../constants/images';
import { format } from 'date-fns';

type ListItem = StopSuggestionListItem & {
  pickupLat?: number;
  pickupLng?: number;
  dropoffLat?: number;
  dropoffLng?: number;
  pickup_lat?: number;
  pickup_lng?: number;
  dropoff_lat?: number;
  dropoff_lng?: number;
  pickup_address?: string;
  dropoff_address?: string;
  reaching_time?: string;
  created_at?: string;
};

export default function MySuggestionsScreen() {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [list, setList] = useState<ListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ListItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadList = useCallback(async () => {
    setLoading(true);
    try {
      const res = await SuggestionService.listMySuggestions(0, 10);
      const data = (res?.data ?? []) as ListItem[];
      setList(Array.isArray(data) ? data : []);
      return (res?.data?.length ?? 0) as number;
    } catch {
      setList([]);
      return 0;
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadList().then(count => {
        if (count === 0) {
          showCustomToast('info', 'No suggestions yet', '', 2000);
          navigation.goBack();
        }
      });
    }, [loadList, navigation]),
  );

  const openDeleteModal = useCallback((item: ListItem) => {
    setItemToDelete(item);
    setDeleteModalVisible(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setDeleteModalVisible(false);
    setItemToDelete(null);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!itemToDelete?.id) return;
    setIsDeleting(true);
    try {
      await SuggestionService.deleteSuggestion(itemToDelete.id);
      closeDeleteModal();
      const count = await loadList();
      if (count === 0) {
        navigation.goBack();
      }
      showCustomToast('success', 'Suggestion removed', '', 2000);
    } catch (e: any) {
      showCustomToast('error', e?.message ?? 'Failed to delete suggestion', '', 2000);
    } finally {
      setIsDeleting(false);
    }
  }, [itemToDelete, loadList, closeDeleteModal, navigation]);

  const handleViewOnMap = useCallback((item: ListItem) => {
    const pickupLat = item.pickupLat ?? item.pickup_lat;
    const pickupLng = item.pickupLng ?? item.pickup_lng;
    const dropoffLat = item.dropoffLat ?? item.dropoff_lat;
    const dropoffLng = item.dropoffLng ?? item.dropoff_lng;
    
    if (pickupLat == null || pickupLng == null || dropoffLat == null || dropoffLng == null) {
      showCustomToast('error', 'Location details not available', '', 2000);
      return;
    }
    const url = `https://www.google.com/maps/dir/?api=1&origin=${pickupLat},${pickupLng}&destination=${dropoffLat},${dropoffLng}`;
    Linking.openURL(url).catch(() => {
      showCustomToast('error', 'Unable to open maps', '', 2000);
    });
  }, []);

  const getStatusColor = (status: string) => {
    switch ((status || '').toUpperCase()) {
      case 'PENDING': return colors.primary;
      case 'REVIEWED': return '#3B82F6';
      case 'IMPLEMENTED': return '#10B981';
      case 'REJECTED': return '#EF4444';
      default: return colors.contentSecondary;
    }
  };

  const renderCard = (item: ListItem) => {
    const pickup = item.pickupAddress ?? item.pickup_address ?? '—';
    const dropoff = item.dropoffAddress ?? item.dropoff_address ?? '—';
    const createdAt = item.createdAt ?? item.created_at ?? new Date().toISOString();
    const reachingTime = item.reachingTime ?? item.reaching_time ?? '—';

    return (
      <View key={item.id} style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.statusBadge}>
            <Text style={[styles.statusText, { color: getStatusColor(item.status ?? 'PENDING') }]}>
              {item.status ?? 'PENDING'}
            </Text>
          </View>
          <Text style={styles.dateText}>{format(new Date(createdAt), 'do MMM')}</Text>
        </View>

        <View style={styles.routeContainer}>
          <View style={styles.locationRow}>
            <View style={styles.dotLineCol}>
              <View style={[styles.routeDot, { backgroundColor: colors.primaryLight }]} />
              <View style={styles.routeConnector} />
            </View>
            <Text style={styles.locationText}>{pickup}</Text>
          </View>
          <View style={styles.locationRow}>
            <View style={styles.dotLineCol}>
              <View style={[styles.routeDot, { backgroundColor: colors.secondary }]} />
            </View>
            <Text style={styles.locationText}>{dropoff}</Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.infoPill}>
            <Image source={ImageSource.sun} style={styles.pillIcon} />
            <Text style={styles.pillText}>{item.shift ?? '—'}</Text>
          </View>
          <View style={styles.infoPill}>
            <Image source={ImageSource.clock} style={styles.pillIcon} />
            <Text style={styles.pillText}>{reachingTime}</Text>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity onPress={() => handleViewOnMap(item)} style={styles.viewOnMapButton}>
              <Text variant="medium" style={styles.viewOnMapText}>View on map</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => openDeleteModal(item)} style={styles.actionIconButton}>
              <Image source={ImageSource.delete} style={[styles.actionIcon, styles.deleteIcon]} />
            </TouchableOpacity>
          </View>
        </View>

        {item.description ? (
          <View style={styles.descriptionBox}>
            <Text numberOfLines={2} style={styles.descriptionText}>"{item.description}"</Text>
          </View>
        ) : null}
      </View>
    );
  };

  if (loading && list.length === 0) {
    return (
      <SafeAreaView edges={['bottom']} style={styles.container}>
        <PrimaryHeader title="My Suggestions" />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <PrimaryHeader title="My Suggestions" />
      <View style={styles.scrollWrap}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainer}>
          {list.map(renderCard)}
        </ScrollView>
      </View>

      <SwModal
        isVisible={deleteModalVisible}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Remove Suggestion?"
        subTitle="Are you sure you want to remove this suggestion from our records?"
        confirmText={isDeleting ? 'Removing...' : 'Remove'}
        isConfirmLoading={isDeleting}
        isDestructive
      />
    </SafeAreaView>
  );
}
