export interface Product {
  id?: number;
  name: string;
  price: number;
  quantity: number;

  image?: string;

  categoryId?: number;
  categoryName?: string;
}