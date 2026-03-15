import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../../../theme/ThemeProvider';
import { ShimmerBox, ShimmerLine } from '../../../common/Shimmer';

const CARD_SHIMMER_COUNT = 3;

export function SavedLocationCardShimmer() {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  return (
    <View style={styles.wrap}>
      {Array.from({ length: CARD_SHIMMER_COUNT }).map((_, i) => (
        <View key={i} style={styles.card}>
          <ShimmerBox width={40} height={40} borderRadius={20} />
          <View style={styles.content}>
            <ShimmerLine width="50%" height={14} borderRadius={6} style={styles.labelLine} />
            <ShimmerLine width="80%" height={12} borderRadius={6} style={styles.addressLine} />
          </View>
          <View style={styles.actions}>
            <ShimmerBox width={20} height={20} borderRadius={4} />
            <ShimmerBox width={20} height={20} borderRadius={4} />
          </View>
        </View>
      ))}
    </View>
  );
}

const useStyles = (colors: any) =>
  StyleSheet.create({
    wrap: {},
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background_primary,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border_3,
      paddingVertical: 12,
      paddingHorizontal: 16,
      marginBottom: 12,
      gap: 14,
    },
    content: {
      flex: 1,
      gap: 4,
    },
    labelLine: {
      marginBottom: 2,
    },
    addressLine: {},
    actions: {
      flexDirection: 'row',
      gap: 2,
    },
  });
