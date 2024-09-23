import React from "react";
import { Text, View } from "react-native";
import { Button } from "react-native-paper";

export default function Test() {

    <View>
        <Text>Test</Text>
        <Button
            children="Press me"
            mode="contained"
            onPress={() => {
                console.log("Button pressed");
            }}
        />
    </View>

}