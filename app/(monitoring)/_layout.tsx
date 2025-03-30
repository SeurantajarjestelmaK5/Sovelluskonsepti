import { Stack } from "expo-router";

export default function MonitoringStack() {
  return (
    <Stack screenOptions={{headerShown: false}}>
      <Stack.Screen name="index"/>
      <Stack.Screen name="cleaning"/>
      <Stack.Screen name="samples"/>
      <Stack.Screen name="temperatures_fixed"/>
      <Stack.Screen name="waste"/>
    </Stack>
  );
}
