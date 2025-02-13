import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useTheme } from "@/components/ThemeContext";

interface LoadingIndicatorProps {
  size?: number | "small" | "large";
  fullscreen?: boolean;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ 
  size = "large",
  fullscreen = false 
}) => {
  const { theme } = useTheme();
  
  return (
    <View style={[
      styles.container, 
      fullscreen && styles.fullscreen,
      { backgroundColor: theme.background }
    ]}>
      <ActivityIndicator size={size} color={theme.text} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreen: {
    flex: 1,
  }
});

export default LoadingIndicator; 