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
    flex:1,
    flexWrap: 'nowrap'
    },
    fromToContainer: {
      flexDirection: 'row',
      gap: 14,
      flex:1,
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
      maxHeight: 255,
      alignItems: 'center',
    },
    devider: {
      // height: 59,
      flex:1,
      borderRightWidth: 1,
      borderStyle: 'dashed',
    },
    placeContainer:{
        gap: 15,
        flex:1,
    },
    place:{
        flex:1,
    },
    walkAndTimeContainer:{
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
    },
    walkIcon:{
        width: 7.04,
        height: 12
    },
    downArrow:{
        width: 9,
        height: 5,
        marginTop: 5
    },
    placeTitle:{
        fontSize: 16,
        color: colors.contentPrimary
    },
    placeSubtitle:{
        fontSize: 13,
        color: colors.contentPrimary
    },
    contentContainer:{
        flexGrow:1,
        gap: 10
    },
    bustimings:{
        marginBottom: 8,
        marginTop: 16
    },
    timeSlotContainer:{
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderWidth:1,
        borderColor: colors.primary,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        borderRadius: 10,
    },
    ratingAndButtoncontainer:{
        flexDirection: "row",
        gap: 32,
        marginTop: 20,
        alignItems: 'flex-start'
    },
    btnstyle:{
       flex:1,
        height: 27
    },
    textStyle:{
        fontSize: 16
    },
    fareText:{
        fontSize: 11,
        textAlign: "center"
    },
    buttonAndFareContainer:{
        gap: 5,
        flex:1
    },
    viewAllTimings:{
        fontSize: 16,
        color: colors.primary
    },
    locationConnectionIcon:{
      width: 16,
      height: 16
    },
    viewFullRoute:{
      fontSize: 13,
      color: colors.contentPrimary
    }
  });
