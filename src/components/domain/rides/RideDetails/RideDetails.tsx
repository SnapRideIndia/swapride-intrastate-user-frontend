import { View, Image, TouchableOpacity } from 'react-native';
import { SwText as Text } from '../../../../components/common/SwText/SwText';
import React, { useState } from 'react';
import { useTheme } from '../../../../theme/ThemeProvider';
import { useStyles } from './RideDetails.styles';
import { ImageSource } from '../../../../constants/images';
import { Seperator } from '../../../common/Seperator/Seperator';
import { Point } from '../Point/Point';

export interface PointData {
  time: string;
  title: string;
  description: string;
}

export interface RideDetailsProps {
  pickupData: PointData;
  dropoffData: PointData;
  onViewAllStops?: () => void;
}

const RideDetails: React.FC<RideDetailsProps> = ({
  pickupData,
  dropoffData,
  onViewAllStops,
}) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const [activeTab, setActiveTab] = useState<'pickup' | 'dropoff'>('pickup');

  return (
    <View style={styles.container}>
      <View style={[styles.contentWrapper, styles.flexRow]}>
        <Text varient="bold" style={[styles.primaryFont, styles.title]}>
          Ride Details
        </Text>

        <View style={styles.shareContainer}>
          <Text varient="bold" style={[styles.primaryFont, styles.shareText]}>
            Share
          </Text>
          <Image source={ImageSource.shareBlue} style={styles.shareIcon} />
        </View>
      </View>

      {/* Tab Bar */}
      <View style={styles.tabContainer}>
        <View style={styles.tabsWrapper}>
          <TouchableOpacity
            onPress={() => setActiveTab('pickup')}
            style={styles.tabItem}
          >
            <Text
              varient={activeTab === 'pickup' ? 'bold' : 'medium'}
              style={[
                styles.tabText,
                activeTab === 'pickup' && styles.activeTabText,
              ]}
            >
              Pickup
            </Text>
            {activeTab === 'pickup' && <View style={styles.activeIndicator} />}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('dropoff')}
            style={styles.tabItem}
          >
            <Text
              varient={activeTab === 'dropoff' ? 'bold' : 'medium'}
              style={[
                styles.tabText,
                activeTab === 'dropoff' && styles.activeTabText,
              ]}
            >
              Dropoff
            </Text>
            {activeTab === 'dropoff' && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={onViewAllStops}
          style={styles.viewAllStopsContainer}
        >
          <Text
            varient="bold"
            style={[styles.primaryFont, styles.viewAllStopsText]}
          >
            View all stops
          </Text>
          <Image source={ImageSource.chevron} style={styles.chevronIcon} />
        </TouchableOpacity>
      </View>

      <Seperator />

      {/* Tab Content */}
      <View style={styles.tabContentContainer}>
        {activeTab === 'pickup' ? (
          <Point
            time={pickupData.time}
            title={pickupData.title}
            description={pickupData.description}
            onDirectionPress={() => console.log('Direction pressed')}
          />
        ) : (
          <Point
            time={dropoffData.time}
            title={dropoffData.title}
            description={dropoffData.description}
            onDirectionPress={() => console.log('Direction pressed')}
          />
        )}
      </View>
    </View>
  );
};

export default RideDetails;
