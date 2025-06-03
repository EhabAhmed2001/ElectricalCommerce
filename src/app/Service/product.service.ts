import { Injectable } from '@angular/core';
import { environment } from '../../environments/enviroment';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { EMPTY, Observable } from 'rxjs';
import { Product, ProductToSend } from '../Interfaces/Product/Product.models';
import { AuthService } from './auth.service';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

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

  constructor(private http: HttpClient, private authService: AuthService) {}

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

    if (typeId) params = params.set('typeId', typeId.toString());
    if (brandId) params = params.set('brandId', brandId.toString());
    if (price) params = params.set('price', price.toString());

    return this.http.get<ProductApiResponse>(`${this.apiUrl}/Products`, { params });
  }

  public getProductByID(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/Products/${id}`);
  }

  public addProduct(product: FormData): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/Products/`, product);
  }

updateProduct(id: number, product: FormData): Observable<Product> {
  return this.http.put<Product>(`${this.apiUrl}/Products/${id}`, product).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 400) {
        return throwError(() => ({
          status: 400,
          message: 'Validation failed',
          errors: error.error?.errors || ['Invalid data'],
          shouldRefresh: false
        }));
      }
      if (error.status === 404) {
        return throwError(() => ({
          status: 404,
          message: `Product with ID ${id} was not found`,
          shouldRefresh: true
        }));
      }
      return throwError(() => error);
    })
  );
}

  public deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Products/${id}`);
  }

  public addProductToWishList(product: Product): void {
    if(!this.authService.IsAuthenticated()) return;
    this.http.post(`${this.apiUrl}/Baskets/favourite`, product).subscribe();
  }

  public removeProductFromWishList(productId: number): void {
    if(!this.authService.IsAuthenticated()) return;
    this.http.delete(`${this.apiUrl}/Baskets/favourite/${productId}`).subscribe();
  }

  public addToCart(product: Product, quantity: number): Observable<any> {
    if(!this.authService.IsAuthenticated()) return EMPTY;

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
    return this.http.get<Product[]>(`${this.apiUrl}/products`, {
      params: new HttpParams().set('typeId', typeId.toString())
    });
  }

  public createFormData(product: ProductToSend, imageFile?: File): FormData {
    const formData = new FormData();
    formData.append('Name', product.name);
    formData.append('Description', product.description);
    formData.append('Price', product.price.toString());
    formData.append('TypeId', product.typeId.toString());
    formData.append('BrandId', product.brandId.toString());

    if (imageFile) {
      formData.append('Image', imageFile);
    } else if (typeof product.picture === 'string') {
      formData.append('ImageUrl', product.picture);
    }

    return formData;
  }
}
