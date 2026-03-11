import React from 'react';
import { Image, View } from 'react-native';
import { useTheme } from '../../../../theme/ThemeProvider';
import { SwText as Text } from '../../../common/SwText/SwText';
import { ImageSource } from '../../../../constants/images';
import { useStyles } from './EmptyCommuteData.styles';

interface Props {
  message?: string;
}

export const EmptyCommuteData: React.FC<Props> = ({ message = 'No buses found for this route on this date.' }) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);

  return (
    <View style={styles.container}>
      <Image source={ImageSource.shuttel} style={styles.image} />
      <Text variant="semi-bold" style={styles.text}>
        {message}
      </Text>
    </View>
  );
};
