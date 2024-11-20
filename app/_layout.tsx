import { Tabs, useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useThemeColors } from "@/constants/ThemeColors";

export default function TabsLayout() {
  const router = useRouter();
  const ThemeColors = useThemeColors();

  return (
    <Tabs
      screenOptions={{
        headerRight: () => (
          <MaterialCommunityIcons
            name="cog"
            size={40}
            style={{ marginRight: 20 }}
            color={ThemeColors.tint}
            onPress={() => router.push("/(settings)")}
          />
        ),
        headerLeft: () => (
          <MaterialCommunityIcons
            name="menu"
            size={40}
            style={{ marginLeft: 20 }}
            color={ThemeColors.tint}
            onPress={() => router.push("/(menu)")}
          />
        ),
        tabBarStyle: { height: 80, backgroundColor: ThemeColors.background },
        tabBarLabelStyle: { fontSize: 23, fontWeight: "bold" },
        tabBarActiveTintColor: ThemeColors.tabIconSelected,
        tabBarInactiveTintColor: ThemeColors.tabIconDefault,
        tabBarActiveBackgroundColor: ThemeColors.navSelected,
        tabBarInactiveBackgroundColor: ThemeColors.navDefault,
        tabBarIconStyle: { marginBottom: 10, color: ThemeColors.icon },
        headerStyle: { backgroundColor: ThemeColors.background },
        headerTintColor: ThemeColors.tint,

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
