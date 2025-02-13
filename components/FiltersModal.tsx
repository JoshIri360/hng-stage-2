import { useTheme } from "@/components/ThemeContext";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { typography } from "@/constants/typography";

const FiltersModal = ({
  visible,
  onClose,
  filters,
  setFilters,
}: {
  visible: boolean;
  onClose: () => void;
  filters: {
    continents: string[];
    timezones: string[];
  };
  setFilters: (filters: { continents: string[]; timezones: string[] }) => void;
}) => {
  const { theme } = useTheme();
  const [continentsExpanded, setContinentsExpanded] = useState(false);
  const [timezonesExpanded, setTimezonesExpanded] = useState(false);

  const continents = ["Africa", "Americas", "Asia", "Europe", "Oceania"];

  const timezones = [
    "UTC-12",
    "UTC-8",
    "UTC-4",
    "UTC+0",
    "UTC+4",
    "UTC+8",
    "UTC+12",
  ];

  const utcToGmt = (utc: string) => {
    return utc.replace("UTC", "GMT");
  };

  const gmtToUtc = (gmt: string) => {
    return gmt.replace("GMT", "UTC");
  };

  const toggleContinent = (continent: string) => {
    setFilters({
      ...filters,
      continents: filters.continents.includes(continent)
        ? filters.continents.filter((c) => c !== continent)
        : [...filters.continents, continent],
    });
  };

  const toggleTimezone = (timezone: string) => {
    setFilters({
      ...filters,
      timezones: filters.timezones.includes(timezone)
        ? filters.timezones.filter((t) => t !== timezone)
        : [...filters.timezones, timezone],
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View
          style={[styles.modalContent, { backgroundColor: theme.background }]}
        >
          <View style={styles.modalHeader}>
            <Text style={[{ color: theme.modalText }, typography.modalText]}>
              Filters
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={theme.text} />
            </TouchableOpacity>
          </View>

          {/* Continent Filter */}
          <View style={styles.filterSection}>
            <TouchableOpacity
              style={[styles.sectionHeader, {
                marginBottom: continentsExpanded ? 10 : 0
              }]}
              onPress={() => setContinentsExpanded(!continentsExpanded)}
            >
              <Text
                style={[
                  { color: theme.expandedSectionText },
                  typography.expandedSection,
                ]}
              >
                Continent
              </Text>
              <Entypo
                name={continentsExpanded ? "chevron-up" : "chevron-down"}
                size={24}
                color={theme.text}
              />
            </TouchableOpacity>
            {continentsExpanded &&
              continents.map((continent) => (
                <TouchableOpacity
                  key={continent}
                  style={styles.checkboxRow}
                  onPress={() => toggleContinent(continent)}
                >
                  <Text
                    style={[
                        { color: theme.filterOptionText },
                        typography.filterOption,
                    ]}
                  >
                    {continent}
                  </Text>
                    <Ionicons
                      name={
                        filters.continents.includes(continent)
                          ? "checkbox"
                          : "square-outline"
                      }
                      size={24}
                      color={theme.text}
                    />
                </TouchableOpacity>
              ))}
          </View>

          {/* Timezone Filter */}
          <View style={styles.filterSection}>
            <TouchableOpacity
              style={[styles.sectionHeader, {
                marginBottom: timezonesExpanded ? 10 : 0
              }]}
              onPress={() => setTimezonesExpanded(!timezonesExpanded)}
            >
              <Text
                style={[
                  { color: theme.expandedSectionText },
                  typography.expandedSection,
                ]}
              >
                Timezone
              </Text>
              <Entypo
                name={timezonesExpanded ? "chevron-up" : "chevron-down"}
                size={24}
                color={theme.text}
              />
            </TouchableOpacity>
            {timezonesExpanded &&
              timezones.map((timezone) => (
                <TouchableOpacity
                  key={timezone}
                  style={styles.checkboxRow}
                  onPress={() => toggleTimezone(timezone)}
                >
                  <Text
                    style={[
                        { color: theme.filterOptionText },
                        typography.filterOption,
                    ]}
                  >
                    {utcToGmt(timezone)}
                  </Text>
                    <Ionicons
                      name={
                        filters.timezones.includes(timezone)
                          ? "checkbox"
                          : "square-outline"
                      }
                      size={24}
                      color={theme.text}
                    />
                </TouchableOpacity>
              ))}
          </View>

          {(continentsExpanded || timezonesExpanded) && (
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, { borderWidth: 1, borderColor: theme.text, flex: 1 }]}
                onPress={() => setFilters({ continents: [], timezones: [] })}
              >
                <Text style={[{ color: theme.text }, typography.countryName]}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: "#FF6C00", flex: 3 }]}
                onPress={onClose}
              >
                <Text style={[{ color: "white" }, typography.countryName]}>Show Results</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  filterSection: {
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 40,
    marginTop: "auto",
    marginBottom: 10,
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 12,
    marginTop: 4,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default FiltersModal;
