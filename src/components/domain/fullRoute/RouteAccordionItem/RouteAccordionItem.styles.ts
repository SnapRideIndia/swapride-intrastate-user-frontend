import { StyleSheet } from 'react-native';
import { ColorsType } from '../../../../constants/ui/colors/colors.types';
import type { RouteStepKind } from './RouteAccordionItem';

const TIMELINE_WIDTH = 26;
const DOT_SIZE = 12;
const DOT_BORDER = 2;
const DOT_TOP = 16; // aligns with header text baseline-ish
const LINE_WIDTH = 2;
const LINE_LEFT = (TIMELINE_WIDTH - LINE_WIDTH) / 2;
const DOT_LEFT = (TIMELINE_WIDTH - DOT_SIZE) / 2;
const DOT_CENTER_Y = DOT_TOP + DOT_SIZE / 2;

const dotByKind = (colors: ColorsType, kind: RouteStepKind) => {
  switch (kind) {
    case 'walk':
      return {
        backgroundColor: colors.button_primary,
        borderColor: colors.button_primary,
      };
    case 'pickup':
      return {
        backgroundColor: colors.primaryLight,
        borderColor: colors.primaryLight,
      };
    case 'dropoff':
      return {
        backgroundColor: colors.contentBlue,
        borderColor: colors.contentBlue,
      };
    default:
      return {
        backgroundColor: colors.background_primary,
        borderColor: colors.border_3,
      };
  }
};

export const useStyles = (colors: ColorsType, kind: RouteStepKind) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'stretch',
      paddingHorizontal: 16,
      backgroundColor: colors.background_primary,
    },
    timeline: {
      width: TIMELINE_WIDTH,
      position: 'relative',
    },
    dot: {
      position: 'absolute',
      top: DOT_TOP,
      left: DOT_LEFT,
      width: DOT_SIZE,
      height: DOT_SIZE,
      borderRadius: DOT_SIZE / 2,
      borderWidth: DOT_BORDER,
      ...dotByKind(colors, kind),
    },
    upperConnector: {
      position: 'absolute',
      left: LINE_LEFT,
      width: LINE_WIDTH,
      top: 0,
      height: DOT_CENTER_Y,
      backgroundColor: colors.border_3,
      borderRadius: 2,
    },
    lowerConnector: {
      position: 'absolute',
      left: LINE_LEFT,
      width: LINE_WIDTH,
      top: DOT_CENTER_Y,
      bottom: 0,
      backgroundColor: colors.border_3,
      borderRadius: 2,
    },
    content: {
      flex: 1,
      paddingLeft: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.border_2,
      paddingVertical: 10,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
    },
    headerTextCol: {
      flex: 1,
      gap: 4,
    },
    headerRightCol: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    label: {
      fontSize: 12,
      color: colors.contentSecondary,
    },
    title: {
      fontSize: 14,
      color: colors.contentPrimary,
    },
    subtitle: {
      fontSize: 12,
      color: colors.contenttertiary,
    },
    chevron: {
      width: 16,
      height: 9,
      tintColor: colors.contentPrimary,
      transform: [{ rotate: '0deg' }],
    },
    chevronOpen: {
      transform: [{ rotate: '180deg' }],
    },
    body: {
      marginTop: 10,
      gap: 10,
    },
    description: {
      fontSize: 12,
      color: colors.contentSecondary,
      lineHeight: 18,
      width: '92%',
    },
    previewRow: {
      flexDirection: 'row',
      gap: 12,
    },
    previewCard: {
      flex: 1,
      width: 150,
      height: 80,
      borderRadius: 10,
      backgroundColor: colors.border_2,
    },
    directionsBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.primary,
      backgroundColor: colors.background_primary,
    },
    directionsText: {
      fontSize: 12,
      color: colors.primary,
    },
    directionsIcon: {
      width: 12,
      height: 12,
      tintColor: colors.primary,
    },
  });

