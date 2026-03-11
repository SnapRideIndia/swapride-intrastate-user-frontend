import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../../theme/ThemeProvider';
import { useStyles } from './FareDetails.styles';
import { SwText as Text } from '../../../common/SwText/SwText';
import { Seperator } from '../../../common/Seperator/Seperator';

import { ImageSource } from '../../../../constants/images';
import { Image } from 'react-native';
import AppliedCoupon from '../AppliedCoupon/AppliedCoupon';

export interface FareDetailsProps {
  outboundFare: number;
  returnFare?: number;
  walletBalance: number;
  onApplyPromo?: () => void;
  onRemovePromo?: () => void;
  appliedCoupon?: { code: string; savings: number } | null;
}

const FareDetails: React.FC<FareDetailsProps> = ({
  outboundFare,
  returnFare,
  walletBalance,
  onApplyPromo,
  onRemovePromo,
  appliedCoupon,
}) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);

  const total = outboundFare + (returnFare ?? 0) - walletBalance;

  return (
    <View style={styles.container}>
      <Text variant="semi-bold" style={styles.title}>
        Fare Details
      </Text>

      <View style={styles.rows}>
        <View style={styles.row}>
          <Text style={styles.label}>outbound ride fare</Text>
          <Text variant="bold" style={styles.value}>
            ₹{outboundFare}
          </Text>
        </View>

        {returnFare !== undefined && (
          <View style={styles.row}>
            <Text style={styles.label}>Return ride fare</Text>
            <Text variant="bold" style={styles.value}>
              ₹{returnFare}
            </Text>
          </View>
        )}

        <View style={styles.row}>
          <View>
            <Text style={styles.label}>Swapride Wallet</Text>
            <Text style={styles.subLabel}>(Remaining Bal : {walletBalance})</Text>
          </View>
          <Text variant="bold" style={styles.value}>
            - ₹0
          </Text>
        </View>

        {appliedCoupon ? (
          <AppliedCoupon code={appliedCoupon.code} savings={appliedCoupon.savings} onRemove={onRemovePromo} />
        ) : (
          <TouchableOpacity onPress={onApplyPromo} style={styles.promoButton}>
            <Text variant="bold" style={styles.promoText}>
              Apply Promo code?
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <Seperator style={styles.separator} color="transparent" />

      <View style={styles.totalRow}>
        <Text variant="semi-bold" style={styles.totalLabel}>
          Total Payable
        </Text>
        <Text variant="bold" style={styles.totalValue}>
          ₹{total - (appliedCoupon ? appliedCoupon.savings : 0)}
        </Text>
      </View>
    </View>
  );
};

export default FareDetails;
