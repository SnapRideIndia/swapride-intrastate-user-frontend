import React from 'react';
import { View, Image, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { SwText as Text } from '../SwText/SwText';
import { useTheme } from '../../../theme/ThemeProvider';

interface UserAvatarProps {
  url?: string;
  name?: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

const UserAvatar = ({ url, name, size = 44, style }: UserAvatarProps) => {
  const { colors } = useTheme();
  
  const getInitials = (userName?: string) => {
    if (!userName || userName.trim() === '') return '?';
    const nameArray = userName.trim().split(' ');
    if (nameArray.length === 1) return nameArray[0].charAt(0).toUpperCase();
    return (nameArray[0].charAt(0) + nameArray[nameArray.length - 1].charAt(0)).toUpperCase();
  };

  const initials = getInitials(name);
  const hasValidUrl = typeof url === 'string' && url.trim().length > 0 && (url.startsWith('http') || url.startsWith('file://') || url.startsWith('content://'));

  return (
    <View 
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: hasValidUrl ? 'transparent' : '#E2E8F0',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: colors.border_3,
        },
        style
      ]}
    >
      {hasValidUrl ? (
        <Image source={{ uri: url }} style={{ width: '100%', height: '100%' }} />
      ) : (
        <Text 
          style={{
            fontSize: size * 0.4,
            color: colors.primary,
            includeFontPadding: false,
            textAlignVertical: 'center',
          }} 
          variant="bold"
        >
          {initials}
        </Text>
      )}
    </View>
  );
};

export default UserAvatar;
