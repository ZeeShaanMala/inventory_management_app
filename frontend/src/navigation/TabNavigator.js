import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import DashboardStack from "@navigation/stacks/DashboardStack";
import DeviceStack from "@navigation/stacks/DeviceStack";
import PartyStack from "@navigation/stacks/PartyStack";
import ProfileStack from "@navigation/stacks/ProfileStack";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {

  const getTabBarStyle = (route) => {
    const routeName = getFocusedRouteNameFromRoute(route) ?? "";

    const hiddenScreens = [
      "AddParty",
      "AssignDevice",
      "EditDevice",
      "DeviceDetail"
    ];

    if (hiddenScreens.includes(routeName)) {
      return { display: "none" };
    }

    return {
      height: 60,
      paddingBottom: 6
    };
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#2563EB",
        tabBarInactiveTintColor: "#94A3B8",
        tabBarStyle: getTabBarStyle(route)
      })}
    >

      <Tab.Screen
        name="Home"
        component={DashboardStack}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="view-dashboard" size={22} color={color} />
          )
        }}
      />

      <Tab.Screen
        name="Devices"
        component={DeviceStack}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="package-variant" size={22} color={color} />
          )
        }}
      />

      <Tab.Screen
        name="Parties"
        component={PartyStack}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account-group" size={22} color={color} />
          )
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account" size={22} color={color} />
          )
        }}
      />

    </Tab.Navigator>
  );
}