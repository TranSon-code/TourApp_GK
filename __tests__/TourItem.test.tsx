import React from 'react';
import { describe, test, expect, jest } from '@jest/globals';
import { render, fireEvent } from '@testing-library/react-native';
import TourItem from '../components/TourItem';
import { Tour } from '../utils/tour';

const sampleTour: Tour = {
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
    const { queryByText, rerender } = render(
      <TourItem
        tour={sampleTour}
        compact={true}
        onPress={jest.fn()}
        onToggleFavorite={jest.fn()}
      />
    );
    expect(queryByText('Hà Nội')).toBeNull();

    rerender(
      <TourItem
        tour={sampleTour}
        compact={false}
        onPress={jest.fn()}
        onToggleFavorite={jest.fn()}
      />
    );
    expect(queryByText('Hà Nội')).not.toBeNull();
  });

  // [CÂU 7d]: Test sự kiện click tim và click thẻ
  test('Nhấn fav-btn gọi onToggleFavorite đúng 1 lần và không gọi onPress; nhấn tên gọi onPress', () => {
    const mockOnPress = jest.fn();
    const mockOnToggleFavorite = jest.fn();

    const { getByTestId, getByText } = render(
      <TourItem
        tour={sampleTour}
        compact={false}
        onPress={mockOnPress}
        onToggleFavorite={mockOnToggleFavorite}
      />
    );

    fireEvent.press(getByTestId('fav-btn'));
    expect(mockOnToggleFavorite).toHaveBeenCalledTimes(1);
    expect(mockOnToggleFavorite).toHaveBeenCalledWith('10', true);
    expect(mockOnPress).not.toHaveBeenCalled();

    fireEvent.press(getByText('Tour Hà Nội Phố'));
    expect(mockOnPress).toHaveBeenCalledWith(sampleTour);
  });
});