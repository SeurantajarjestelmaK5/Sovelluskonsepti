import { useState, useEffect } from "react";
import { Tabs, useRouter } from "expo-router";
import * as Updates from "expo-updates";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useThemeColors } from "@/constants/ThemeColors";
import { useNavigationState } from "@react-navigation/native";

export default function TabsLayout() {
  const router = useRouter();
  const ThemeColors = useThemeColors();
  const navigationState = useNavigationState((state) => state);
  const [isInSettings, setIsInSettings] = useState(false);

    const handleCogPress = () => {
      if (isInSettings) {
        // Navigate back to the previous screen
        if (navigationState.routes.length > 1) {
          router.back(); // Or use router.pop() for stack-based navigation
        }
        setIsInSettings(false);
      } else {
        // Navigate to the settings screen
        router.push("/(settings)");
        setIsInSettings(true);
      }
    };

useEffect(() => {
  const checkActiveScreen = () => {
    if (
      navigationState &&
      Array.isArray(navigationState.routes) &&
      navigationState.routes[navigationState.index]
    ) {
      if (
        navigationState.routes[navigationState.index].name ===
        "(settings)/index"
      ) {
        setIsInSettings(true);
      } else {
        setIsInSettings(false);
      }
    } else {
      console.warn("Navigation state is invalid:", navigationState);
    }
  };

  checkActiveScreen();
}, [navigationState]);

    useEffect(() => {
      const checkForUpdates = async () => {
        try {
          const update = await Updates.checkForUpdateAsync();
          if (update.isAvailable) {
            await Updates.fetchUpdateAsync();
            // Reload the app to apply the update
            await Updates.reloadAsync();
            alert("Sovellus päivitetty uusimpaan versioon.");
          }
        } catch (error) {
          console.error("Error checking for updates:", error);
        }
      };

      checkForUpdates();
    }, []);

  return (
    <Tabs
      initialRouteName="(monitoring)"
      screenOptions={{
        headerRight: () => (
          <MaterialCommunityIcons
            name="cog"
            size={40}
            style={{ marginRight: 20 }}
            color={ThemeColors.tint}
            onPress={() => handleCogPress()}
          />
        ),
        // headerLeft: () => (
        //   <MaterialCommunityIcons
        //     name="menu"
        //     size={40}
        //     style={{ marginLeft: 20 }}
        //     color={ThemeColors.tint}
        //     onPress={() => router.push("/(menu)")}
        //   />
        // ),
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
        name="(monitoring)"
        options={{
          title: "Omavalvonta",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={35} />
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
