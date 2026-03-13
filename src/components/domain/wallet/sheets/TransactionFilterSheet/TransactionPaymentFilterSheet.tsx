import React, { forwardRef, useState } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useTheme } from '../../../../../theme/ThemeProvider';
import { useStyles } from './TransactionDateFilterSheet.styles';
import { SwText as Text } from '../../../../common/SwText/SwText';
import PrimaryButton from '../../../../common/SwButton/PrimaryButton/PrimaryButton';
import { SwBottomSheet as BottomSheet } from '../../../../common/BottomSheet/BottomSheet';
import type { PaymentFilter } from '../../../../../types/transactionFilters';

export type PaymentFilterValue = PaymentFilter;

export const PAYMENT_FILTER_OPTIONS: { value: PaymentFilterValue; label: string }[] = [
  { value: 'ALL', label: 'All' },
  { value: 'WALLET', label: 'Wallet' },
  { value: 'GATEWAY', label: 'Online Payments' },
];

interface TransactionPaymentFilterSheetProps {
  initialValue?: PaymentFilterValue | null;
  onChange?: (value: PaymentFilterValue | null) => void;
}

export const TransactionPaymentFilterSheet = forwardRef<BottomSheetModal, TransactionPaymentFilterSheetProps>(
  ({ initialValue = 'ALL', onChange }, ref) => {
    const { colors } = useTheme();
    const styles = useStyles(colors);
    const [selected, setSelected] = useState<PaymentFilterValue | null>(initialValue);

    const handleApply = () => {
      onChange?.(selected);
      // @ts-ignore
      ref?.current?.dismiss();
    };

    const handleClear = () => {
      setSelected('ALL');
      onChange?.('ALL');
      // @ts-ignore
      ref?.current?.dismiss();
    };

    return (
      <BottomSheet ref={ref} title="Payment type" snapPoints={['40%']}>
        <View style={styles.root}>
          <ScrollView style={styles.listScroll} contentContainerStyle={styles.container}>
            {PAYMENT_FILTER_OPTIONS.map(option => {
              const isSelected = selected === option.value;
              return (
                <TouchableOpacity
                  key={option.value}
                  style={styles.optionRow}
                  activeOpacity={0.8}
                  onPress={() => setSelected(option.value)}
                >
                  <Text variant="regular" style={styles.optionLabel}>
                    {option.label}
                  </Text>
                  <View style={styles.radioOuter}>
                    {isSelected && <View style={styles.radioInner} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View style={styles.buttonRow}>
            <PrimaryButton
              title="Clear Filters"
              btnStyle={styles.secondaryButton}
              textStyle={styles.secondaryButtonText}
              onPress={handleClear}
            />
            <PrimaryButton
              title="Apply Filters"
              btnStyle={styles.primaryButton}
              textStyle={styles.primaryButtonText}
              onPress={handleApply}
            />
          </View>
        </View>
      </BottomSheet>
    );
  },
);

