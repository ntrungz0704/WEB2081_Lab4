import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  private router = inject(Router);
  cartService = inject(CartService);
  searchKeyword = signal<string>('');

  onSearchInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.searchKeyword.set(val);
  }

  onSearchSubmit(event: Event): void {
    event.preventDefault();
    const keyword = this.searchKeyword().trim();
    this.router.navigate(['/products'], {
      queryParams: keyword ? { search: keyword } : {}
    });
  }
}
