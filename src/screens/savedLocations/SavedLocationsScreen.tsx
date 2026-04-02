import React, { useCallback, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme/ThemeProvider';
import { useStyles } from './SavedLocationsScreen.styles';
import PrimaryHeader from '../../components/common/SwHeader/PrimaryHeader/PrimaryHeader';
import PrimaryButton from '../../components/common/SwButton/PrimaryButton/PrimaryButton';
import { NoResults } from '../../components/common/NoResults/NoResults';
import { SavedLocationCard, SavedLocationCardShimmer } from '../../components/domain/savedLocations/SavedLocationCard';
import { SwModal } from '../../components/common/SwModal';
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

      <SwModal
        isVisible={deleteModalVisible}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Delete Saved Location ?"
        subTitle={`Are you sure you want to delete ${itemToDelete?.label ?? ''} from your saved location`}
        confirmText="Delete"
        isConfirmLoading={isDeleting}
        isDestructive
      />
    </SafeAreaView>
  );
}
