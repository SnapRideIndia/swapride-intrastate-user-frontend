import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useTheme } from '../../../../../theme/ThemeProvider'
import { useStyles } from './OptionCard.styles';
import { ImageSource } from '../../../../../constants/images';
import { SwText as Text } from '../../../../common/SwText/SwText';

interface IProps {
  imgUri: any,
  title?: string,
  onPress?: () => void
}

const OptionCard = ({ imgUri, title, onPress }: IProps) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={imgUri} style={styles.icon} />
      <Text varient='medium' style={styles.title}>{title}</Text>
    </TouchableOpacity>
  )
}

export default OptionCard;