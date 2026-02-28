import React from 'react';
import { View, Image } from 'react-native';
import { SwText as Text } from '../../../common/SwText/SwText';
import { useTheme } from '../../../../theme/ThemeProvider';
import { useStyles } from './DriverDetail.styles';
import { ImageSource } from '../../../../constants/images';

interface DriverDetailProps {
  name: string;
  plate: string;
  experience: string;
  languages: string;
  location: string;
  aboutDescription: string;
  avatar?: any;
}

export const DriverDetail: React.FC<DriverDetailProps> = ({
  name,
  plate,
  experience,
  languages,
  location,
  aboutDescription,
  avatar,
}) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);

  return (
    <View style={styles.container}>
      <Text varient="bold" style={styles.caption}>
        Your swapride caption
      </Text>

      <View style={styles.profileRow}>
        <View style={styles.avatarPlaceholder}>
          {avatar && (
            <Image
              source={avatar}
              style={{ width: 60, height: 60, borderRadius: 30 }}
            />
          )}
        </View>
        <View style={styles.infoContainer}>
          <View style={styles.namePlateRow}>
            <Text varient="bold" style={styles.nameText}>
              {name}
            </Text>
            <View style={styles.dotSeparator} />
            <Text varient="semi-bold" style={styles.plateText}>
              {plate}
            </Text>
          </View>

          <View style={styles.badgesRow}>
            <View style={styles.badge}>
              <Image source={ImageSource.steering} style={styles.badgeIcon} />
              <Text varient="regular" style={styles.badgeText}>
                {experience}
              </Text>
            </View>
            <View style={styles.badge}>
              <Image source={ImageSource.languages} style={styles.badgeIcon} />
              <Text varient="regular" style={styles.badgeText}>
                {languages}
              </Text>
            </View>
            <View style={styles.badge}>
              <Image source={ImageSource.mapPin} style={styles.badgeIcon} />
              <Text varient="regular" style={styles.badgeText}>
                {location}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.aboutSection}>
        <View style={styles.aboutContent}>
          <Text varient="bold" style={styles.aboutTitle}>
            About him
          </Text>
          <Text varient="regular" style={styles.aboutDescription}>
            {aboutDescription}
          </Text>
        </View>
      </View>
    </View>
  );
};
