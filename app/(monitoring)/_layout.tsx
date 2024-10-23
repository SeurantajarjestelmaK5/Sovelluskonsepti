import { Stack } from "expo-router";

export default function MonitoringStack() {
  return (
    <Stack>
      <Stack.Screen name="index"/>
      <Stack.Screen name="cleaning"/>
      <Stack.Screen name="samples"/>
      <Stack.Screen name="temperatures"/>
      <Stack.Screen name="waste"/>
    </Stack>
  );
}
