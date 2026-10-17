import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  SectionList,
  FlatList,
  ActivityIndicator,
  Alert,
  Platform,
  RefreshControl,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import TourItem from './components/TourItem';
import { Tour, CityGroup, groupByCity, formatDate, formatCurrency } from './utils/tour';

const API_URL = 'https://6ac9d2063115bcc95820063e.mockapi.io/tours';

export default function App() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');

  const fetchTours = useCallback(() => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error('Lỗi fetch');
        return res.json();
      })
      .then((data) => {
        setTours(data);
        setLoading(false);
        setRefreshing(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
        setRefreshing(false);
      });
  }, []);

  useEffect(() => {
    fetchTours();
  }, [fetchTours]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTours();
  };

  const handlePressTour = (tour: Tour) => {
    const msg = `Tên: ${tour.name}\nKhởi hành: ${formatDate(tour.departure)}\nThời gian: ${tour.days} ngày\nGiá: ${formatCurrency(tour.price)}`;
    if (Platform.OS === 'web') {
      alert(msg);
    } else {
      Alert.alert('Chi tiết Tour', msg);
    }
  };

  const handleToggleFavorite = async (id: string, nextStatus: boolean) => {
    const previousTours = [...tours];

    setTours((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isFavorite: nextStatus } : item))
    );

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFavorite: nextStatus }),
      });

      if (!res.ok) {
        throw new Error('Cập nhật thất bại');
      }
    } catch (err) {
      setTours(previousTours);
      if (Platform.OS === 'web') {
        alert('Lỗi cập nhật yêu thích! Đã hoàn tác.');
      } else {
        Alert.alert('Lỗi', 'Không thể cập nhật trạng thái yêu thích!');
      }
    }
  };

  const favoriteTours = useMemo(() => {
    return tours.filter((t) => t.isFavorite);
  }, [tours]);

  const sections: CityGroup[] = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();
    const filtered = tours.filter((t) =>
      t.name.toLowerCase().includes(keyword)
    );
    return groupByCity(filtered);
  }, [tours, searchText]);

  const renderListHeader = () => (
    <View style={styles.favSection}>
      <Text style={styles.sectionHeaderTitle}>
        Tour yêu thích ({favoriteTours.length})
      </Text>
      {favoriteTours.length === 0 ? (
        <Text style={styles.emptyFavText}>Chưa có tour yêu thích</Text>
      ) : (
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={favoriteTours}
          keyExtractor={(item) => 'fav_' + item.id}
          ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
          renderItem={({ item }) => (
            <TourItem
              tour={item}
              compact={true}
              onPress={handlePressTour}
              onToggleFavorite={handleToggleFavorite}
            />
          )}
        />
      )}
    </View>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
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

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#0984e3" />
            <Text style={{ marginTop: 8 }}>Đang tải danh sách tour...</Text>
          </View>
        ) : (
          <SectionList
            sections={sections}
            keyExtractor={(item) => item.id}
            stickySectionHeadersEnabled={true}
            ListHeaderComponent={renderListHeader}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Không tìm thấy tour phù hợp</Text>
              </View>
            }
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
                compact={false}
                onPress={handlePressTour}
                onToggleFavorite={handleToggleFavorite}
              />
            )}
            contentContainerStyle={{ padding: 16 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
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
  favSection: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e2e6',
  },
  sectionHeaderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d3436',
    marginBottom: 8,
  },
  emptyFavText: {
    fontSize: 13,
    color: '#95a5a6',
    fontStyle: 'italic',
    paddingVertical: 10,
  },
  citySectionHeader: {
    backgroundColor: '#eaf2f8',
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
  },
  cityHeaderText: { fontSize: 15, fontWeight: 'bold', color: '#0984e3' },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    color: '#7f8c8d',
  },
});