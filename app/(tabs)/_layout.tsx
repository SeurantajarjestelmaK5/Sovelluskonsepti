import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs>
      {/* Inventory Tab - Stack inside */}
      <Tabs.Screen name="(inventory)" options={{ title: "Inventory" }} />

      {/* Monitoring Tab - Stack inside */}
      <Tabs.Screen name="(monitoring)" options={{ title: "Monitoring" }} />

      {/* Reports Tab - Stack inside */}
      <Tabs.Screen name="(reports)" options={{ title: "Reports" }} />
    </Tabs>
  );
}
