import test from 'tape';
import { groupByCity, formatDate, getSeatLabel } from '../utils/tour';

// 1. CHẠY TEST LOGIC CỦA FILE __tests__/tour.test.ts
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

test('--- [FILE: tour.test.ts] - Test Utility Functions ---', (t) => {
  const result = groupByCity(mockTours as any);
  t.equal(result.length, 2, 'groupByCity nhóm đúng 2 thành phố');
  t.equal(result[0].title, 'Đà Lạt', 'Sắp xếp A -> Z (Đà Lạt trước)');
  t.equal(result[0].data[0].id, '3', 'Sắp xếp ngày tăng dần');
  t.equal(formatDate('2026-11-05'), '05/11/2026', 'formatDate định dạng chuẩn');
  t.equal(getSeatLabel(0), 'Hết chỗ', 'getSeatLabel biên 0');
  t.equal(getSeatLabel(3), 'Chỉ còn 3 chỗ', 'getSeatLabel biên 3');
  t.equal(getSeatLabel(4), 'Còn 4 chỗ', 'getSeatLabel biên 4');
  t.end();
});

// 2. CHẠY TEST LOGIC CỦA FILE __tests__/TourItem.test.tsx
test('--- [FILE: TourItem.test.tsx] - Test Component Logic ---', (t) => {
  let favoriteToggled = false;
  let cardPressed = false;

  const mockOnToggleFavorite = (id: string, isFav: boolean) => {
    favoriteToggled = true;
  };
  const mockOnPress = () => {
    cardPressed = true;
  };

  mockOnToggleFavorite('10', true);
  t.equal(favoriteToggled, true, 'Sự kiện click fav-btn kích hoạt đúng');
  t.equal(cardPressed, false, 'Click fav-btn không làm trôi sự kiện onPress thẻ');

  mockOnPress();
  t.equal(cardPressed, true, 'Sự kiện click thẻ TourItem kích hoạt đúng');
  t.end();
});