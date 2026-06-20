import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// 🔐 Auth Screens
import SplashScreen from "@screens/Auth/SplashScreen";
import LoginScreen from "@screens/Auth/LoginScreen";

// 🧭 Drawer Navigation (UPDATED)
import DrawerNavigator  from "./DrawerNavigator"; // NEW: Drawer-based main app
// ⚙️ Global Action Screens
import AddDevice from "@screens/Device/AddDevice";
import AddParty from "@screens/Party/AddParty";
import PartyDetails from "@screens/Party/PartyDetail";
import AssignDevice from "@screens/Actions/AssignDevice";
import ActivateDevice from "@screens/Actions/ActivateDevice";
import MarkSold from "@screens/Actions/MarkSold";
import ChangePassword from "@screens/Profile/ChangePassword";
import ProfileInfo from "@screens/Profile/ProfileInfo";
import ActionDevice from "@screens/Actions/ActionDevice";
import BulkActions  from "@screens/Device/BulkActions";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{ headerShown: false }}
    >

      {/* 🔐 AUTH FLOW */}
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />

      {/* 🏠 MAIN APP (NOW DRAWER) */}
      <Stack.Screen name="MainApp" component={DrawerNavigator} />

      {/* ⚙️ GLOBAL ACTIONS */}
      <Stack.Screen name="AddDevice" component={AddDevice} />
      <Stack.Screen name="AddParty" component={AddParty} />
      <Stack.Screen name="PartyDetails" component={PartyDetails} />
      <Stack.Screen name="AssignDevice" component={AssignDevice} />
      <Stack.Screen name="ActivateDevice" component={ActivateDevice} />
      <Stack.Screen name="MarkSold" component={MarkSold} />
      <Stack.Screen name="ActionDevice" component={ActionDevice} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
      <Stack.Screen name="ProfileInfo" component={ProfileInfo} />
      <Stack.Screen name="BulkActions" component={BulkActions} />
    </Stack.Navigator>
  );
}