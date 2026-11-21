import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService, formatVndPrice, parseVndPrice } from '../../services/cart.service';

@Component({
  imports: [RouterLink],
  selector: 'app-cart',
  standalone: true,
  styleUrl: './cart.css',
  templateUrl: './cart.html',
})
export class Cart {
  cartService = inject(CartService);
  orderSuccess = signal<boolean>(false);

  getItemSubtotal(priceStr: string, qty: number): string {
    return formatVndPrice(parseVndPrice(priceStr) * qty);
  }

  checkout(): void {
    if (this.cartService.items().length === 0) return;
    this.orderSuccess.set(true);
    this.cartService.clearCart();
  }
}
