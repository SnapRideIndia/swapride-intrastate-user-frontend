import React from 'react';
import { View, Image, TouchableOpacity, Linking } from 'react-native';
import { SwText as Text } from '../../../common/SwText/SwText';
import { useTheme } from '../../../../theme/ThemeProvider';
import { useStyles } from './DriverDetail.styles';
import { ImageSource } from '../../../../constants/images';
import { SwRating } from '../../../common/SwRating/SwRating';

interface DriverDetailProps {
  name: string;
  avatar?: any;
  phone?: string;
  rating?: string; // Driver's average rating from API
}

export const DriverDetail: React.FC<DriverDetailProps> = ({
  name,
  avatar,
  phone,
  rating,
}) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);

  const driverAvgRating = rating ? parseFloat(rating) : 0;

  const handleCall = () => {
    if (phone) {
      Linking.openURL(`tel:${phone}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="bold" style={styles.caption}>
        Driver Information
      </Text>

      <View style={styles.profileRow}>
        <View style={styles.avatarPlaceholder}>
          {avatar && <Image source={avatar} style={{ width: 60, height: 60, borderRadius: 30 }} />}
        </View>

        {/* Name, phone, rating */}
        <View style={styles.infoContainer}>
          <View style={styles.namePlateRow}>
            <Text variant="bold" style={styles.nameText}>
              {name}
            </Text>
          </View>

          <View style={{ marginTop: 2 }}>
            <SwRating 
              rating={driverAvgRating} 
              starSize={20} 
              displayOnly={true}
            />
          </View>
        </View>

        {/* Call button at end of row */}
        {phone && (
          <TouchableOpacity onPress={handleCall} style={styles.callButton}>
            <Image source={ImageSource.callOutline} style={styles.callIcon} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
