export type CategorySlug =
  | 'all-restaurant'
  | 'nearby'
  | 'discount'
  | 'best-seller'
  | 'delivery'
  | 'lunch';

export interface Coordinates {
  lat: number;
  long: number;
}

export interface Menu {
  id: number;
  foodName: string;
  price: number;
  type: string;
  image: string;
}

export interface ReviewUser {
  id: number;
  name: string;
  avatar: string;
}

export interface Review {
  id: number;
  star: number;
  comment: string;
  createdAt: string;
  user: ReviewUser;
}

export interface Restaurant {
  // ---- fields present in the API response (GET /resto/{id}) ----
  id: number;
  name: string;
  star: number;
  averageRating: number;
  place: string;
  coordinates: Coordinates;
  distance: number;
  logo: string;
  images: string[];
  category: string;
  totalMenus: number;
  totalReviews: number;
  menus?: Menu[];
  reviews?: Review[];

  imageUrl?: string;
  rating?: number;
  location?: string;
  distanceValue?: number;
  price?: number;
  priceRange?: string;
}

export interface FilterParams {
  range?: string;
  priceMin?: string;
  priceMax?: string;
  rating?: string;
  category?: string;
  distance?: string;
  distanceValue?: number;
}
