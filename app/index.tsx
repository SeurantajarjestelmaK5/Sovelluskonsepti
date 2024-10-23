import { ThemedText } from "@/components/ThemedText";
import { Link } from "expo-router";
import { Text, View } from "react-native";
import { Button } from "react-native-paper";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <View style={{justifyContent: "space-evenly", alignItems: "center" , flex: 0.4}}>
        <Link href="(monitoring)">
          <Button
            children="
        Omavalvonta"
            mode="contained"
          />
        </Link>
        <Link href="(inventory)">
          <Button children="Inventaarioon" mode="contained" />
        </Link>

        <Link href="(settings)">
          <Button children="Asetukset" mode="contained" />
        </Link>

        <Link href="(reports)">
          <Button children="Raportit" mode="contained" />
        </Link>
      </View>
    </View>
  );
}
