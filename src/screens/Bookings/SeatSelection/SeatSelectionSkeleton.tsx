import React from 'react';
import { ScrollView, View } from 'react-native';
import { useTheme } from '../../../theme/ThemeProvider';
import { useStyles } from './SeatSelection.styles';
import { ShimmerBox } from '../../../components/common/Shimmer';

const SeatSelectionSkeleton = () => {
  const { colors } = useTheme();
  const styles = useStyles(colors);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 24, paddingBottom: 24 }}>
          <View
            style={{
              backgroundColor: colors.background_primary,
              borderRadius: 24,
              paddingVertical: 16,
              paddingHorizontal: 12,
              flex: 1,
            }}
          >
            <ShimmerBox width="100%" height="100%" borderRadius={20} />
          </View>
        </View>
      </ScrollView>

      <View style={styles.selectionContainer}>
        <ShimmerBox width="60%" height={18} borderRadius={9} />
      </View>

      <View style={styles.footer}>
        <ShimmerBox width="100%" height={52} borderRadius={12} />
      </View>
    </View>
  );
};

export default SeatSelectionSkeleton;


