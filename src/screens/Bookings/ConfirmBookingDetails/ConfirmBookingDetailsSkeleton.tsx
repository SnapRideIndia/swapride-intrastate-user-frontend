import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../theme/ThemeProvider';
import { useStyles } from './ConfirmBookingDetails.styles';
import { ShimmerBox, ShimmerLine } from '../../../components/common/Shimmer';
import TripSummaryCardSkeleton from '../../../components/domain/booking/TripSummaryCard/TripSummaryCardSkeleton';

const ConfirmBookingDetailsSkeleton = () => {
  const { colors } = useTheme();
  const styles = useStyles(colors);

  return (
    <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.cardsContainer}>
        <TripSummaryCardSkeleton />
      </View>

      <View style={[styles.whiteSection, styles.whiteSectionWithGap]}>
        <View style={{ paddingHorizontal: 20, paddingTop: 16, gap: 8 }}>
          <ShimmerLine width="40%" height={16} />
          <ShimmerLine width="60%" height={14} />
          <ShimmerLine width="50%" height={14} />
          <ShimmerBox width="100%" height={52} borderRadius={12} />
        </View>
      </View>

      <View style={styles.whiteSection}>
        <View style={styles.policyRow}>
          <ShimmerLine width="60%" height={16} />
        </View>
        <SafeAreaView edges={['bottom']} style={styles.footer}>
          <ShimmerBox width="100%" height={52} borderRadius={12} />
        </SafeAreaView>
      </View>
    </ScrollView>
  );
};

export default ConfirmBookingDetailsSkeleton;


