import { StyleSheet } from 'react-native';
import { ColorsType } from '../../../../../constants/ui/colors/colors.types';

export const useStyles = (colors: ColorsType) =>
  StyleSheet.create({
    container: {
      // backgroundColor: "green",
      // borderRadius: 20
    },
    topPickHeader: {
      padding: 15,
      backgroundColor: 'green',
      gap: 8,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingBottom: 30,
    },
    topPickHeaderTitleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    starBadgeIcon: {
      width: 18,
      height: 18,
      tintColor: colors.primaryCtaText,
    },
    topPickStyle: {
      fontSize: 16,
      color: colors.primaryCtaText,
    },
    topPickDesc: {
      color: colors.primaryCtaText,
      fontSize: 14,
    },
    mainCard: {
      padding: 15,
      paddingTop: 30,
      borderRadius: 20,
      backgroundColor: colors.background_primary,
      //   marginTop: -15,
      flex: 1,
      flexWrap: 'nowrap',
    },
    fromToContainer: {
      flexDirection: 'row',
      gap: 14,
      flex: 1,
    },
    badge: {
      width: 63,
      height: 22,
      backgroundColor: colors.button_primary,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 5,
    },
    time: {
      fontSize: 12,
      color: colors.contentPrimary,
    },
    badgeAndDeviderContainer: {
      maxHeight: 110,
      alignItems: 'center'
    },
    devider: {
      // height: 59,
      flex: 1,
      borderRightWidth: 1,
      borderStyle: 'dashed',
    },
    placeContainer: {
      gap: 15,
      flex: 1,
    },
    place: {
      flex: 1,
    },
    walkAndTimeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
    },
    walkIcon: {
      width: 7.04,
      height: 12,
    },
    downArrow: {
      width: 9,
      height: 5,
      marginTop: 5,
    },
    placeTitle: {
      fontSize: 16,
      color: colors.contentPrimary,
    },
    placeSubtitle: {
      fontSize: 13,
      color: colors.contentPrimary,
    },
    contentContainer: {
      flexGrow: 1,
      gap: 10,
    },
    bustimings: {
      marginBottom: 8,
      marginTop: 16,
    },
    timeSlotContainer:{
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderWidth:1,
        borderColor: colors.border_4,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        borderRadius: 10,
    },
    timeSlotContainerSelected: {
        borderColor: colors.primary,
    },
    ratingAndButtoncontainer:{
        flexDirection: "row",
        gap: 32,
        marginTop: 20,
        alignItems: 'flex-start'
    },
    btnstyle: {
      flex: 1,
      height: 27,
    },
    textStyle: {
      fontSize: 16,
    },
    fareText: {
      fontSize: 11,
      textAlign: 'center',
    },
    buttonAndFareContainer: {
      gap: 5,
      flex: 1,
    },
    viewAllTimings: {
      fontSize: 16,
      color: colors.primary,
    },
    locationConnectionIcon: {
      width: 16,
      height: 16,
    },
    viewFullRoute: {
      fontSize: 13,
      color: colors.contentPrimary
    },
    sheetBackground: {
      backgroundColor: colors.background_primary,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
    },
    handleIndicator: {
      backgroundColor: colors.border_3,
      width: 40,
    },
    sheetContent: {
      paddingHorizontal: 16,
      paddingTop: 10,
      paddingBottom: 16,
      flex: 1,
    },
    sheetHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 20,
      borderBottomWidth:1
    },
    sheetTitle: {
      fontSize: 18,
      color: colors.contentPrimary,
    },
    closeButton: {
      padding: 6,
    },
    closeIcon: {
      width: 14,
      height: 14,
      tintColor: colors.contentPrimary,
    },
    timingsListContent: {
      paddingTop: 10,
      gap: 10,
      paddingBottom: 6,
    },
    timingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 12,
      paddingHorizontal: 14,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border_4,
      backgroundColor: colors.background_primary,
    },
    timingRowSelected: {
      borderColor: colors.primary,
    },
    timingLeft: {
      flex: 1,
      paddingRight: 10,
      gap: 4,
    },
    timingRange: {
      fontSize: 14,
      color: colors.contentPrimary,
    },
    timingVia: {
      fontSize: 12,
      color: colors.contentPrimary,
    },
    timingRight: {
      flexDirection: 'row',
      gap: 6,
    },
    stopsIcon: {
      width: 13.33,
      height: 16.67,
      tintColor: colors.contentPrimary,
    },
    stopsText: {
      fontSize: 12,
      color: colors.contentPrimary,
    },
    stopImage: {
      width: 150,
      height: 100,
      borderRadius: 10,
      backgroundColor: colors.border_4,
    },
    stopImagePlaceholder: {
      width: 150,
      height: 100,
      borderRadius: 10,
      backgroundColor: 'gray',
    },
  });
