import { Tabs, useRouter } from "expo-router";
import { useColorScheme } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";



export default function TabsLayout() {
  const router = useRouter();
  const colorScheme = useColorScheme(); 

  return (
    <Tabs
      screenOptions={{
        headerRight: () => (
          <MaterialCommunityIcons
            name="cog"
            size={40}
            style={{ marginRight: 20 }}
            color={colorScheme === 'light' ? Colors.light.tint : Colors.dark.tint}
            onPress={() => router.push("/(settings)")}
          />
        ),
        tabBarStyle: { height: 80 },
        tabBarLabelStyle: { fontSize: 23, fontWeight: "bold" },
        tabBarActiveTintColor: Colors.dark.tabIconSelected,
        tabBarInactiveTintColor: Colors.dark.tabIconDefault,
        tabBarActiveBackgroundColor: Colors.nav.navSelected,
        tabBarInactiveBackgroundColor: Colors.nav.navDefault
      }}
    >
      <Tabs.Screen
        name="(monitoring)"
        options={{
          title: "Omavalvonta",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={35} />
          ),
        }}
      />
      <Tabs.Screen
        name="(inventory)"
        options={{
          title: "Inventaario",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="clipboard-list"
              color={color}
              size={35}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="(reports)"
        options={{
          title: "Raportit",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="chart-bar" color={color} size={35} />
          ),
        }}
      />
      <Tabs.Screen
        name="(settings)/index"
        options={{
          title: "Asetukset",
          href: null,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="chart-bar" color={color} size={35} />
          ),
        }}
      />
    </Tabs>
  );
}
