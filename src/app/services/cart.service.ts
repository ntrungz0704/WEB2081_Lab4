import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../models/product';

export interface CartItem {
  product: Product;
  quantity: number;
}

const STORAGE_KEY = 'bhshop_lab4_cart';

export function parseVndPrice(priceStr: string): number {
  const digits = String(priceStr || '').replace(/[^\d]/g, '');
  return digits ? parseInt(digits, 10) : 0;
}

export function formatVndPrice(amount: number): string {
  return amount.toLocaleString('vi-VN') + 'đ';
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  items = signal<CartItem[]>(this.loadFromStorage());
  toastMessage = signal<string>('');
  private toastTimer?: ReturnType<typeof setTimeout>;

  totalCount = computed(() =>
    this.items().reduce((sum, item) => sum + item.quantity, 0)
  );

  totalAmount = computed(() =>
    this.items().reduce(
      (sum, item) => sum + parseVndPrice(item.product.price) * item.quantity,
      0
    )
  );

  formattedTotal = computed(() => formatVndPrice(this.totalAmount()));

  private loadFromStorage(): CartItem[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private saveToStorage(list: CartItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch {
      // ignore storage quota errors
    }
  }

  private showToast(msg: string): void {
    this.toastMessage.set(msg);
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => this.toastMessage.set(''), 2600);
  }

  addToCart(product: Product, quantity = 1): void {
    const current = [...this.items()];
    const idx = current.findIndex(i => i.product.id === product.id);
    if (idx >= 0) {
      current[idx] = { ...current[idx], quantity: current[idx].quantity + quantity };
    } else {
      current.push({ product, quantity });
    }
    this.items.set(current);
    this.saveToStorage(current);
    this.showToast(`Đã thêm "${product.name}" vào giỏ hàng!`);
  }

  updateQuantity(productId: number, delta: number): void {
    const updated = this.items()
      .map(item =>
        item.product.id === productId
          ? { ...item, quantity: item.quantity + delta }
          : item
      )
      .filter(item => item.quantity > 0);
    this.items.set(updated);
    this.saveToStorage(updated);
  }

  removeItem(productId: number): void {
    const updated = this.items().filter(item => item.product.id !== productId);
    this.items.set(updated);
    this.saveToStorage(updated);
  }

  clearCart(): void {
    this.items.set([]);
    this.saveToStorage([]);
  }
}
