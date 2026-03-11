import React from 'react';
import { Image, View } from 'react-native';
import { useTheme } from '../../../../theme/ThemeProvider';
import { SwText as Text } from '../../../common/SwText/SwText';
import { ImageSource } from '../../../../constants/images';
import { useStyles } from './EmptyCommuteData.styles';

interface Props {
  message?: string;
}

export const EmptyCommuteData: React.FC<Props> = ({ message }) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Image source={ImageSource.shuttel} style={styles.image} />
      </View>
      <Text variant="bold" style={styles.title}>
        No Buses Available
      </Text>
      <Text style={styles.text}>
        {message || "We couldn't find any buses for this route on the selected date. Please try a different date or route."}
      </Text>
    </View>
  );
};
