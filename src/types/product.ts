export interface ProductServer {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  price: number;
}

export interface ProductView {
  id: string;
  title: string;
  image: string;
  price: string;
}
