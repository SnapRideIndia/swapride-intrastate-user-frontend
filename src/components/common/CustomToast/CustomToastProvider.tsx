import  { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, View } from 'react-native';
import { ImageSource } from '../../../constants/images';
import { lightColors } from '../../../constants/ui/colors';
import {
  CustomToastPayload,
  registerToastListener,
  ToastPosition,
  ToastType,
} from '../../../utils/customToast';

const TOAST_OFFSET = 26;
const TOAST_BOTTOM = 48;
const TOAST_TOP = 58;

const getTypeStyles = (type: ToastType) => {
  switch (type) {
    case 'success':
      return {
        borderColor: '#22C55E',
        backgroundColor: '#DCFCE7',
        titleColor: '#166534',
        subtitleColor: '#15803D',
      };
    case 'error':
      return {
        borderColor: '#EF4444',
        backgroundColor: '#FEE2E2',
        titleColor: '#991B1B',
        subtitleColor: '#B91C1C',
      };
    case 'info':
      return {
        borderColor: '#3B82F6',
        backgroundColor: '#DBEAFE',
        titleColor: '#1E3A8A',
        subtitleColor: '#1D4ED8',
      };
    case 'warn':
      return {
        borderColor: '#F59E0B',
        backgroundColor: '#FEF3C7',
        titleColor: '#92400E',
        subtitleColor: '#B45309',
      };
    default:
      return {
        borderColor: '#94A3B8',
        backgroundColor: '#F1F5F9',
        titleColor: lightColors.primary,
        subtitleColor: '#475569',
      };
  }
};

const CustomToastProvider = () => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(TOAST_OFFSET)).current;
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const payloadRef = useRef<CustomToastPayload | null>(null);
  const [visiblePayload, setVisiblePayload] = useState<CustomToastPayload | null>(null);

  const clearPendingHide = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  };

  const hideToast = useCallback(() => {
    clearPendingHide();
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 180,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: TOAST_OFFSET,
        duration: 180,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setVisiblePayload(null);
      payloadRef.current = null;
    });
  }, [opacity, translateY]);

  const animateIn = useCallback(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 220,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, translateY]);

  const showToast = useCallback(
    (payload: CustomToastPayload) => {
      clearPendingHide();
      const normalizedPayload: CustomToastPayload = {
        type: payload.type ?? 'default',
        text1: payload.text1 ?? '',
        text2: payload.text2 ?? '',
        duration: payload.duration ?? 3000,
        autoHide: payload.autoHide ?? true,
        position: payload.position ?? 'bottom',
      };

      payloadRef.current = normalizedPayload;
      setVisiblePayload(normalizedPayload);
      opacity.setValue(0);
      translateY.setValue(TOAST_OFFSET);
      animateIn();

      if (normalizedPayload.autoHide) {
        hideTimeoutRef.current = setTimeout(() => {
          hideToast();
        }, normalizedPayload.duration);
      }
    },
    [animateIn, hideToast, opacity, translateY],
  );

  useEffect(() => {
    registerToastListener(showToast);
    return () => {
      clearPendingHide();
      registerToastListener(null);
    };
  }, [showToast]);

  const currentType = (visiblePayload?.type ?? 'default') as ToastType;
  const typeStyles = useMemo(() => getTypeStyles(currentType), [currentType]);
  const position = (visiblePayload?.position ?? 'bottom') as ToastPosition;

  if (!visiblePayload) {
    return null;
  }

  return (
    <View pointerEvents="box-none" style={styles.overlay}>
      <Animated.View
        style={[
          styles.toast,
          position === 'top' ? styles.top : styles.bottom,
          {
            borderColor: typeStyles.borderColor,
            backgroundColor: typeStyles.backgroundColor,
            opacity,
            transform: [{ translateY }],
          },
        ]}>
        <Image source={ImageSource.splashLogo} style={styles.logo} resizeMode="contain" />
        <View style={styles.textContainer}>
          {!!visiblePayload.text1 && (
            <Text numberOfLines={2} style={[styles.title, { color: typeStyles.titleColor }]}>
              {visiblePayload.text1}
            </Text>
          )}
          {!!visiblePayload.text2 && (
            <Text numberOfLines={2} style={[styles.subtitle, { color: typeStyles.subtitleColor }]}>
              {visiblePayload.text2}
            </Text>
          )}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    elevation: 9999,
    pointerEvents: 'none',
  },
  toast: {
    position: 'absolute',
    left: 16,
    right: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderRadius: 999,
    minHeight: 64,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  top: {
    top: TOAST_TOP,
  },
  bottom: {
    bottom: TOAST_BOTTOM,
  },
  logo: {
    width: 34,
    height: 34,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 2,
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
});

export default CustomToastProvider;
