# 🌍 Country Explorer Pro+

[![React Native](https://img.shields.io/badge/React_Native-0.73-blue?logo=react)](https://reactnative.dev/)
[![Country API](https://img.shields.io/badge/REST_Countries-v3.1-green)](https://restcountries.com)
[![Google Maps](https://img.shields.io/badge/Google_Maps-Static_API-red)](https://developers.google.com/maps)
[![i18n Ready](https://img.shields.io/badge/i18n-5_Languages-orange)]()

**Advanced country exploration app with dynamic maps, multilingual support, and intelligent data visualization**

https://github.com/user-attachments/assets/df7b0b5f-79d1-4302-9540-ffa1f44e8370

## 🚀 Supercharged Features

### 🌟 Core Innovations
1. **Smart Map Integration**  
   Dynamic Google Static Maps with area-based zoom calculation:
   ```typescript
   function calculateZoom(area: number): number {
     const zoom = 14 - Math.log2(area) / 2;
     return Math.min(Math.max(Math.round(zoom), 4), 12);
   }
   ```
   - Auto-centers on country coordinates
   - Adaptive zoom based on geographical size
   - Hybrid image carousel (flags + maps)

2. **Polyglot Interface**  
   - 5 language support (extendable via `translations.ts`)
   - Context API-powered language management
   - RTL text support ready

3. **Advanced Filtering**  
   ```typescript
   // Complex filter logic in Home component
   const filteredCountries = countries.filter((country) => {
     const matchesSearch = /* fuzzy match */;
     const matchesContinent = /* multi-select */;
     const matchesTimezone = /* partial match */;
     return matchesSearch && matchesContinent && matchesTimezone;
   });
   ```
   - Continent/timezone multi-filters
   - Search with partial matching
   - Alphabetical section lists

4. **Theme Engine**  
   - Deep theming with StyleSheet composition
   - Persisted theme preferences
   - Dynamic icon switching (sun/moon)

## 🧠 Architecture Highlights

### Component Structure
```
src/
├── components/
│   ├── CountryCard.tsx       # List item component
│   ├── FiltersModal.tsx      # Advanced filter UI
│   └── ImageCarousel.tsx     # Smart media display
├── constants/
│   ├── translations.ts       # i18n dictionary
│   └── typography.ts         # Type scaling system
├── context/
│   └── ThemeContext.tsx      # Theme/Language provider
```

## 🛠️ Setup & Configuration

### 1. API Keys Setup
Create `.env` file with:
```env
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_key
# No CountryAPI key needed - using public REST Countries
```

### 2. Google Maps Activation
1. Enable **Static Maps API** in [Google Cloud Console](https://console.cloud.google.com)
2. Restrict API key to:
   - APIs: Static Maps API

### 3. Run with Hot Reload
```bash
npx expo start --clear
# Scan QR with Expo Go app
```

## 📸 App Preview
| Light Mode | Dark Mode | Map View |
|------------|-----------|----------|
| ![Light](https://github.com/user-attachments/assets/34b199dd-5543-4e62-8610-e264f8341ec1) | ![Dark](https://github.com/user-attachments/assets/f8a83ee6-d0bb-4f49-a600-93442e91ef4f) | ![Map](https://github.com/user-attachments/assets/1bdd7ed9-5176-4bfa-b98d-56c7fcf90ce4) |


## 📸 UI Deep Dive

### Home Screen Innovations
| Feature | Implementation |
|---------|----------------|
| **Search** | Debounced query with i18n placeholder |
| **Filters** | Compound modal with multi-select |
| **List** | SectionList with letter headers |
| **Theming** | Dynamic StyleSheet composition |

### Detail Screen Breakthroughs
```tsx
// CountryDetail.tsx - Data Grid
const detailItems = [
  { key: 'population', value: format(population) },
  { key: 'drivingSide', value: car.side },
  // 10+ other metrics
];

// Organized in 3 responsive columns
<View style={styles.detailsGrid}>
  {columns.map(column => (
    <DetailColumn items={column} />
  ))}
</View>
```

## 🚨 Expert Troubleshooting

### Common Issues
**Map Not Loading?**
1. Verify Google Static Maps API enabled
2. Check coordinate existence:
   ```ts
   country.latlng?.length === 2 // → must be [lat, lng]
   ```
3. Test API key in browser:
   ```
   https://maps.googleapis.com/maps/api/staticmap?center=51.5,-0.1&zoom=6&size=400x400&key=YOUR_KEY
   ```

**Filter Performance?**
```ts
// Optimized filter chain
const filteredCountries = countries
  .filter(/* conditions */)
  .sort(/* alphabetical */)
  .reduce(/* section grouping */);
```

## 📜 License & Attribution

- **Maps Data**: © Google LLC
- **Country Data**: REST Countries
- **Icons**: Expo Vector Icons

MIT Licensed - See [LICENSE](LICENSE) for details.
