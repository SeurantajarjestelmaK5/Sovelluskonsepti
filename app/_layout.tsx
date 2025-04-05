import { useState, useEffect } from "react";

import { Tabs, useRouter } from "expo-router";
import { View, Text } from "react-native";
import * as Updates from "expo-updates";
import NetInfo from "@react-native-community/netinfo";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useThemeColors } from "@/constants/ThemeColors";
import { getGeneralStyles } from "@/styles/navigations/generalStyles";
import { useNavigationState } from "@react-navigation/native";
import {
  ActivityIndicator,
  Snackbar,
} from "react-native-paper";

export default function TabsLayout() {
  const router = useRouter();
  const ThemeColors = useThemeColors();
  const styles = getGeneralStyles(ThemeColors);
  const navigationState = useNavigationState((state) => state);
  const [isInSettings, setIsInSettings] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

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

        // Show the Snackbar
        setSnackbarVisible(true);

        // Delay the reload to allow the Snackbar to be visible
        setTimeout(async () => {
          await Updates.reloadAsync();
        }, 8000); // Delay for 8 seconds
      }
    } catch (error) {
      console.error("Failed to check for updates:", error);
    }
  };
  checkForUpdates();
}, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected || false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (!isConnected) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: ThemeColors.background,
        }}
      >
        <Text
          style={{ fontSize: 24, color: ThemeColors.text, marginBottom: 20 }}
        >
          Haetaan verkkoyhteyttä...
        </Text>
        <ActivityIndicator size="large" color={ThemeColors.tint} />
      </View>
    );
  }

  return (
    <>
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
          // TÄÄ ON DRAWER-VALIKOLLE MENU JOS HALUU LISÄTÄ
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
          tabBarLabelStyle: { fontSize: 23, fontWeight: "bold", textShadowRadius: 0 },
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
              <MaterialCommunityIcons
                name="chart-bar"
                color={color}
                size={35}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="(settings)/index"
          options={{
            title: "Asetukset",
            href: null,
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="chart-bar"
                color={color}
                size={35}
              />
            ),
          }}
        />
      </Tabs>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        action={{
          label: "OK",
          onPress: () => {
            setSnackbarVisible(false);
          },
        }}
        style={styles.snackbar}
        elevation={1}
      >
        <Text style={styles.snackbarText}>
          Sovellusta päivitetään, odota hetki...
        </Text>
      </Snackbar>
    </>
  );
}
