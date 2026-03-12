import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ShimmerBox, ShimmerLine } from '../../common/Shimmer';

type LocationSearchRowSkeletonProps = {
  /** Icon size: 45 list row, 36 dropdown. */
  iconSize?: number;
  showSubtitle?: boolean;
};

export const LocationSearchRowSkeleton = ({
  iconSize = 45,
  showSubtitle = true,
}: LocationSearchRowSkeletonProps) => {
  return (
    <View style={styles.row}>
      <ShimmerBox width={iconSize} height={iconSize} borderRadius={999} />
      <View style={styles.textWrap}>
        <ShimmerLine width="80%" height={14} style={styles.titleLine} />
        {showSubtitle && (
          <ShimmerLine width="60%" height={12} style={styles.subtitleLine} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 10,
  },
  textWrap: {
    flex: 1,
    gap: 2,
    justifyContent: 'center',
  },
  titleLine: {
    marginTop: 4,
  },
  subtitleLine: {
    marginTop: 4,
  },
});
