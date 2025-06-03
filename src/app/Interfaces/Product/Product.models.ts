export interface Product {
  id: number;
  pictureUrl: string;
  name: string;
  price: number;
  category: string;
  description: string;
  brand: string;
  brandId: number;
  type: string;
  typeId: number;
  isFavourited: boolean;
}

export interface ProductToSend {
  name: string;
  description: string;
  price: number;
  typeId: number;
  brandId: number;
  picture?: File | string | null;  // Made explicitly nullable
}
