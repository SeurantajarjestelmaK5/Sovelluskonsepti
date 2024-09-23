import React from "react";
import { Stack } from "expo-router";
 

export default function RootLayout() {
  return (
    <Stack
    screenOptions={{
      headerShown: false,
    }
    }
    >
      <Stack.Screen name="(monitoring)"/>
      <Stack.Screen name="(inventory)"/>
      <Stack.Screen name="(settings)"/>
      <Stack.Screen name="(reports)"/>
    </Stack>
  );
}
