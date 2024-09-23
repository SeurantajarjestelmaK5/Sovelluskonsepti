import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(monitoring)"/>
      <Stack.Screen name="(inventory)"/>
      <Stack.Screen name="(settings)"/>
      <Stack.Screen name="(reports)"/>
    </Stack>
  );
}
