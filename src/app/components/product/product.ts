import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';

@Component({
  imports: [RouterLink],
  selector: 'app-product',
  standalone: true,
  styleUrl: './product.css',
  templateUrl: './product.html',
})
export class ProductComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  product = signal<Product | null>(null);
  isLoading = signal<boolean>(true);
  notFound = signal<boolean>(false);

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const slugOrId = params.get('slug') || params.get('id');
      if (slugOrId) {
        this.loadProduct(slugOrId);
      }
    });
  }

  loadProduct(slugOrId: string): void {
    this.isLoading.set(true);
    this.notFound.set(false);

    this.productService.getProductById(slugOrId).subscribe({
      next: (data) => {
        this.product.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Lỗi khi tải chi tiết sản phẩm:', err);
        this.notFound.set(true);
        this.isLoading.set(false);
      },
    });
  }

  addToCart(): void {
    const item = this.product();
    if (item) {
      this.cartService.addToCart(item);
    }
  }

  buyNow(): void {
    const item = this.product();
    if (item) {
      this.cartService.addToCart(item);
      this.router.navigate(['/cart']);
    }
  }
}

export { ProductComponent as Product };
