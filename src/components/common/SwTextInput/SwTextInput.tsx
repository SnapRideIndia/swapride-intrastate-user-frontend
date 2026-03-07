import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import React, { ReactNode } from 'react';
import { useTheme } from '../../../theme/ThemeProvider';
import { useStyles } from './SwTextInput.styles';
import { SwText as Text } from '../SwText/SwText';

interface IInputProps extends TextInputProps {
  title?: string;
  isPhno?: boolean;
  renderRightIcon?: () => ReactNode;
  renderTitleIcon?: () => ReactNode;
  variant?: 'default' | 'rounded';
}

export const SwTextInput = ({ variant = 'default', ...props }: IInputProps) => {
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
      <View style={[styles.inputInnerContainer, variant === 'rounded' && styles.roundedContainer, props.isPhno && styles.phNoStyle]}>
        {props.isPhno && <Text>+91 | </Text>}
        <TextInput style={styles.inputStyle} placeholderTextColor={props.placeholderTextColor || colors.contenttertiary} {...props} />
        {props.renderRightIcon?.()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});
