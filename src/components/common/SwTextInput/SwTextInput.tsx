import { StyleSheet, TextInput, TextInputProps, View, ViewStyle, StyleProp } from 'react-native';
import React, { ReactNode } from 'react';
import { useTheme } from '../../../theme/ThemeProvider';
import { useStyles } from './SwTextInput.styles';
import { SwText as Text } from '../SwText/SwText';

interface IInputProps extends TextInputProps {
  title?: string;
  isPhno?: boolean;
  renderRightIcon?: () => ReactNode;
  renderLeftIcon?: () => ReactNode;
  renderTitleIcon?: () => ReactNode;
  variant?: 'default' | 'rounded';
  errorText?: string;
  inputContainerStyle?: StyleProp<ViewStyle>;
}

export const SwTextInput = ({ variant = 'default', errorText, ...props }: IInputProps) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  return (
    <View style={styles.inputOuterContainer}>
      {props.title ? (
        <View style={styles.iconWithTitle}>
          {props.renderTitleIcon?.()}
          <Text variant="semi-bold" style={styles.title}>
            {props.title}
          </Text>
        </View>
      ) : null}
      <View
        style={[
          styles.inputInnerContainer,
          variant === 'rounded' && styles.roundedContainer,
          props.isPhno && styles.phNoStyle,
          !!errorText && styles.inputErrorBorder,
          props.inputContainerStyle,
        ]}
      >
        {props.renderLeftIcon?.()}
        {props.isPhno && <Text>+91 | </Text>}
        <TextInput style={styles.inputStyle} placeholderTextColor={props.placeholderTextColor || colors.contenttertiary} {...props} />
        {props.renderRightIcon?.()}
      </View>
      {errorText ? (
        <Text variant="medium" style={styles.errorText}>
          {errorText}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({});
