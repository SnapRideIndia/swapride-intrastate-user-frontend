import  { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, View } from 'react-native';
import { ImageSource } from '../../../constants/images';
import { useTheme } from '../../../theme/ThemeProvider';
import {
  CustomToastPayload,
  registerToastListener,
  ToastPosition,
  ToastType,
} from '../../../utils/customToast';

const TOAST_OFFSET = 26;
const TOAST_BOTTOM = 100;
const TOAST_TOP = 100;

const getTypeStyles = (colors: any) => {
  const primaryColor = colors.primary || '#072A6A';
  return {
    titleColor: primaryColor,
    subtitleColor: primaryColor,
  };
};

const CustomToastProvider = () => {
  const { colors: themeColors } = useTheme();
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
        duration: 200,
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
      Animated.spring(translateY, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, translateY]);

  const showToast = useCallback(
    (payload: CustomToastPayload) => {
      clearPendingHide();
      let t1 = payload.text1 ?? '';
      let t2 = payload.text2 ?? '';
      if (!t1 && t2) {
        t1 = t2;
        t2 = '';
      }
      const normalizedPayload: CustomToastPayload = {
        type: payload.type ?? 'default',
        text1: t1,
        text2: t2,
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

  const typeStyles = useMemo(() => getTypeStyles(themeColors), [themeColors]);
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
            backgroundColor: themeColors.background_primary || '#FFFFFF',
            opacity,
            transform: [{ translateY: translateY }],
          },
        ]}>
        <View style={styles.textContainer}>
          {!!visiblePayload.text1 && (
            <Text numberOfLines={2}  style={[styles.title, { color: typeStyles.titleColor }]}>
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
    alignSelf: 'center',
    borderRadius: 12,
    minHeight: 40,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
    maxWidth: '92%',
  },
  top: {
    top: TOAST_TOP,
  },
  bottom: {
    bottom: TOAST_BOTTOM,
  },
  textContainer: {
    flex: 0, // No flex: 1 to ensure center content width
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
});


export default CustomToastProvider;
