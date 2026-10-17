import { describe, test, expect } from '@jest/globals';
import { groupByCity, formatDate, getSeatLabel } from '../utils/tour';

const mockTours = [
  {
    id: '1',
    name: 'Tour Phú Quốc',
    city: 'Phú Quốc',
    days: 3,
    price: 3000000,
    seats: 2,
    departure: '2026-11-10',
    image: 'https://example.com/pq.jpg',
    isFavorite: false,
  },
  {
    id: '2',
    name: 'Tour Đà Lạt A',
    city: 'Đà Lạt',
    days: 2,
    price: 2000000,
    seats: 0,
    departure: '2026-11-20',
    image: 'https://example.com/dl1.jpg',
    isFavorite: true,
  },
  {
    id: '3',
    name: 'Tour Đà Lạt B',
    city: 'Đà Lạt',
    days: 4,
    price: 4000000,
    seats: 5,
    departure: '2026-11-05',
    image: 'https://example.com/dl2.jpg',
    isFavorite: false,
  },
];

describe('Test Tour Utility Functions', () => {
  // [CÂU 7a]: Test groupByCity
  test('groupByCity nhóm đúng số lượng, thứ tự A -> Z và sắp xếp ngày tăng dần', () => {
    const result = groupByCity(mockTours);

    expect(result.length).toBe(2);
    expect(result[0].title).toBe('Đà Lạt');
    expect(result[1].title).toBe('Phú Quốc');
    expect(result[0].data[0].id).toBe('3');
    expect(result[0].data[1].id).toBe('2');
  });

  // [CÂU 7b]: Test formatDate
  test('formatDate chuyển đổi YYYY-MM-DD thành DD/MM/YYYY', () => {
    expect(formatDate('2026-11-05')).toBe('05/11/2026');
  });

  // [CÂU 7b]: Test getSeatLabel các giá trị biên 0, 3, 4
  test('getSeatLabel trả về đúng nhãn theo số chỗ biên', () => {
    expect(getSeatLabel(0)).toBe('Hết chỗ');
    expect(getSeatLabel(3)).toBe('Chỉ còn 3 chỗ');
    expect(getSeatLabel(4)).toBe('Còn 4 chỗ');
  });
});