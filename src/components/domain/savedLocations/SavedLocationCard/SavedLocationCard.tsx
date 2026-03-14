import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../../../theme/ThemeProvider';
import { useStyles } from './SavedLocationCard.styles';
import { SwText as Text } from '../../../common/SwText/SwText';
import { ImageSource } from '../../../../constants/images';
import type { SavedLocationDto } from '../../../../types/search.types';

export type SavedLocationCardProps = {
  item: SavedLocationDto;
  onEdit?: (item: SavedLocationDto) => void;
  onDelete?: (item: SavedLocationDto) => void;
};

function getIconForLabel(label: string) {
  const lower = (label || '').toLowerCase().trim();
  if (lower === 'home' || lower.includes('home')) return ImageSource.Home;
  if (lower === 'work' || lower === 'office' || lower.includes('work') || lower.includes('office')) return ImageSource.Work;
  return ImageSource.mapPin;
}

export function SavedLocationCard({ item, onEdit, onDelete }: SavedLocationCardProps) {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const iconSource = getIconForLabel(item.label);

  return (
    <View style={styles.card}>
      <View style={styles.iconWrap}>
        <Image source={iconSource} style={styles.icon} resizeMode="contain" />
      </View>
      <View style={styles.content}>
        <Text variant="semi-bold" style={styles.label} numberOfLines={1}>
          {item.label || 'Saved location'}
        </Text>
        <Text style={styles.addressLine} numberOfLines={1} ellipsizeMode="tail">
          {item.address || ''}
        </Text>
      </View>
      <View style={styles.actions}>
        {onEdit && (
          <TouchableOpacity style={styles.actionBtn} onPress={() => onEdit(item)} accessibilityLabel="Edit location">
            <Image source={ImageSource.edit} style={styles.editIcon} />
          </TouchableOpacity>
        )}
        {onDelete && (
          <TouchableOpacity style={styles.actionBtn} onPress={() => onDelete(item)} accessibilityLabel="Delete location">
            <Image source={ImageSource.delete} style={styles.deleteIcon} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
