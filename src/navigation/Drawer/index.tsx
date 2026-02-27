import React from "react";
import { View } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useTheme } from "../../theme/ThemeProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import TabNavigator from "../Tab";
import CustomDrawerContent from "./CustomDrawerContent";
import { ScreenNames } from "../constant";
import SetYourProfileScreen from "../../screens/profile/SetYourProfileScreen/SetYourProfileScreen";

const Drawer = createDrawerNavigator();

const MainContent = () => (
  <View style={{ flex: 1 }}>
    <TabNavigator />
    <SafeAreaView edges={["bottom"]} style={{ backgroundColor: "transparent" }} />
  </View>
);

const DrawerNavigator = () => {
  const { colors } = useTheme();


  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerType: "front",
        drawerStyle: {
          backgroundColor: colors.background_primary,
          // width: 280,
        },
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name={ScreenNames.MAIN_SCREEN}
        component={MainContent}
        options={{ drawerLabel: () => null, drawerItemStyle: { display: "none" } }}
      />
      <Drawer.Screen
        name={ScreenNames.SET_PROFILE_SCREEN}
        component={SetYourProfileScreen}
        options={{ drawerLabel: () => null, drawerItemStyle: { display: "none" } }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
