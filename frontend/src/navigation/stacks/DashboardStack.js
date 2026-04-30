import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Analytics from "@screens/Analytics/Analytics";
import Dashboard from "@screens/Dashboard/Dashboard";

const Stack = createNativeStackNavigator();

export default function DashboardStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Dashboard" component={Dashboard} />

<Stack.Screen
  name="Analytics"
  component={Analytics}
/>
    </Stack.Navigator>
  );
}