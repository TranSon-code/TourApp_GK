export interface Tour {
  id: string;
  name: string;
  city: string;
  days: number;
  price: number;
  seats: number;
  departure: string;
  image: string;
  isFavorite: boolean;
}

export interface CityGroup {
  title: string;
  data: Tour[];
}

export const groupByCity = (tours: Tour[]): CityGroup[] => {
  const groups: { [key: string]: Tour[] } = {};
  tours.forEach((t) => {
    const city = t.city.trim();
    if (!groups[city]) groups[city] = [];
    groups[city].push(t);
  });

  return Object.keys(groups)
    .sort((a, b) => a.localeCompare(b))
    .map((city) => ({
      title: city,
      data: groups[city].sort(
        (a, b) => new Date(a.departure).getTime() - new Date(b.departure).getTime()
      ),
    }));
};

export const formatDate = (dateStr: string): string => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : dateStr;
};

export const getSeatLabel = (seats: number): string => {
  if (seats <= 0) return 'Hết chỗ';
  if (seats <= 3) return `Chỉ còn ${seats} chỗ`;
  return `Còn ${seats} chỗ`;
};

export const formatCurrency = (amount: number): string => {
  return Number(amount).toLocaleString('vi-VN') + ' ₫';
};