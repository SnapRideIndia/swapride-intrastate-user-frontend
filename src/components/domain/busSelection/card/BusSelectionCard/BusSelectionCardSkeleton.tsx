import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ShimmerBox, ShimmerLine } from '../../../../common/Shimmer';

export const BusSelectionCardSkeleton = () => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.mainCard}>
        <View style={styles.timelineCol}>
          <ShimmerBox width={63} height={22} borderRadius={5} />
          <View style={styles.timelineLine} />
          <ShimmerBox width={63} height={22} borderRadius={5} />
        </View>

        <View style={styles.contentCol}>
          <View style={styles.headerBlock}>
            <ShimmerLine width="60%" height={16} />
            <ShimmerLine width="85%" height={12} />
            <ShimmerLine width="70%" height={12} />
          </View>

          <ShimmerBox width="100%" height={110} borderRadius={12} />
        </View>
      </View>

      <View style={styles.busTimingsSection}>
        <ShimmerLine width="40%" height={14} />
        <ShimmerBox width="100%" height={64} borderRadius={12} />
        <ShimmerBox width="60%" height={18} borderRadius={9} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 10,
    marginTop: 12,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  mainCard: {
    padding: 15,
    paddingTop: 20,
    flexDirection: 'row',
    gap: 14,
  },
  timelineCol: {
    alignItems: 'center',
  },
  timelineLine: {
    flex: 1,
    width: 1,
    marginVertical: 6,
    backgroundColor: '#E0E0E0',
  },
  contentCol: {
    flex: 1,
    gap: 16,
  },
  headerBlock: {
    gap: 6,
  },
  busTimingsSection: {
    paddingHorizontal: 15,
    paddingBottom: 16,
    gap: 8,
  },
});

export default BusSelectionCardSkeleton;

