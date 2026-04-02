import React, { ReactNode } from 'react';
import { Image, ImageSourcePropType, ImageStyle, StyleProp, View } from 'react-native';
import { useTheme } from '../../../theme/ThemeProvider';
import { useStyles } from './NoResults.styles';
import { SwText as Text } from '../SwText/SwText';

type NoResultsProps = {
  image: ImageSourcePropType;
  title: string;
  subtitle?: string;
  action?: ReactNode;
  imageStyle?: StyleProp<ImageStyle>;
};

export const NoResults: React.FC<NoResultsProps> = ({ image, title, subtitle, action, imageStyle }) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);

  return (
    <View style={styles.container}>
      <Image source={image} style={[styles.image, imageStyle]} />
      <Text variant="semi-bold" style={styles.title}>
        {title}
      </Text>
      {subtitle ? (
        <Text variant="regular" style={styles.subtitle}>
          {subtitle}
        </Text>
      ) : null}
      {action ? <View style={styles.actionContainer}>{action}</View> : null}
    </View>
  );
};

