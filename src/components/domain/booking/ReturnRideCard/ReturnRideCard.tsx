import React, { useState } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { useTheme } from '../../../../theme/ThemeProvider';
import { useStyles } from './ReturnRideCard.styles';
import { SwText as Text } from '../../../common/SwText/SwText';
import PrimaryButton from '../../../common/SwButton/PrimaryButton/PrimaryButton';

interface ReturnRideCardProps {
  onShowBuses?: (time: string) => void;
  preferredTime: string;
  setPreferredTime: (v: string) => void;
  meridian: 'AM' | 'PM';
  setMeridian: (v: 'AM' | 'PM') => void;
}

const ReturnRideCard = ({ onShowBuses, preferredTime, setPreferredTime, meridian, setMeridian }: ReturnRideCardProps) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const [open, setOpen] = useState(false);

  const handleShowBuses = () => {
    onShowBuses?.(`${preferredTime} ${meridian}`);
  };

  const onConfirmDate = (date: Date) => {
    setOpen(false);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const m = hours >= 12 ? 'PM' : 'AM';
    const h = hours % 12 || 12;
    const formattedTime = `${h.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    setPreferredTime(formattedTime);
    setMeridian(m);
  };

  return (
    <View style={styles.container}>
      <Text variant="bold" style={styles.title}>
        Need a return ride too?
      </Text>
      <Text style={styles.subtitle}>Free cancellation if your plans change later</Text>

      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.inputLabel} onPress={() => setOpen(true)} activeOpacity={0.7}>
          <Text style={[styles.timeDisplayText, !preferredTime && { color: colors.contenttertiary }]}>
            {preferredTime ? `${preferredTime} ${meridian}` : 'Select Preferred Time'}
          </Text>
        </TouchableOpacity>
        <DatePicker
          modal
          mode="time"
          open={open}
          date={new Date()}
          onConfirm={onConfirmDate}
          onCancel={() => setOpen(false)}
          title="Select Preferred Time"
          confirmText="Confirm"
          cancelText="Cancel"
        />
      </View>

      <PrimaryButton
        title="Show return buses"
        onPress={handleShowBuses}
        btnStyle={styles.showBusesBtn}
        textStyle={styles.showBusesBtnTitle}
      />
    </View>
  );
};

export default ReturnRideCard;
