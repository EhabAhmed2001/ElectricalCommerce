import { Injectable } from '@angular/core';
import { environment } from '../../environments/enviroment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { EMPTY, Observable } from 'rxjs';
import { Product } from '../Interfaces/Product/Product.models';
import { AuthService } from './auth.service';

interface ProductApiResponse {
  data?: Product[];
  count?: number;
  value?: {
    data: Product[];
    count: number;
  };
  items?: Product[];
  totalCount?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiBaseUrl}`;

  constructor(private http: HttpClient,private authService:AuthService) {}


  public getProducts(
    index: number = 1,
    pageSize: number = 9,
    typeId?: number|null,
    brandId?: number|null,

    price?: number|null
  ): Observable<ProductApiResponse> {
    let params = new HttpParams()
      .set('index', index.toString())
      .set('pageSize', pageSize.toString());

    if (typeId) {
      params = params.set('typeId', typeId.toString());
    }

    if (brandId) {
      params = params.set('brandId', brandId.toString());
    }



    if (price) {
      params = params.set('price', price.toString());
    }
      console.log("Params for getProducts:", params.toString());

    return this.http.get<ProductApiResponse>(`${this.apiUrl}/Products`, { params });
  }


  public addProductToWishList(product: Product): void {
    if(!this.authService.IsAuthenticated()){
        return ;
    }
    this.http.post(`${this.apiUrl}/Baskets/favourite`, product).subscribe();
  }


  public removeProductFromWishList(productId: number): void {
    if(!this.authService.IsAuthenticated()){
        return ;
    }
    this.http.delete(`${this.apiUrl}/Baskets/favourite/${productId}`).subscribe();
  }


  public getProductByID(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/Products/${id}`);
  }

  public addToCart(product: Product, quantity: number): Observable<any> {

    if(!this.authService.IsAuthenticated()){
      console.log("not authorize");
      return EMPTY;
    }
    const payload = {
      id: product.id,
      productName: product.name,
      pictureUrl: product.pictureUrl,
      brand: product.brand,
      type: product.type,
      price: product.price,
      quantity: quantity
    };

    return this.http.post(`${environment.apiBaseUrl}/Baskets/basket`, payload);
  }
getProductsByType(typeId: number): Observable<Product[]> {
  let params = new HttpParams()
    .set('typeId', typeId.toString());

  return this.http.get<Product[]>(`${this.apiUrl}/products`, { params });
}
}
