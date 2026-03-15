import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../../../../../theme/ThemeProvider';
import { ShimmerBox } from '../../../../common/Shimmer/ShimmerBox';

type Props = {
  style?: object;
};

const TransactionCardShimmer: React.FC<Props> = ({ style }) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);

  return (
    <View style={[styles.container, style]}>
      <ShimmerBox width="40%" height={14} borderRadius={8} style={styles.titleLine} />
      <ShimmerBox width="25%" height={16} borderRadius={8} style={styles.amountLine} />
      <ShimmerBox width="50%" height={12} borderRadius={8} style={styles.dateLine} />
    </View>
  );
};

export default TransactionCardShimmer;

const useStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background_primary,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border_3,
      paddingVertical: 10,
      paddingHorizontal: 16,
    },
    titleLine: {
      marginBottom: 4,
    },
    amountLine: {
      alignSelf: 'flex-end',
      marginBottom: 6,
    },
    dateLine: {},
  });

