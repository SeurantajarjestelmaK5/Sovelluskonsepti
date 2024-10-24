import { Stack } from "expo-router";

export default function InventoryStack() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{headerShown: false}}/>
      <Stack.Screen name="kitchen"/>
      <Stack.Screen name="diningroom"/>
    </Stack>
  );
}
