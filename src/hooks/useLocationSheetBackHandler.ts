import { useCallback, useRef } from 'react';
import { BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { BottomSheetModal } from '@gorhom/bottom-sheet';

/**
 * Intercepts Android back press with correct priority:
 *   1. Dismiss location sheet if open
 *   2. Run onFallbackBack (e.g. close a modal) if provided and returns true
 *   3. Allow default back navigation
 *
 * Returns onChange/onClose handlers to wire into SwLocationSearchBottomSheet.
 */
export const useLocationSheetBackHandler = (sheetRef: React.RefObject<BottomSheetModal | null>, onFallbackBack?: () => boolean) => {
  const isSheetOpen = useRef(false);

  const onChange = useCallback((index: number) => {
    isSheetOpen.current = index >= 0;
  }, []);

  const onClose = useCallback(() => {
    isSheetOpen.current = false;
  }, []);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (isSheetOpen.current) {
          sheetRef.current?.dismiss();
          return true;
        }
        return onFallbackBack?.() ?? false;
      };
      const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => sub.remove();
    }, [sheetRef, onFallbackBack]),
  );

  return { onChange, onClose };
};
