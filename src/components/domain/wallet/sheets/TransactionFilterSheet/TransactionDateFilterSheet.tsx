import React, { forwardRef, useMemo, useState } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useTheme } from '../../../../../theme/ThemeProvider';
import { useStyles } from './TransactionDateFilterSheet.styles';
import { SwText as Text } from '../../../../common/SwText/SwText';
import PrimaryButton from '../../../../common/SwButton/PrimaryButton/PrimaryButton';
import { SwBottomSheet as BottomSheet } from '../../../../common/BottomSheet/BottomSheet';
import DatePicker from 'react-native-date-picker';
import { format } from 'date-fns';
import type { DateFilter, DateFilterValue } from '../../../../../types/transactionFilters';

export const DATE_FILTER_OPTIONS: { value: DateFilterValue; label: string }[] = [
  { value: 'TODAY', label: 'Today' },
  { value: 'YESTERDAY', label: 'Yesterday' },
  { value: 'THIS_WEEK', label: 'This week' },
  { value: 'LAST_WEEK', label: 'Last week' },
  { value: 'THIS_MONTH', label: 'This month' },
  { value: 'LAST_MONTH', label: 'Last month' },
  { value: 'LAST_30_DAYS', label: 'Last 30 days' },
  { value: 'LAST_90_DAYS', label: 'Last 90 days' },
  { value: 'THIS_YEAR', label: 'This year' },
];

interface TransactionDateFilterSheetProps {
  initialValue?: DateFilter;
  onChange?: (value: DateFilter) => void;
}

type LocalMode = 'NONE' | 'PRESET' | 'CUSTOM';

export const TransactionDateFilterSheet = forwardRef<BottomSheetModal, TransactionDateFilterSheetProps>(
  ({ initialValue, onChange }, ref) => {
    const { colors } = useTheme();
    const styles = useStyles(colors);
    const initialState = useMemo<{
      mode: LocalMode;
      preset: DateFilterValue | null;
      startDate: Date | null;
      endDate: Date | null;
    }>(() => {
      if (!initialValue || initialValue.mode === 'NONE') {
        return { mode: 'NONE', preset: null, startDate: null, endDate: null };
      }
      if (initialValue.mode === 'PRESET') {
        return { mode: 'PRESET', preset: initialValue.preset, startDate: null, endDate: null };
      }
      return {
        mode: 'CUSTOM',
        preset: null,
        startDate: new Date(initialValue.startDate),
        endDate: new Date(initialValue.endDate),
      };
    }, [initialValue]);

    const [mode, setMode] = useState<LocalMode>(initialState.mode);
    const [selectedPreset, setSelectedPreset] = useState<DateFilterValue | null>(initialState.preset);
    const [startDate, setStartDate] = useState<Date | null>(initialState.startDate);
    const [endDate, setEndDate] = useState<Date | null>(initialState.endDate);
    const [activePicker, setActivePicker] = useState<'from' | 'to' | null>(null);

    const isCustomValid = useMemo(() => {
      if (!startDate || !endDate) return false;
      return startDate <= endDate;
    }, [startDate, endDate]);

    const toApiDate = (d: Date) => format(d, 'yyyy-MM-dd');

    const handleApply = () => {
      if (mode === 'PRESET' && selectedPreset) {
        onChange?.({ mode: 'PRESET', preset: selectedPreset });
      } else if (mode === 'CUSTOM' && isCustomValid && startDate && endDate) {
        onChange?.({
          mode: 'CUSTOM',
          startDate: toApiDate(startDate),
          endDate: toApiDate(endDate),
        });
      } else {
        onChange?.({ mode: 'NONE' });
      }
      // @ts-ignore
      ref?.current?.dismiss();
    };

    const handleClear = () => {
      setMode('NONE');
      setSelectedPreset(null);
      setStartDate(null);
      setEndDate(null);
      onChange?.({ mode: 'NONE' });
      // @ts-ignore
      ref?.current?.dismiss();
    };

    return (
      <BottomSheet ref={ref} title="Date" snapPoints={['80%']}>
        <View style={styles.root}>
          <ScrollView style={styles.listScroll} contentContainerStyle={styles.container}>
            {DATE_FILTER_OPTIONS.map(option => {
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
                Custom date
              </Text>
              <View style={styles.radioOuter}>
                {mode === 'CUSTOM' && <View style={styles.radioInner} />}
              </View>
            </TouchableOpacity>

            {mode === 'CUSTOM' && (
              <View style={styles.customSection}>
                <View style={styles.customRow}>
                  <TouchableOpacity
                    style={styles.badge}
                    activeOpacity={0.8}
                    onPress={() => setActivePicker('from')}
                  >
                    <Text variant="regular" style={styles.customValue}>
                      {startDate ? format(startDate, 'dd/MM/yyyy') : 'Select date'}
                    </Text>
                  </TouchableOpacity>
                  <Text variant="regular" style={styles.toText}>
                    To
                  </Text>
                  <TouchableOpacity
                    style={styles.badge}
                    activeOpacity={0.8}
                    onPress={() => setActivePicker('to')}
                  >
                    <Text variant="regular" style={styles.customValue}>
                      {endDate ? format(endDate, 'dd/MM/yyyy') : 'Select date'}
                    </Text>
                  </TouchableOpacity>
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

        <DatePicker
          modal
          mode="date"
          open={activePicker !== null}
          date={activePicker === 'to' && endDate ? endDate : startDate || new Date()}
          onConfirm={date => {
            if (activePicker === 'from') {
              setStartDate(date);
              if (!endDate || date > endDate) {
                setEndDate(date);
              }
            } else if (activePicker === 'to') {
              setEndDate(date);
            }
            setActivePicker(null);
          }}
          onCancel={() => setActivePicker(null)}
        />
      </BottomSheet>
    );
  },
);

