import React, { forwardRef, useState } from 'react';
import { View, TouchableOpacity, TextInput } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useTheme } from '../../../../../theme/ThemeProvider';
import { useStyles } from './AddAmountSheet.styles';
import { SwText as Text } from '../../../../common/SwText/SwText';
import PrimaryButton from '../../../../common/SwButton/PrimaryButton/PrimaryButton';
import { SwBottomSheet as BottomSheet } from '../../../../common/BottomSheet/BottomSheet';

interface AddAmountSheetProps {
  onContinue?: (amount: string) => void;
}

export const AddAmountSheet = forwardRef<BottomSheetModal, AddAmountSheetProps>(
  ({ onContinue }, ref) => {
    const { colors } = useTheme();
    const styles = useStyles(colors);
    const [amount, setAmount] = useState('');

    const handleQuickSelect = (value: string) => {
      setAmount(value);
    };

    const handleContinue = () => {
      onContinue?.(amount);
    };

    return (
      <BottomSheet ref={ref} title="Add Amount" snapPoints={['40%', '50%']}>
        <View style={styles.sheetContent}>
          <View style={styles.inputInnerContainer}>
            <TextInput
              style={{ flex: 1, color: colors.contentPrimary }}
              placeholder="Enter Amount to Recharge"
              placeholderTextColor={colors.contentSecondary}
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
          </View>

          <View style={styles.quickAmountRow}>
            {['100', '500', '1000'].map(val => (
              <TouchableOpacity
                key={val}
                style={styles.quickAmountButton}
                onPress={() => handleQuickSelect(val)}
              >
                <Text varient="semi-bold" style={styles.quickAmountText}>
                  {val}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <PrimaryButton
            title="Continue"
            btnStyle={styles.continueButton}
            textStyle={styles.continueButtonText}
            onPress={handleContinue}
          />
        </View>
      </BottomSheet>
    );
  },
);
