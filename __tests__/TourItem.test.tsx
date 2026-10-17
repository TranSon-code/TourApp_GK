import React from 'react';
import { describe, test, expect, jest } from '@jest/globals';
import { render, fireEvent, screen } from '@testing-library/react-native';
import TourItem from '../components/TourItem';

const sampleTour = {
  id: '10',
  name: 'Tour Hà Nội Phố',
  city: 'Hà Nội',
  days: 2,
  price: 1500000,
  seats: 5,
  departure: '2026-12-01',
  image: 'https://example.com/hanoi.jpg',
  isFavorite: false,
};

describe('Test TourItem Component', () => {
  // [CÂU 7c]: Test bố cục compact
  test('Bố cục compact ẩn thành phố, không compact thì hiển thị', () => {
    const view: any = render(
      <TourItem
        tour={sampleTour}
        compact={true}
        onPress={() => {}}
        onToggleFavorite={() => {}}
      />
    );
    expect(screen.queryByText('Hà Nội')).toBeNull();

    view.rerender(
      <TourItem
        tour={sampleTour}
        compact={false}
        onPress={() => {}}
        onToggleFavorite={() => {}}
      />
    );
    expect(screen.queryByText('Hà Nội')).not.toBeNull();
  });

  // [CÂU 7d]: Test sự kiện click tim và click thẻ
  test('Nhấn fav-btn gọi onToggleFavorite đúng 1 lần và không gọi onPress', () => {
    const mockOnPress = jest.fn();
    const mockOnToggleFavorite = jest.fn();

    render(
      <TourItem
        tour={sampleTour}
        compact={false}
        onPress={mockOnPress}
        onToggleFavorite={mockOnToggleFavorite}
      />
    );

    fireEvent.press(screen.getByTestId('fav-btn'));
    expect(mockOnToggleFavorite).toHaveBeenCalledTimes(1);
    expect(mockOnToggleFavorite).toHaveBeenCalledWith('10', true);
    expect(mockOnPress).not.toHaveBeenCalled();

    fireEvent.press(screen.getByText('Tour Hà Nội Phố'));
    expect(mockOnPress).toHaveBeenCalledWith(sampleTour);
  });
});