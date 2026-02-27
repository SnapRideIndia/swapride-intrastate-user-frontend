import React from "react";
import { View, TouchableOpacity, Image, ScrollView } from "react-native";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../theme/ThemeProvider";
import { useStyles } from "./index.styles";
import { SwText as Text } from "../../components/common/SwText/SwText";
import { ImageSource } from "../../constants/images";
import { ScreenNames } from "../constant";
import { useFetchCurrentProfile } from "../../hooks/useProfile";
import { useFocusEffect } from "@react-navigation/native";

const drawerItems = [
  {
    id: 1,
    iconUri: ImageSource.bookmarkOutline,
    title: "Saved places",
    navigateTo: ScreenNames.SAVED_PLACES_SCREEN
  },
  {
    id: 2,
    iconUri: ImageSource.megaPhone,
    title: "Policy",
    navigateTo: ScreenNames.POLICY_SCREEN

  }, {
    id: 3,
    iconUri: ImageSource.suggestYourStops,
    title: "Suggest your stops",
    navigateTo: ScreenNames.SUGGEST_YOUR_STOPS

  }, {
    id: 4,
    iconUri: ImageSource.busOutline,
    title: "Rent a bus",
    navigateTo: ScreenNames.RENT_A_BUS_SCREEN

  },
  {
    id: 5,
    iconUri: ImageSource.settingsOutline,
    title: "Account setting",
    navigateTo: ScreenNames.ACCOUNT_SETTING_SCREEN
  },
]

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const { colors } = useTheme();
  const styles = useStyles(colors);
  const { navigation } = props;
  const { data: profileData, isLoading, isError, error, refetch } = useFetchCurrentProfile();

  const handlePressItem = (navScreen: any) => {
    navigation.navigate(navScreen);
  }

  const handlePressHeader = () => {
    if (!profileData.isOnboarded) {
      navigation.navigate(ScreenNames.SET_PROFILE_SCREEN as never);
    }else{
      navigation.navigate(ScreenNames.VIEW_PROFILE as never);
    }

  }
  
  useFocusEffect(React.useCallback(()=>{
    console.log("This is refteching again ===>")
    refetch();
    console.log("This is profileData after refetch ===>", profileData);
  }, []));

  return (
    <View style={styles.drawerContainer}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* header */}
        <SafeAreaView edges={['top']}>
          <TouchableOpacity style={styles.header} onPress={handlePressHeader}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 24 }}>
              <View style={{ width: 44, height: 44, borderRadius: 50, backgroundColor: "red" }} />
              <View style={{ gap: 5 }}>
                <Text varient="medium" style={styles.name}>{profileData?.fullName}</Text>
                <Text varient="semi-bold" style={styles.number}>{profileData?.mobileNumber}</Text>
              </View>
            </View>
            <TouchableOpacity>
              <Image source={ImageSource.rightTriangleArrow} style={{ width: 7, height: 14.58 }} />
            </TouchableOpacity>
          </TouchableOpacity>

        </SafeAreaView>
        <View style={styles.dropDownItemsContainer}>
          {
            drawerItems.map((item) => (
              <TouchableOpacity key={item.id} style={styles.drawerItem} onPress={() => handlePressItem(item.navigateTo)}>
                <Image source={item.iconUri} style={styles.icon} />
                <Text varient="medium" style={styles.drawerItemTitle}>{item.title}</Text>
              </TouchableOpacity>
            ))
          }
        </View>

        <View style={styles.spacer} />
      </ScrollView>

      <SafeAreaView edges={["bottom"]} style={styles.logoutBtnSafeArea}>
        <View style={styles.logoutBtn}>
          <Text varient="semi-bold" style={styles.logoutTitle}>Logout</Text>
          <Image source={ImageSource.logoutOutline} style={styles.icon} />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default CustomDrawerContent;
