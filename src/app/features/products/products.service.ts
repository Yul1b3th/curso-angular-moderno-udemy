import { inject, Injectable } from '@angular/core';
import { environment } from '@envs/environment';

import { Product } from '@features/products/product.interface';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { APIService } from './../../api/api.service';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private _allProducts$ = new BehaviorSubject<Product[]>([]);
  private _filteredProducts$ = new BehaviorSubject<Product[]>([]);

  readonly products$ = this._filteredProducts$.asObservable();

  private readonly _apiService = inject(APIService);
  private readonly _endPoint = `${environment.API_URL_FAKE_STORE}/products`;

  constructor() {
    this.getAllProducts()
      .pipe(
        tap((products: Product[]) => {
          this._allProducts$.next(products);
          this._filteredProducts$.next(products);
        })
      )
      .subscribe();
  }

  getProductById(productId: number): Observable<Product | undefined> {
    return this._allProducts$.pipe(
      map((products) => products.find((product) => product.id === productId))
    );
  }

  filterProductsByCategory(category: string): void {
    if (category === 'all') {
      this._filteredProducts$.next(this._allProducts$.value);
    } else {
      const filtered = this._allProducts$.value.filter(
        (product) => product.category === category
      );
      this._filteredProducts$.next(filtered);
    }
  }

  getProductsByCategory(category: string) {
    return this._apiService
      .get<Product[]>(`${this._endPoint}/category/${category}`)
      .pipe(map((products: Product[]) => this._addProperties(products)));
  }

  getAllProducts(): Observable<Product[]> {
    return this._apiService
      .get<Product[]>(`${this._endPoint}?sort=desc`)
      .pipe(map((products: Product[]) => this._addProperties(products)));
  }

  private _addProperties(products: Product[]): Product[] {
    return products.map((product) => ({
      ...product,
      quantity: 0,
    }));
  }
}
