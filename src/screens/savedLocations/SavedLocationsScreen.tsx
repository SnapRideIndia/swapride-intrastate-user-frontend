import React, { useCallback, useState } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme/ThemeProvider';
import { useStyles } from './SavedLocationsScreen.styles';
import PrimaryHeader from '../../components/common/SwHeader/PrimaryHeader/PrimaryHeader';
import PrimaryButton from '../../components/common/SwButton/PrimaryButton/PrimaryButton';
import { SwText as Text } from '../../components/common/SwText/SwText';
import { NoResults } from '../../components/common/NoResults/NoResults';
import { SavedLocationCard, SavedLocationCardShimmer } from '../../components/domain/savedLocations/SavedLocationCard';
import { SwPopupModal } from '../../components/common/SwPopupModal';
import { ImageSource } from '../../constants/images';
import SearchService from '../../services/SearchService';
import type { SavedLocationDto } from '../../types/search.types';
import { ScreenNames } from '../../navigation/constant';
import { showCustomToast } from '../../utils/customToast';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';

export default function SavedLocationsScreen() {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'SavedPlacesScreen'>>();
  const [list, setList] = useState<SavedLocationDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<SavedLocationDto | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadList = useCallback(async () => {
    setLoading(true);
    try {
      const data = await SearchService.savedLocations();
      setList(Array.isArray(data) ? data : []);
    } catch {
      setList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadList();
    }, [loadList]),
  );

  const openDeleteModal = useCallback((item: SavedLocationDto) => {
    setItemToDelete(item);
    setDeleteModalVisible(true);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setDeleteModalVisible(false);
    setItemToDelete(null);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      await SearchService.deleteSavedLocation(itemToDelete.id);
      closeDeleteModal();
      loadList();
      showCustomToast('success', 'Location removed', '', 2000);
    } catch (e: any) {
      showCustomToast('error', e?.message ?? 'Failed to delete location', '', 2000);
    } finally {
      setIsDeleting(false);
    }
  }, [itemToDelete, loadList, closeDeleteModal]);

  const handleEdit = useCallback(
    (item: SavedLocationDto) => {
      navigation.navigate(ScreenNames.ADD_EDIT_LOCATION_SCREEN, { mode: 'edit', itemToEdit: item });
    },
    [navigation],
  );

  const handleAddLocation = useCallback(() => {
    navigation.navigate(ScreenNames.ADD_EDIT_LOCATION_SCREEN, { mode: 'add' });
  }, [navigation]);

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <PrimaryHeader title="Saved Locations" />
      <View style={styles.scrollWrap}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainer}>
          {loading ? (
            <View style={styles.list}>
              <SavedLocationCardShimmer />
            </View>
          ) : (
            <View style={styles.list}>
              {list.length === 0 ? (
                <NoResults
                  image={ImageSource.noSavedLocations}
                  title="No saved locations"
                  subtitle="Save your frequent stops for faster booking."
                />
              ) : (
                list.map(item => (
                  <SavedLocationCard key={item.id} item={item} onEdit={handleEdit} onDelete={openDeleteModal} />
                ))
              )}
            </View>
          )}
        </ScrollView>
      </View>
      <View style={styles.buttonWrap}>
        <PrimaryButton
          title="Add Location"
          onPress={handleAddLocation}
          btnStyle={styles.addButton}
          textStyle={styles.addButtonText}
        />
      </View>

      <SwPopupModal
        isVisible={deleteModalVisible}
        onClose={closeDeleteModal}
        title="Delete Saved Location ?"
        variant="compact"
        centerTitle
      >
        <View style={styles.deleteModalContent}>
          <Text style={styles.deleteModalMessage}>
            Are you sure you want to delete <Text style={styles.deleteModalMessageBold}>{itemToDelete?.label ?? ''}</Text> from your saved location
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
