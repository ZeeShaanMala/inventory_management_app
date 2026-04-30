import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Profile from "@screens/Profile/ProfileScreen";

const Stack = createNativeStackNavigator();

export default function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ProfileScreen" component={Profile} />
    </Stack.Navigator>
  );
}