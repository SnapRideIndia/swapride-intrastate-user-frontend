import { ActivityIndicator, StyleProp, StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import React, { ReactNode } from 'react';
import { SwText } from '../../SwText/SwText';
import { useTheme } from '../../../../theme/ThemeProvider';
import { useStyles } from './PrimaryButton.styles';

interface IButtonProps {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  btnStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  renderLeftIcon?: () => ReactNode;
  renderRightIcon?: () => ReactNode;
}

const PrimaryButton = ({ title, onPress, disabled, loading, btnStyle, textStyle, renderLeftIcon, renderRightIcon }: IButtonProps) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  
  const isButtonDisabled = disabled || loading;

  return (
    <TouchableOpacity 
      style={[
        styles.button, 
        btnStyle, 
        isButtonDisabled && styles.buttonDisabled,
        loading && { opacity: 0.9 }
      ]} 
      onPress={onPress} 
      disabled={isButtonDisabled} 
      activeOpacity={isButtonDisabled ? 1 : 0.7}
    >
      {loading ? (
        <ActivityIndicator size="small" color={colors.contentPrimary} />
      ) : (
        <>
          {renderLeftIcon?.()}
          <SwText style={[styles.title, { color: isButtonDisabled ? colors.contentSecondary : colors.contentPrimary }, textStyle]} variant="semi-bold">
            {title}
          </SwText>
          {renderRightIcon?.()}
        </>
      )}
    </TouchableOpacity>
  );
};

export default PrimaryButton;

const styles = StyleSheet.create({});
