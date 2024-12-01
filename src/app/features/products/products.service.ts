import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '@envs/environment';

import { Product } from '@features/products/product.interface';
import { map, Observable, tap } from 'rxjs';
import { APIService } from './../../api/api.service';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  // private _allProducts$ = new BehaviorSubject<Product[]>([]);
  // private _filteredProducts$ = new BehaviorSubject<Product[]>([]);

  private readonly _allProducts = signal<Product[]>([]);
  private readonly _filteredProducts = signal<Product[]>([]);

  readonly products = computed(() => this._filteredProducts());

  private readonly _apiService = inject(APIService);
  private readonly _endPoint = `${environment.API_URL_FAKE_STORE}/products`;

  constructor() {
    this._getAllProducts()
      .pipe(
        tap((products: Product[]) => {
          this._allProducts.set(products);
          this._filteredProducts.set(products);
          // this._allProducts$.next(products);
          // this._filteredProducts$.next(products);
        })
      )
      .subscribe();
  }

  getProductById(productId: number): Product | undefined {
    return this._allProducts().find((product) => product.id === productId);
  }

  filterProductsByCategory(category: string): void {
    if (category === 'all') {
      this._filteredProducts.set(this._allProducts());
      // this._filteredProducts$.next(this._allProducts$.value);
    } else {
      const filtered = this._allProducts().filter(
        (product) => product.category === category
      );
      this._filteredProducts.set(filtered);
      // const filtered = this._allProducts$.value.filter(
      //   (product) => product.category === category
      // );
      // this._filteredProducts$.next(filtered);
    }
  }

  getProductsByCategory(category: string) {
    return this._apiService
      .get<Product[]>(`${this._endPoint}/category/${category}`)
      .pipe(map((products: Product[]) => this._addProperties(products)));
  }

  private _getAllProducts(): Observable<Product[]> {
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
