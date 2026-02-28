import React, { forwardRef, useState } from 'react';
import {
  View,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useTheme } from '../../../../../theme/ThemeProvider';
import { useStyles } from './AddAmountSheet.styles';
import { SwText as Text } from '../../../../common/SwText/SwText';
import PrimaryButton from '../../../../common/SwButton/PrimaryButton/PrimaryButton';
import { SwBottomSheet as BottomSheet } from '../../../../common/BottomSheet/BottomSheet';

interface AddAmountSheetProps {
  onContinue?: (amount: number) => void;
  isLoading?: boolean;
}

export const AddAmountSheet = forwardRef<BottomSheetModal, AddAmountSheetProps>(
  ({ onContinue, isLoading = false }, ref) => {
    const { colors } = useTheme();
    const styles = useStyles(colors);
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');

    const handleQuickSelect = (value: string) => {
      setAmount(value);
      setError('');
    };

    const handleContinue = () => {
      const parsed = parseFloat(amount);
      if (!amount || isNaN(parsed) || parsed <= 0) {
        setError('Please enter a valid amount');
        return;
      }
      setError('');
      onContinue?.(parsed);
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
              onChangeText={text => {
                setAmount(text);
                setError('');
              }}
              editable={!isLoading}
            />
          </View>

          {!!error && (
            <Text
              varient="regular"
              style={{ color: colors.contentRed, fontSize: 12, marginTop: 4 }}
            >
              {error}
            </Text>
          )}

          <View style={styles.quickAmountRow}>
            {['100', '500', '1000'].map(val => (
              <TouchableOpacity
                key={val}
                style={styles.quickAmountButton}
                onPress={() => handleQuickSelect(val)}
                disabled={isLoading}
              >
                <Text varient="semi-bold" style={styles.quickAmountText}>
                  {val}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <PrimaryButton
            title={isLoading ? '' : 'Continue'}
            btnStyle={styles.continueButton}
            textStyle={styles.continueButtonText}
            onPress={handleContinue}
            disabled={isLoading}
            renderRightIcon={
              isLoading
                ? () => (
                    <ActivityIndicator
                      size="small"
                      color={colors.primaryCtaText}
                    />
                  )
                : undefined
            }
          />
        </View>
      </BottomSheet>
    );
  },
);
