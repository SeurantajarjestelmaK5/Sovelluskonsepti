import { Stack } from "expo-router";

export default function ReportsStack() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="cleaningReport" />
      <Stack.Screen name="sampleReport" />
      <Stack.Screen name="tempReport" />
      <Stack.Screen name="wasteReport" />
      <Stack.Screen name="inventoryReport" />
    </Stack>
  );
}
