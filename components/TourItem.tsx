import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { Tour, formatDate, getSeatLabel, formatCurrency } from '../utils/tour';

export interface TourItemProps {
  tour: Tour;
  compact?: boolean;
  onPress: (tour: Tour) => void;
  onToggleFavorite: (id: string, next: boolean) => void;
}

const TourItemComponent = ({
  tour,
  compact = false,
  onPress,
  onToggleFavorite,
}: TourItemProps) => {
  const isRedSeat = tour.seats <= 3;

  return (
    <TouchableOpacity
      style={styles.cardNormal}
      activeOpacity={0.8}
      onPress={() => onPress(tour)}
    >
      <Image source={{ uri: tour.image }} style={styles.imageNormal} />

      <View style={styles.info}>
        <Text style={styles.tourName}>{tour.name}</Text>
        <Text style={styles.cityText}>{tour.city}</Text>
        <Text style={styles.dateDaysText}>
          📅 {formatDate(tour.departure)} · {tour.days} ngày
        </Text>
        <Text style={styles.priceText}>{formatCurrency(tour.price)}</Text>
        <Text style={[styles.seatText, isRedSeat && styles.seatTextRed]}>
          {getSeatLabel(tour.seats)}
        </Text>
      </View>

      <TouchableOpacity
        testID="fav-btn"
        style={styles.heartBtn}
        onPress={(e) => {
          e.stopPropagation();
          onToggleFavorite(tour.id, !tour.isFavorite);
        }}
      >
        <Text style={[styles.heartText, tour.isFavorite && styles.heartActive]}>
          {tour.isFavorite ? '♥' : '♡'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardNormal: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    flexDirection: 'row',
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  imageNormal: { width: 90, height: 90, borderRadius: 6, backgroundColor: '#eee' },
  info: { flex: 1, marginLeft: 12 },
  tourName: { fontSize: 15, fontWeight: 'bold', color: '#222' },
  cityText: { fontSize: 13, color: '#555', marginTop: 2 },
  dateDaysText: { fontSize: 12, color: '#666', marginTop: 2 },
  priceText: { fontSize: 14, fontWeight: 'bold', color: '#e67e22', marginTop: 3 },
  seatText: { fontSize: 12, color: '#27ae60', marginTop: 2, fontWeight: '500' },
  seatTextRed: { color: '#d63031', fontWeight: 'bold' },
  heartBtn: { padding: 8, marginLeft: 6 },
  heartText: { fontSize: 22, color: '#e74c3c' },
  heartActive: { color: '#e74c3c' },
});

export default React.memo(TourItemComponent);