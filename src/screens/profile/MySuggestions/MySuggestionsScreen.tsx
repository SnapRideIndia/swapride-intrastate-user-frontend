import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Linking, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../../theme/ThemeProvider';
import { useStyles } from './MySuggestionsScreen.styles';
import PrimaryHeader from '../../../components/common/SwHeader/PrimaryHeader/PrimaryHeader';
import { SwText as Text } from '../../../components/common/SwText/SwText';
import PrimaryButton from '../../../components/common/SwButton/PrimaryButton/PrimaryButton';
import { SwPopupModal } from '../../../components/common/SwPopupModal';
import SuggestionService from '../../../services/SuggestionService';
import { showToast } from '../../../utils/showToast';
import type { RootStackParamList } from '../../../navigation/types';
import type { StopSuggestionListItem } from '../../../types/suggestion.types';

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

function getPickup(item: ListItem) {
  return item.pickupAddress ?? item.pickup_address ?? '—';
}
function getDropoff(item: ListItem) {
  return item.dropoffAddress ?? item.dropoff_address ?? '—';
}
function getReachingTime(item: ListItem) {
  return item.reachingTime ?? item.reaching_time ?? '—';
}

function getCoords(item: ListItem) {
  const pickupLat = item.pickupLat ?? item.pickup_lat;
  const pickupLng = item.pickupLng ?? item.pickup_lng;
  const dropoffLat = item.dropoffLat ?? item.dropoff_lat;
  const dropoffLng = item.dropoffLng ?? item.dropoff_lng;
  if (
    pickupLat == null ||
    pickupLng == null ||
    dropoffLat == null ||
    dropoffLng == null
  ) {
    return null;
  }
  return {
    pickupLat,
    pickupLng,
    dropoffLat,
    dropoffLng,
  };
}

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
      showToast('success', 'Suggestion removed', '', 2000);
    } catch (e: any) {
      showToast('error', e?.message ?? 'Failed to delete suggestion', '', 2000);
    } finally {
      setIsDeleting(false);
    }
  }, [itemToDelete, loadList, closeDeleteModal, navigation]);

  const handleViewOnMap = useCallback((item: ListItem) => {
    const coords = getCoords(item);
    if (!coords) {
      showToast('error', 'Location details not available for this suggestion', '', 2000);
      return;
    }
    const { pickupLat, pickupLng, dropoffLat, dropoffLng } = coords;
    const url = `https://www.google.com/maps/dir/?api=1&origin=${pickupLat},${pickupLng}&destination=${dropoffLat},${dropoffLng}`;
    Linking.openURL(url).catch(() => {
      showToast('error', 'Unable to open maps', '', 2000);
    });
  }, []);

  const getStatusStyle = (status: string) => {
    switch ((status || '').toUpperCase()) {
      case 'PENDING':
        return [styles.statusChip, styles.statusPending];
      case 'REVIEWED':
        return [styles.statusChip, styles.statusReviewed];
      case 'IMPLEMENTED':
        return [styles.statusChip, styles.statusImplemented];
      case 'REJECTED':
        return [styles.statusChip, styles.statusRejected];
      default:
        return [styles.statusChip, styles.statusPending];
    }
  };

  if (loading && list.length === 0) {
    return (
      <SafeAreaView edges={['bottom']} style={styles.container}>
        <PrimaryHeader title="My Suggestions" />
        <View style={styles.scrollWrap}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <PrimaryHeader title="My Suggestions" />
      <View style={styles.scrollWrap}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainer}>
          {list.map(item => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.routeWrap}>
                  <View style={styles.routeDotsColumn}>
                    <View style={styles.routeDot} />
                    <View style={styles.routeConnector} />
                    <View style={[styles.routeDot, styles.routeDotEnd]} />
                  </View>
                  <View style={styles.routeTextColumn}>
                    <Text style={styles.routeText} numberOfLines={2}>{getPickup(item)}</Text>
                    <Text style={styles.routeText} numberOfLines={2}>{getDropoff(item)}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.metaRow}>
                <View style={styles.metaChip}>
                  <Text style={styles.metaChipText}>{item.shift ?? '—'}</Text>
                </View>
                <View style={styles.metaChip}>
                  <Text style={styles.metaChipText}>Reach: {getReachingTime(item)}</Text>
                </View>
                <View style={getStatusStyle(item.status ?? 'PENDING')}>
                  <Text style={styles.statusText}>{item.status ?? 'PENDING'}</Text>
                </View>
              </View>
              {item.description ? (
                <View style={styles.descriptionContainer}>
                  <Text style={styles.descriptionText} numberOfLines={3}>{item.description}</Text>
                </View>
              ) : null}

              <View style={styles.cardButtonsRow}>
                <PrimaryButton
                  title="Delete"
                  onPress={() => openDeleteModal(item)}
                  btnStyle={[styles.cardButton, styles.cardDeleteButton]}
                  textStyle={styles.cardDeleteButtonText}
                />
                <PrimaryButton
                  title="View on map"
                  onPress={() => handleViewOnMap(item)}
                  btnStyle={[styles.cardButton, styles.cardViewMapButton]}
                  textStyle={styles.cardViewMapButtonText}
                />
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      <SwPopupModal
        isVisible={deleteModalVisible}
        onClose={closeDeleteModal}
        title="Delete suggestion?"
        variant="compact"
        centerTitle
      >
        <View style={styles.deleteModalContent}>
          <Text style={styles.deleteModalMessage}>
            Are you sure you want to delete this suggestion? This cannot be undone.
          </Text>
          <View style={styles.deleteModalButtonRow}>
            <TouchableOpacity
              style={styles.deleteModalCancelButton}
              onPress={closeDeleteModal}
              disabled={isDeleting}
              activeOpacity={0.7}
            >
              <Text style={styles.deleteModalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <PrimaryButton
              title="Delete"
              onPress={handleConfirmDelete}
              disabled={isDeleting}
              btnStyle={styles.deleteModalDeleteButton}
              textStyle={styles.deleteModalDeleteText}
            />
          </View>
        </View>
      </SwPopupModal>
    </SafeAreaView>
  );
}
