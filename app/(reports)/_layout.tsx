import { Stack } from "expo-router";

export default function ReportsStack() {
  return (
    <Stack screenOptions={{headerShown: false}}>
      <Stack.Screen name="index"/>
      <Stack.Screen name="cleaningReport" />
      <Stack.Screen name="sampleReport" />
      <Stack.Screen name="tempReport" />
      <Stack.Screen name="wasteReport" />
      <Stack.Screen name="inventoryReport" />
    </Stack>
  );
}
