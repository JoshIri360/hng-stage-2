import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import { ThemeProvider, useTheme } from "@/components/ThemeContext";
import { View } from "react-native";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { theme } = useTheme();
  const [loaded] = useFonts({
    "Axiforma-200": require("../assets/fonts/Axiforma-200.ttf"),
    "Axiforma-300": require("../assets/fonts/Axiforma-300.ttf"),
    "Axiforma-400": require("../assets/fonts/Axiforma-400.ttf"),
    "Axiforma-500": require("../assets/fonts/Axiforma-500.ttf"),
    "Axiforma-700": require("../assets/fonts/Axiforma-700.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <ThemeProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </ThemeProvider>
    </View>
  );
}
