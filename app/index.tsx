import CountryCard from "@/components/CountryCard";
import FiltersModal from "@/components/FiltersModal";
import { useTheme } from "@/components/ThemeContext";
import { languages, translations } from "@/constants/translations";
import { Feather, Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { typography } from "@/constants/typography";
import LoadingIndicator from "@/components/LoadingIndicator";

interface Country {
  name: {
    common: string;
    official: string;
    nativeName?: {
      [key: string]: {
        official: string;
        common: string;
      };
    };
  };
  cca3: string;
  continents: string[];
  timezones: string[];
  flags: {
    png: string;
    svg: string;
  };
  capital?: string[];
  population: number;
  region: string;
  languages?: {
    [key: string]: string;
  };
}

const Home = () => {
  const { theme, language, setLanguage } = useTheme();
  const { top } = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState("");
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterVisible, setFilterVisible] = useState(false);
  const [filters, setFilters] = useState<{
    continents: string[];
    timezones: string[];
  }>({
    continents: [],
    timezones: [],
  });
  const [languageVisible, setLanguageVisible] = useState(false);

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("https://restcountries.com/v3.1/all");
      setCountries(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCountries = countries
    .filter((country: Country) => {
      const matchesSearch = country.name.common
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesContinent =
        filters.continents.length === 0 ||
        filters.continents.some((c) => country.continents.includes(c));

      const matchesTimezone =
        filters.timezones.length === 0 ||
        filters.timezones.some((t) =>
          country.timezones.some((tz) => tz.startsWith(t))
        );

      return matchesSearch && matchesContinent && matchesTimezone;
    })
    .sort((a, b) => a.name.common.localeCompare(b.name.common));

  const groupedCountries = filteredCountries.reduce(
    (acc: { [key: string]: Country[] }, country: Country) => {
      const letter = country.name.common[0].toUpperCase();
      if (!acc[letter]) acc[letter] = [];
      acc[letter].push(country);
      return acc;
    },
    {}
  );

  const sections = Object.keys(groupedCountries)
    .sort()
    .map((letter) => ({
      title: letter,
      data: groupedCountries[letter],
    }));

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.background, paddingTop: top },
      ]}
    >
      <View style={[styles.header]}>
        <Image
          source={
            theme.isDark
              ? require("../assets/images/light_logo.png")
              : require("../assets/images/dark_logo.png")
          }
          style={styles.logo}
          resizeMode="contain"
        />
        <TouchableOpacity
          onPress={theme.toggleTheme}
          style={{
            backgroundColor: theme.altBackground,
            padding: 4,
            borderRadius: 100,
          }}
        >
          <Ionicons
            name={theme.isDark ? "moon-outline" : "sunny-outline"}
            size={24}
            color={theme.text}
          />
        </TouchableOpacity>
      </View>

      <View
        style={[
          styles.searchContainer,
          { backgroundColor: theme.altBackground },
        ]}
      >
        <TextInput
          style={[
            styles.searchInput,
            {
              color: theme.text,
              backgroundColor: theme.altBackground,
            },
            typography.searchBar,
          ]}
          placeholder={
            translations.search[language as keyof typeof translations.search]
          }
          placeholderTextColor={theme.text}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Ionicons
          name="search"
          size={20}
          color={theme.text}
          style={styles.searchIcon}
        />
      </View>

      <View style={styles.filterRow}>
        <View style={styles.filterButtons}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setLanguageVisible(true)}
          >
            <Feather name="globe" size={20} color={theme.text} />
            <Text style={[{ color: theme.filterText }, typography.filter]}>
              {languages.find((l) => l.code === language)?.name}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setFilterVisible(true)}
          >
            <Feather name="filter" size={20} color={theme.text} />
            <Text style={[{ color: theme.filterText }, typography.filter]}>
              {
                translations.filters[
                  language as keyof typeof translations.filters
                ]
              }
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {isLoading ? (
        <LoadingIndicator fullscreen />
      ) : (
        <FlatList
          data={sections}
          keyExtractor={(item) => item.title}
          renderItem={({ item }) => (
            <View>
              <Text
                style={[
                  typography.countryCapital,
                  { color: theme.capitalText },
                  { marginBottom: 10 },
                ]}
              >
                {item.title}
              </Text>
              {item.data.map((country) => (
                <CountryCard key={country.cca3} country={country} />
              ))}
            </View>
          )}
        />
      )}

      <FiltersModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        filters={filters}
        setFilters={setFilters}
      />

      <Modal
        visible={languageVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setLanguageVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View
            style={[styles.modalContent, { backgroundColor: theme.background }]}
          >
            <View style={styles.modalHeader}>
              <Text
                style={[{ color: theme.modalText }, typography.headerTitle]}
              >
                Languages
              </Text>
              <TouchableOpacity
                onPress={() => setLanguageVisible(false)}
                style={{
                  backgroundColor: theme.altBackground,
                  padding: 4,
                  borderRadius: 4,
                }}
              >
                <Ionicons name="close" size={18} color={theme.capitalText} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {languages.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={styles.languageItem}
                  onPress={() => {
                    setLanguage(lang.code);
                    setLanguageVisible(false);
                  }}
                >
                  <View style={styles.radioRow}>
                    <Text
                      style={[{ color: theme.modalText }, typography.modalText]}
                    >
                      {lang.fullName}
                    </Text>
                    <View
                      style={[styles.radioOuter, { borderColor: theme.text }]}
                    >
                      {language === lang.code && (
                        <View
                          style={[
                            styles.radioInner,
                            { backgroundColor: theme.text },
                          ]}
                        />
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  searchContainer: {
    position: "relative",
    marginBottom: 16,
    borderRadius: 4,
  },
  searchInput: {
    borderRadius: 4,
    paddingHorizontal: 40,
    paddingVertical: 12,
  },
  searchIcon: {
    position: "absolute",
    left: 12,
    top: "50%",
    transform: [{ translateY: -10 }],
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  filterButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#A9B8D4",
    borderRadius: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  languageItem: {
    paddingVertical: 12,
  },
  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  radioInner: {
    width: 13,
    height: 13,
    borderRadius: 20,
    backgroundColor: "#000",
  },
  logo: {
    height: "100%",
    width: 100,
  },
});

export default Home;
