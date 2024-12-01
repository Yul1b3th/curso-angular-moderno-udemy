import { computed, inject, Injectable, signal } from '@angular/core';
import { Product } from '@features/products/product.interface';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { CartCalculatorService } from 'src/app/store/cart-state/cart-calculator.service';

export interface CartStore {
  products: Product[];
  totalAmount: number;
  productsCount: number;
}

export const initialCartState: CartStore = {
  products: [],
  totalAmount: 0,
  productsCount: 0,
};

@Injectable({ providedIn: 'root' })
export class CartStateService {
  private readonly _cartState = new BehaviorSubject<CartStore>(
    initialCartState
  );
  private readonly _cartCalculatorService = inject(CartCalculatorService);
  private readonly _toastrService = inject(ToastrService);

  private readonly _products = signal<Product[]>([]);
  readonly totalAmount = computed(() =>
    this._cartCalculatorService.calculateTotal(this._products())
  );
  readonly productsCount = computed(() =>
    this._cartCalculatorService.calculateTotal(this._products())
  );

  // Global Store
  readonly cartStore = computed(() => ({
    products: this._products(),
    productsCount: this.productsCount(),
    totalAmount: this.totalAmount(),
  }));

  cart$ = this._cartState.asObservable();

  updateState(newState: CartStore): void {
    this._cartState.next(newState);
  }

  getCurrentState(): CartStore {
    return this._cartState.getValue();
  }

  addToCart(product: Product): void {
    const currentProducts = this._products();
    const existingProductIndex = currentProducts.findIndex(
      (p: Product) => p.id === product.id
    );
    if (existingProductIndex >= 0) {
      currentProducts[existingProductIndex] = {
        ...product,
        quantity: (currentProducts[existingProductIndex].quantity || 0) + 1,
      };
      this._products.set(currentProducts);
    } else {
      this._products.update((products: Product[]) => [
        ...products,
        { ...product, quantity: 1 },
      ]);
    }
    this._toastrService.success('Product added!!', 'DOMINI STORE');
  }

  removeFromCart(productId: number): void {
    try {
      if (!productId) {
        throw new Error('Invalid Product ID');
      }
      const currentProducts = this._products();
      const productExists = currentProducts.some(
        (product: Product) => product.id === productId
      );
      if (!productExists) {
        this._toastrService.warning('Product not found in cart!');
        return;
      }
      this._products.update((products: Product[]) =>
        products.filter((product: Product) => product.id !== productId)
      );
      this._toastrService.success('Product removed!!', 'DOMINI STORE');
    } catch (error) {
      console.error('Error removing product', error);
      this._toastrService.error('Error removing product', 'DOMINI STORE');
    }
  }

  clearCart(): void {
    this.updateState(initialCartState);
    this._toastrService.success('All Products removed!', 'DOMINI STORE');
  }
}
