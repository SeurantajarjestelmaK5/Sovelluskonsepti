import { ThemedText } from "@/components/ThemedText";
import { Text, View, useColorScheme } from "react-native";
import { Button } from "react-native-paper";

export default function SettingsScreen() {
  return (
    <View 
    style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}
    >
      <ThemedText>Settings Screen</ThemedText>
      <Button 
        children="Dark mode"
        onPress={() => console.log('Dark mode')}
      />
    </View>
  );
}
