import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";

import TabNavigator from "./TabNavigator"; // your bottom tabs
import Settings from "@screens/Profile/Settings";
import ActivityLogs from "@screens/Dashboard/ActivityLogs";
import Analytics from "@screens/Analytics/Analytics";
import CustomDrawer from "../components/CustomDrawer";

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{ headerShown: false }}
      drawerContent={(props) => <CustomDrawer {...props} />}
    >

      {/* MAIN APP (TABS) */}
      <Drawer.Screen
        name="HomeTabs"
        component={TabNavigator}
        options={{ title: "Dashboard" }}
      />

      {/* DRAWER SCREENS */}
      <Drawer.Screen name="Reports" component={Analytics} />
      <Drawer.Screen name="Settings" component={Settings} />
      <Drawer.Screen name="ActivityLogs" component={ActivityLogs} />

    </Drawer.Navigator>
  );
}