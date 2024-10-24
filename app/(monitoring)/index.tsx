import { Link } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import { Button } from "react-native-paper";



export default function MonitorHome() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Omavalvonnan kotisivu</Text>

      <Link href="/cleaning">
      <Button
        children="Viikkosiivous"
        mode="contained"
      />
      </Link>
      <Link href="/waste">
      <Button
        children="Jätteet"
        mode="contained"
      />
      </Link>
      <Link href="/samples">
      <Button
        children="Näytteenotto"
        mode="contained"
      />
      </Link>
      <Link href="/temperatures">
      <Button
        children="Lämpötilat"
        mode="contained"
      />
      </Link>
      <Link href="../">
      <Button
        children="Back"
        mode="contained"
      />
      </Link>
    </View>
  );
}
