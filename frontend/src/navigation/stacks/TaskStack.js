import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AssignDevice from "@screens/Actions/AssignDevice";
import ActivateDevice from "@screens/Actions/ActivateDevice";
import MarkSold from "@screens/Actions/MarkSold";

const Stack = createNativeStackNavigator();

export default function TaskStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="AssignDevice" component={AssignDevice} />
      <Stack.Screen name="ActivateDevice" component={ActivateDevice} />
      <Stack.Screen name="MarkSold" component={MarkSold} />
    </Stack.Navigator>
  );
}