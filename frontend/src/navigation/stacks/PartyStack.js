import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import PartyList from "@screens/Party/PartyList";
import AddParty from "@screens/Party/AddParty";
import EditParty from "@screens/Party/EditParty";
const Stack = createNativeStackNavigator();

export default function PartyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="PartyList" component={PartyList} />
      <Stack.Screen name="EditParty" component={EditParty}/>
     <Stack.Screen
  name="AddParty"
  component={AddParty}
  options={{
    headerShown: false,
    tabBarStyle: { display: "none" } // ❌ this alone won't work
  }}
/>
    </Stack.Navigator>
  );
}