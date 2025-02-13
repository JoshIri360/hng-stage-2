import { useTheme } from "@/components/ThemeContext";
import { AntDesign } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CountryDetailKey, translations } from "@/constants/translations";
import { typography } from "@/constants/typography";
import LoadingIndicator from "@/components/LoadingIndicator";

interface Country {
  flags?: {
    png?: string;
    svg?: string;
  };
  coatOfArms?: {
    png?: string;
    svg?: string;
  };
  name?: {
    common?: string;
    official?: string;
    nativeName?: any;
  };
  capital?: string[];
  population?: number;
  continents?: string[];
  region?: string;
  cca3?: string;
  translations?: {
    [key: string]: {
      official?: string;
    };
  };
  area?: number;
  latlng?: number[];
  currencies?: {
    name: string;
    symbol: string;
  }[];
  languages?: {
    [key: string]: string;
  };
  timezones?: string[];
  startOfWeek?: string;
  car?: {
    side: string;
  };
  idd?: {
    root: string;
    suffixes?: string[];
  };
  cca2?: string;
}

interface DetailItemProps {
  label: string;
  value?: string;
}

function calculateZoom(area: number): number {
  if (!area || area <= 0) return 8;
  const zoom = 14 - Math.log2(area) / 2;
  return Math.min(Math.max(Math.round(zoom), 4), 12);
}

const CountryDetail: React.FC = () => {
  const { theme, language } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { top } = useSafeAreaInsets();
  const router = useRouter();
  const [country, setCountry] = useState<Country>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `https://restcountries.com/v3.1/alpha/${id}`
        );
        const data = await response.json();
        setCountry(data[0]);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCountry();
  }, [id]);

  const flagUri = country.flags?.png || country.flags?.svg;
  const coatOfArmsUri = country.coatOfArms?.png || country.coatOfArms?.svg;

  const images: string[] = [];
  if (flagUri) {
    images.push(flagUri);
  }
  if (coatOfArmsUri) {
    images.push(coatOfArmsUri);
  }

  if (country.latlng && country.area && country.latlng.length === 2) {
    const [lat, lng] = country.latlng;
    const zoom = calculateZoom(country.area);
    const mapImageUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=600x300&key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}`;
    images.push(mapImageUrl);
  }

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 21,
        backgroundColor: theme.background,
        paddingTop: top,
      }}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <AntDesign name="arrowleft" size={24} color={theme.text} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={[typography.headerTitle, { color: theme.text }]}>
            {country.name?.common}
          </Text>
        </View>
      </View>

      {isLoading ? (
        <LoadingIndicator fullscreen />
      ) : (
        <ScrollView
          contentContainerStyle={{
            paddingBottom: 20,
            marginTop: 20,
          }}
          style={[styles.container, { backgroundColor: theme.background }]}
          showsVerticalScrollIndicator={false}
        >
          {images.length > 0 ? (
            <ImageCarousel images={images} flagUri={flagUri} />
          ) : null}
          {(() => {
            const detailItems: { key: CountryDetailKey; value?: string }[] = [
              { key: "name", value: country.name?.common },
              {
                key: "population",
                value: country.population?.toLocaleString(),
              },
              { key: "capitalCity", value: country.capital?.[0] },
              { key: "continent", value: country.continents?.join(", ") },
              { key: "countryCode", value: country.cca2 },
              { key: "officialName", value: country.name?.official },
              {
                key: "area",
                value: country.area
                  ? `${country.area.toLocaleString()} km²`
                  : undefined,
              },
              {
                key: "currency",
                value: Object.values(country.currencies || {})
                  .map((curr) => `${curr.name} (${curr.symbol})`)
                  .join(", "),
              },
              { key: "timeZone", value: country.timezones?.[0] },
              {
                key: "languages",
                value: Object.values(country.languages || {}).join(", "),
              },
              {
                key: "diallingCode",
                value: country.idd
                  ? `${country.idd.root}${country.idd.suffixes?.[0]}`
                  : undefined,
              },
              { key: "drivingSide", value: country.car?.side },
            ];

            const column1 = detailItems.slice(0, 4);
            const column2 = detailItems.slice(4, 8);
            const column3 = detailItems.slice(8, 12);

            return (
              <View style={styles.detailsGrid}>
                <View style={styles.detailColumn}>
                  {column1.map((item, idx) => (
                    <DetailItem
                      key={idx}
                      label={
                        translations.countryDetails[item.key][
                          language as keyof typeof translations.explore
                        ]
                      }
                      value={item.value}
                    />
                  ))}
                </View>
                <View style={styles.detailColumn}>
                  {column2.map((item, idx) => (
                    <DetailItem
                      key={idx}
                      label={
                        translations.countryDetails[item.key][
                          language as keyof typeof translations.explore
                        ]
                      }
                      value={item.value}
                    />
                  ))}
                </View>
                <View style={styles.detailColumn}>
                  {column3.map((item, idx) => (
                    <DetailItem
                      key={idx}
                      label={
                        translations.countryDetails[item.key][
                          language as keyof typeof translations.explore
                        ]
                      }
                      value={item.value}
                    />
                  ))}
                </View>
              </View>
            );
          })()}
        </ScrollView>
      )}
    </View>
  );
};

const DetailItem: React.FC<DetailItemProps> = ({ label, value }) => {
  const { theme } = useTheme();
  return (
    <View style={styles.detailItem}>
      <Text
        style={[styles.label, typography.detailLabel, { color: theme.text }]}
      >
        {label}:{" "}
        <Text
          style={[styles.value, typography.detailValue, { color: theme.text }]}
        >
          {value ?? "N/A"}
        </Text>
      </Text>
    </View>
  );
};

interface ImageCarouselProps {
  images: string[];
  flagUri?: string;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, flagUri }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const carouselHeight = containerWidth ? containerWidth * (9 / 16) : 200;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    if (containerWidth > 0) {
      const index = Math.round(offsetX / containerWidth);
      setCurrentIndex(index);
    }
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width);
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      scrollViewRef.current?.scrollTo({
        x: newIndex * containerWidth,
        animated: true,
      });
      setCurrentIndex(newIndex);
    }
  };

  const goToNext = () => {
    if (currentIndex < images.length - 1) {
      const newIndex = currentIndex + 1;
      scrollViewRef.current?.scrollTo({
        x: newIndex * containerWidth,
        animated: true,
      });
      setCurrentIndex(newIndex);
    }
  };

  const { theme } = useTheme();

  return (
    <View
      style={[styles.carouselContainer, { height: carouselHeight }]}
      onLayout={handleLayout}
    >
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        style={[
          styles.carouselScrollView,
          {
            width: containerWidth,
            height: carouselHeight,
            backgroundColor: theme.altBackground,
          },
        ]}
      >
        {images.map((uri, index) => {
          const isFlagImage = uri === flagUri;
          const isMapImage = uri.includes("staticmap");
          const imageResizeMode =
            isFlagImage || isMapImage ? "cover" : "contain";
          const imagePadding = isFlagImage || isMapImage ? 0 : 20;

          return (
            <Image
              key={index}
              source={{ uri }}
              style={[
                {
                  width: containerWidth,
                  height: carouselHeight,
                  padding: imagePadding,
                  borderRadius: 8,
                },
                isFlagImage
                  ? { borderWidth: 1, borderColor: theme.altBackground }
                  : null,
              ]}
              resizeMode={imageResizeMode as any}
            />
          );
        })}
      </ScrollView>

      {images.length > 1 && (
        <>
          <TouchableOpacity
            style={[styles.caretButton, styles.caretLeft]}
            onPress={goToPrev}
            disabled={currentIndex === 0}
          >
            <AntDesign name="left" size={14} color={theme.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.caretButton, styles.caretRight]}
            onPress={goToNext}
            disabled={currentIndex === images.length - 1}
          >
            <AntDesign name="right" size={14} color={theme.text} />
          </TouchableOpacity>

          <View style={styles.indicatorContainer}>
            {images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  {
                    backgroundColor:
                      currentIndex === index ? theme.text : "#999999",
                  },
                ]}
              />
            ))}
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  headerTitleContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  carouselContainer: {
    position: "relative",
    width: "100%",
    marginBottom: 20,
  },
  carouselScrollView: {
    borderRadius: 10,
  },
  carouselImage: {
    borderRadius: 8,
  },
  detailsGrid: {
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 24,
  },
  detailColumn: {
    flex: 1,
    gap: 4,
    width: "100%",
  },
  detailItem: {
    flexDirection: "row",
    gap: 8,
  },
  label: {
    fontWeight: "bold",
  },
  value: {
    flex: 1,
    fontWeight: "normal",
  },
  caretButton: {
    position: "absolute",
    top: "50%",
    transform: [{ translateY: -12 }],
    backgroundColor: "#00000010",
    width: 28,
    height: 28,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  caretLeft: {
    left: 20,
  },
  caretRight: {
    right: 20,
  },
  indicatorContainer: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});

export default CountryDetail;
