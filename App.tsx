import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  SectionList,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import TourItem from './components/TourItem';
import { Tour, CityGroup, groupByCity, formatDate, formatCurrency } from './utils/tour';

const API_URL = 'https://6ac8befffd7c536b1bd9b9d0.mockapi.io/tours';

export default function App() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        setTours(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // [CÂU 3d]: Nhấn thẻ mở Alert
  const handlePressTour = (tour: Tour) => {
    const msg = `Tên: ${tour.name}\nKhởi hành: ${formatDate(tour.departure)}\nThời gian: ${tour.days} ngày\nGiá: ${formatCurrency(tour.price)}`;
    if (Platform.OS === 'web') {
      alert(msg);
    } else {
      Alert.alert('Chi tiết Tour', msg);
    }
  };

  // [CÂU 3d]: Nút tim riêng
  const handleToggleFavorite = (id: string, next: boolean) => {
    console.log('Toggle favorite:', id, next);
  };

  const sections: CityGroup[] = groupByCity(tours);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* [CÂU 1c]: Header */}
        <View style={styles.header}>
          <Text style={styles.appTitle}>Tour Việt</Text>
          <Text style={styles.studentInfo}>23651831 – Trần Nam Sơn</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm tour theo tên..."
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        {/* [CÂU 2c]: Loading Indicator */}
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#0984e3" />
            <Text style={{ marginTop: 8 }}>Đang tải danh sách tour...</Text>
          </View>
        ) : (
          /* [CÂU 2b & 3d]: SectionList render qua TourItem */
          <SectionList
            sections={sections}
            keyExtractor={(item) => item.id}
            stickySectionHeadersEnabled={true}
            renderSectionHeader={({ section: { title, data } }) => (
              <View style={styles.citySectionHeader}>
                <Text style={styles.cityHeaderText}>
                  {title} · {data.length} tour
                </Text>
              </View>
            )}
            renderItem={({ item }) => (
              <TourItem
                tour={item}
                onPress={handlePressTour}
                onToggleFavorite={handleToggleFavorite}
              />
            )}
            contentContainerStyle={{ padding: 16 }}
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f6fa' },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e2e6',
  },
  appTitle: { fontSize: 22, fontWeight: 'bold', color: '#2d3436' },
  studentInfo: { fontSize: 13, color: '#636e72', marginTop: 2, marginBottom: 10 },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#dfe6e9',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f8f9fa',
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  citySectionHeader: {
    backgroundColor: '#eaf2f8',
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
  },
  cityHeaderText: { fontSize: 15, fontWeight: 'bold', color: '#0984e3' },
});