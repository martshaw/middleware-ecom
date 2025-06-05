export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image?: string;
  description?: string;
  alt?: string;
  sku?: string;
  source?: string;
} 