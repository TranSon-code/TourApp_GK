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
      style={[styles.card, compact ? styles.cardCompact : styles.cardNormal]}
      activeOpacity={0.8}
      onPress={() => onPress(tour)}
    >
      <View style={compact ? styles.imageWrapperCompact : null}>
        <Image
          source={{ uri: tour.image }}
          style={compact ? styles.imageCompact : styles.imageNormal}
        />
        {compact && (
          <TouchableOpacity
            testID="fav-btn"
            style={styles.heartBtnCompact}
            onPress={(e) => {
              e.stopPropagation();
              onToggleFavorite(tour.id, !tour.isFavorite);
            }}
          >
            <Text style={styles.heartText}>{tour.isFavorite ? '♥' : '♡'}</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={[styles.info, compact && styles.infoCompact]}>
        <Text
          style={styles.tourName}
          numberOfLines={compact ? 1 : 2}
          ellipsizeMode="tail"
        >
          {tour.name}
        </Text>

        {!compact && (
          <>
            <Text style={styles.cityText}>{tour.city}</Text>
            <Text style={styles.dateDaysText}>
              📅 {formatDate(tour.departure)} · {tour.days} ngày
            </Text>
            <Text style={styles.priceText}>{formatCurrency(tour.price)}</Text>
            <Text style={[styles.seatText, isRedSeat && styles.seatTextRed]}>
              {getSeatLabel(tour.seats)}
            </Text>
          </>
        )}

        {compact && (
          <Text style={styles.priceTextCompact}>{formatCurrency(tour.price)}</Text>
        )}
      </View>

      {!compact && (
        <TouchableOpacity
          testID="fav-btn"
          style={styles.heartBtnNormal}
          onPress={(e) => {
            e.stopPropagation();
            onToggleFavorite(tour.id, !tour.isFavorite);
          }}
        >
          <Text style={[styles.heartText, tour.isFavorite && styles.heartActive]}>
            {tour.isFavorite ? '♥' : '♡'}
          </Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#e8e8e8' },
  cardNormal: { flexDirection: 'row', padding: 10, marginBottom: 10, alignItems: 'center' },
  cardCompact: { width: 160, flexDirection: 'column', overflow: 'hidden' },
  imageNormal: { width: 90, height: 90, borderRadius: 6, backgroundColor: '#eee' },
  imageWrapperCompact: { width: '100%', position: 'relative' },
  imageCompact: { width: '100%', aspectRatio: 4 / 3, backgroundColor: '#eee' },
  heartBtnCompact: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 14,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartBtnNormal: { padding: 8, marginLeft: 6 },
  heartText: { fontSize: 22, color: '#e74c3c' },
  heartActive: { color: '#e74c3c' },
  info: { flex: 1, marginLeft: 12 },
  infoCompact: { marginLeft: 0, padding: 8 },
  tourName: { fontSize: 15, fontWeight: 'bold', color: '#222' },
  cityText: { fontSize: 13, color: '#555', marginTop: 2 },
  dateDaysText: { fontSize: 12, color: '#666', marginTop: 2 },
  priceText: { fontSize: 14, fontWeight: 'bold', color: '#e67e22', marginTop: 3 },
  priceTextCompact: { fontSize: 13, fontWeight: 'bold', color: '#e67e22', marginTop: 3 },
  seatText: { fontSize: 12, color: '#27ae60', marginTop: 2, fontWeight: '500' },
  seatTextRed: { color: '#d63031', fontWeight: 'bold' },
});

export default React.memo(TourItemComponent);