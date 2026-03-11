import React from 'react';
import { View } from 'react-native';
import StarRating from 'react-native-star-rating-widget';
import { useTheme } from '../../../theme/ThemeProvider';

export interface SwRatingProps {
  rating: number;
  onChange?: (rating: number) => void;
  starSize?: number;
  maxStars?: number;
  color?: string;
  emptyColor?: string;
  style?: any;
  displayOnly?: boolean;
}

export const SwRating: React.FC<SwRatingProps> = ({
  rating,
  onChange,
  starSize = 16,
  maxStars = 5,
  color,
  emptyColor,
  style,
  displayOnly = false,
}) => {
  const { colors } = useTheme();

  return (
    <View pointerEvents={displayOnly ? 'none' : 'auto'}>
      <StarRating
        rating={rating}
        onChange={onChange || (() => {})}
        starSize={starSize}
        maxStars={maxStars}
        color={color || '#FFD700'}
        emptyColor={emptyColor || colors.border_3}
        starStyle={[{ marginHorizontal: 2 }, style]}
      />
    </View>
  );
};
