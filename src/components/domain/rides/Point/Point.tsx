import React from 'react';
import { View, Image, TouchableOpacity, ScrollView } from 'react-native';
import { SwText as Text } from '../../../common/SwText/SwText';
import { useTheme } from '../../../../theme/ThemeProvider';
import { useStyles } from './Point.styles';
import { ImageSource } from '../../../../constants/images';

interface PointProps {
  time: string;
  title: string;
  description: string;
  images?: any[];
  onDirectionPress?: () => void;
  showLine?: boolean;
}

export const Point: React.FC<PointProps> = ({
  time,
  title,
  description,
  images,
  onDirectionPress,
  showLine = true,
}) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);

  return (
    <View style={styles.container}>
      {/* Left Indicator Column */}
      <View style={styles.indicatorColumn}>
        <View style={styles.dot} />
        {showLine && <View style={styles.dashedLine} />}
      </View>

      {/* Right Content Column */}
      <View style={styles.contentColumn}>
        {/* Header: Time and Direction */}
        <View style={styles.headerRow}>
          <Text variant="bold" style={styles.timeText}>
            {time}
          </Text>
          <TouchableOpacity style={styles.directionButton} onPress={onDirectionPress}>
            <View
              style={{
                width: 14,
                height: 14,
                borderRadius: 7,
                backgroundColor: colors.primary,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <View
                style={{
                  width: 6,
                  height: 6,
                  borderRightWidth: 1.5,
                  borderTopWidth: 1.5,
                  borderColor: 'white',
                  transform: [{ rotate: '45deg' }, { translateX: -1 }],
                }}
              />
            </View>
            <Text variant="semi-bold" style={styles.directionText}>
              Direction
            </Text>
          </TouchableOpacity>
        </View>

        {/* Title */}
        <Text variant="bold" style={styles.title}>
          {title}
        </Text>

        {/* Description */}
        <Text variant="medium" style={styles.description}>
          {description}
        </Text>

        {/* Images */}
        {images && images.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.imagesContainer}>
            {images.map((img, index) => {
              const imageSource = typeof img === 'string' 
                ? { uri: img } 
                : (img?.imageUrl ? { uri: img.imageUrl } : img);
              return (
                <Image 
                  key={index} 
                  source={imageSource} 
                  style={styles.placeholderImage}
                />
              );
            })}
          </ScrollView>
        )}
      </View>
    </View>
  );
};
