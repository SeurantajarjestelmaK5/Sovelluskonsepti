import { Stack } from "expo-router";

export default function InventoryStack() {
  return (
    <Stack>
      <Stack.Screen name="index"/>
      <Stack.Screen name="inventory"/>
    </Stack>
  );
}
