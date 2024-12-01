import { Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class SpinnerService {
  // private isLoadingSubject = new BehaviorSubject<boolean>(false);
  private readonly isLoading = signal<boolean>(false);
  // isLoading$: Observable<boolean> = this.isLoadingSubject.asObservable();
  isLoading$ = toObservable(this.isLoading);

  show(): void {
    this.isLoading.set(true);
  }

  hide(): void {
    this.isLoading.set(false);
  }
}
