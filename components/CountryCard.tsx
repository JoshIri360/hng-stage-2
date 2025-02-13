import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useTheme } from "@/components/ThemeContext";
import { Link } from "expo-router";
import { typography } from "@/constants/typography";

interface Country {
  cca3: string;
  name: {
    common: string;
  };
  capital?: string[];
  flags: {
    png: string;
    svg: string;
  };
}

interface CountryCardProps {
  country: Country;
}

const CountryCard: React.FC<CountryCardProps> = ({ country }) => {
  const { theme } = useTheme();
  const flagUrl = country.flags?.png || country.flags?.svg;
  const capitalText = country.capital ? country.capital.join(", ") : "N/A";

  return (
    <Link
      href={`/${country.cca3}`}
      asChild
      style={[styles.card, { flex: 1, flexDirection: "row", marginBottom: 10 }]}
    >
      <TouchableOpacity>
        <Image source={{ uri: flagUrl }} style={styles.flag} />
        <View style={styles.info}>
          <Text
            style={[{ color: theme.countryNameText }, typography.countryName]}
          >
            {country.name.common}
          </Text>
          <Text
            style={[{ color: theme.capitalText }, typography.countryCapital]}
          >
            {capitalText}
          </Text>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 14,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  flag: {
    width: 40,
    height: 40,
    marginRight: 16,
    borderRadius: 4,
  },
  info: {
    flex: 1,
  },
});

export default CountryCard;
