import React, { forwardRef, useMemo, useState } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useTheme } from '../../../../../theme/ThemeProvider';
import { useStyles } from './TransactionDateFilterSheet.styles';
import { SwText as Text } from '../../../../common/SwText/SwText';
import PrimaryButton from '../../../../common/SwButton/PrimaryButton/PrimaryButton';
import { SwBottomSheet as BottomSheet } from '../../../../common/BottomSheet/BottomSheet';
import { SwTextInput } from '../../../../common/SwTextInput/SwTextInput';
import type { AmountFilter } from '../../../../../types/transactionFilters';

export type AmountFilterValue = 'UP_TO_200' | 'BETWEEN_200_500' | 'BETWEEN_500_2000';

export const AMOUNT_FILTER_OPTIONS: { value: AmountFilterValue; label: string }[] = [
  { value: 'UP_TO_200', label: 'Up to ₹200' },
  { value: 'BETWEEN_200_500', label: '₹200 - ₹500' },
  { value: 'BETWEEN_500_2000', label: '₹500 - ₹2,000' },
];

interface TransactionAmountFilterSheetProps {
  initialValue?: AmountFilter;
  onChange?: (value: AmountFilter) => void;
}

type LocalMode = 'NONE' | 'PRESET' | 'CUSTOM';

export const TransactionAmountFilterSheet = forwardRef<BottomSheetModal, TransactionAmountFilterSheetProps>(
  ({ initialValue, onChange }, ref) => {
    const { colors } = useTheme();
    const styles = useStyles(colors);
    const initialState = useMemo<{
      mode: LocalMode;
      preset: AmountFilterValue | null;
      minText: string;
      maxText: string;
    }>(() => {
      if (!initialValue || initialValue.mode === 'NONE') {
        return { mode: 'NONE', preset: null, minText: '', maxText: '' };
      }
      if (initialValue.mode === 'PRESET') {
        // Try to reverse-map known presets
        if (initialValue.max === 200 && initialValue.min == null) {
          return { mode: 'PRESET', preset: 'UP_TO_200', minText: '', maxText: '' };
        }
        if (initialValue.min === 200 && initialValue.max === 500) {
          return { mode: 'PRESET', preset: 'BETWEEN_200_500', minText: '', maxText: '' };
        }
        if (initialValue.min === 500 && initialValue.max === 2000) {
          return { mode: 'PRESET', preset: 'BETWEEN_500_2000', minText: '', maxText: '' };
        }
        return {
          mode: 'CUSTOM',
          preset: null,
          minText: initialValue.min != null ? String(initialValue.min) : '',
          maxText: initialValue.max != null ? String(initialValue.max) : '',
        };
      }
      return {
        mode: 'CUSTOM',
        preset: null,
        minText: initialValue.min != null ? String(initialValue.min) : '',
        maxText: initialValue.max != null ? String(initialValue.max) : '',
      };
    }, [initialValue]);

    const [mode, setMode] = useState<LocalMode>(initialState.mode);
    const [selectedPreset, setSelectedPreset] = useState<AmountFilterValue | null>(initialState.preset);
    const [minText, setMinText] = useState(initialState.minText);
    const [maxText, setMaxText] = useState(initialState.maxText);

    const handleApply = () => {
      if (mode === 'PRESET' && selectedPreset) {
        switch (selectedPreset) {
          case 'UP_TO_200':
            onChange?.({ mode: 'PRESET', max: 200 });
            break;
          case 'BETWEEN_200_500':
            onChange?.({ mode: 'PRESET', min: 200, max: 500 });
            break;
          case 'BETWEEN_500_2000':
            onChange?.({ mode: 'PRESET', min: 500, max: 2000 });
            break;
          default:
            onChange?.({ mode: 'NONE' });
            break;
        }
      } else if (mode === 'CUSTOM') {
        const min = minText.trim().length ? Number(minText) : undefined;
        const max = maxText.trim().length ? Number(maxText) : undefined;
        onChange?.({ mode: 'CUSTOM', min, max });
      } else {
        onChange?.({ mode: 'NONE' });
      }
      // @ts-ignore
      ref?.current?.dismiss();
    };

    const handleClear = () => {
      setMode('NONE');
      setSelectedPreset(null);
      setMinText('');
      setMaxText('');
      onChange?.({ mode: 'NONE' });
      // @ts-ignore
      ref?.current?.dismiss();
    };

    return (
      <BottomSheet ref={ref} title="Amount" snapPoints={['50%']}>
        <View style={styles.root}>
          <ScrollView style={styles.listScroll} contentContainerStyle={styles.container}>
            {AMOUNT_FILTER_OPTIONS.map(option => {
              const isSelected = mode === 'PRESET' && selectedPreset === option.value;
              return (
                <TouchableOpacity
                  key={option.value}
                  style={styles.optionRow}
                  activeOpacity={0.8}
                  onPress={() => {
                    setMode('PRESET');
                    setSelectedPreset(option.value);
                  }}
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

            <TouchableOpacity
              style={styles.optionRow}
              activeOpacity={0.8}
              onPress={() => setMode('CUSTOM')}
            >
              <Text variant="regular" style={styles.optionLabel}>
                Custom range
              </Text>
              <View style={styles.radioOuter}>
                {mode === 'CUSTOM' && <View style={styles.radioInner} />}
              </View>
            </TouchableOpacity>

            {mode === 'CUSTOM' && (
              <View style={styles.customSection}>
                <View style={styles.customRow}>
                  <View style={{ flex: 1 }}>
                    <SwTextInput
                      placeholder="Min amount"
                      keyboardType="numeric"
                      value={minText}
                      onChangeText={setMinText}
                    />
                  </View>
                  <Text variant="regular" style={styles.toText}>
                    To
                  </Text>
                  <View style={{ flex: 1 }}>
                    <SwTextInput
                      placeholder="Max amount"
                      keyboardType="numeric"
                      value={maxText}
                      onChangeText={setMaxText}
                    />
                  </View>
                </View>
              </View>
            )}
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

