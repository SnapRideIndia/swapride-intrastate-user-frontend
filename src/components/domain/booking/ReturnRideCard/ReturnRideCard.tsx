import React, { useState } from 'react';
import { View, TouchableOpacity, TextInput } from 'react-native';
import { useTheme } from '../../../../theme/ThemeProvider';
import { useStyles } from './ReturnRideCard.styles';
import { SwText as Text } from '../../../common/SwText/SwText';
import PrimaryButton from '../../../common/SwButton/PrimaryButton/PrimaryButton';

interface ReturnRideCardProps {
  onShowBuses?: () => void;
}

const ReturnRideCard = ({ onShowBuses }: ReturnRideCardProps) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);

  const [meridian, setMeridian] = useState<'AM' | 'PM'>('AM');

  return (
    <View style={styles.container}>
      <Text variant="bold" style={styles.title}>
        Need a return ride too?
      </Text>
      <Text style={styles.subtitle}>Free cancellation if your plans change later</Text>

      <View style={styles.inputContainer}>
        <TextInput placeholder="Preferred Time" placeholderTextColor={colors.contenttertiary} style={styles.inputLabel} />
        <View style={styles.toggleContainer}>
          <TouchableOpacity style={[styles.toggleButton, meridian === 'AM' && styles.toggleButtonActive]} onPress={() => setMeridian('AM')}>
            <Text variant="medium" style={[styles.toggleText, meridian === 'AM' && styles.toggleTextActive]}>
              AM
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.toggleButton, meridian === 'PM' && styles.toggleButtonActive]} onPress={() => setMeridian('PM')}>
            <Text variant="medium" style={[styles.toggleText, meridian === 'PM' && styles.toggleTextActive]}>
              PM
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <PrimaryButton title="Show return buses" onPress={onShowBuses} btnStyle={styles.showBusesBtn} textStyle={styles.showBusesBtnTitle} />
    </View>
  );
};

export default ReturnRideCard;
