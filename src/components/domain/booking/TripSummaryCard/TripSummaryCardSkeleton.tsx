import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../../../../theme/ThemeProvider';
import { useStyles } from './TripSummaryCard.styles';
import { ShimmerBox, ShimmerLine } from '../../../common/Shimmer';

const TripSummaryCardSkeleton = () => {
  const { colors } = useTheme();
  const styles = useStyles(colors);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: colors.background_primary }]}>
        <View style={styles.headerLeft}>
          <ShimmerBox width={20} height={20} borderRadius={10} />
          <ShimmerLine width="60%" height={14} />
        </View>
        <ShimmerBox width={64} height={22} borderRadius={20} />
      </View>

      <View style={styles.content}>
        <View style={styles.pointsContainer}>
          <View style={styles.pointRow}>
            <View style={styles.indicatorContainer}>
              <ShimmerBox width={63} height={22} borderRadius={5} />
              <View style={styles.verticalConnector} />
            </View>
            <View style={[styles.pointInfo, styles.pickupInfo]}>
              <ShimmerLine width="70%" height={14} />
              <ShimmerLine width="90%" height={12} />
              <ShimmerBox width="55%" height={16} borderRadius={8} />
            </View>
          </View>

          <View style={[styles.pointRow, styles.dropoffRow]}>
            <View style={styles.indicatorContainer}>
              <ShimmerBox width={63} height={22} borderRadius={5} />
            </View>
            <View style={styles.pointInfo}>
              <ShimmerLine width="70%" height={14} />
              <ShimmerLine width="90%" height={12} />
              <ShimmerBox width="55%" height={16} borderRadius={8} />
            </View>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.seatInfo}>
          <View style={styles.seatIconContainer}>
            <ShimmerBox width={20} height={20} borderRadius={10} />
          </View>
          <View style={styles.seatTextContainer}>
            <ShimmerLine width={30} height={14} />
            <ShimmerLine width={80} height={12} />
          </View>
        </View>
        <ShimmerLine width={80} height={14} />
      </View>
    </View>
  );
};

export default TripSummaryCardSkeleton;

