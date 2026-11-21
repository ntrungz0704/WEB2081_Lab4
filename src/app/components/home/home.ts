import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Banner } from '../../models/banner';
import { Category } from '../../models/category';
import { Product } from '../../models/product';
import { Blog } from '../../models/blog';
import { HomeService } from '../../services/home.service';
import { CartService } from '../../services/cart.service';

@Component({
  imports: [RouterLink],
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  private homeService = inject(HomeService);
  private cartService = inject(CartService);

  banners = signal<Banner[]>([]);
  activeBannerIndex = signal<number>(0);
  categories = signal<Category[]>([]);
  newProducts = signal<Product[]>([]);
  bestSellingProducts = signal<Product[]>([]);
  saleProducts = signal<Product[]>([]);
  latestBlogs = signal<Blog[]>([]);

  isLoading = signal<boolean>(true);
  errorMessage = signal<string>('');

  currentBanner = computed(() => {
    const list = this.banners();
    if (list.length === 0) return null;
    return list[this.activeBannerIndex() % list.length];
  });

  ngOnInit(): void {
    this.loadHomeData();
  }

  loadHomeData(): void {
    this.isLoading.set(true);
    this.homeService.getHomeData().subscribe({
      next: (res) => {
        this.banners.set(res.banners || []);
        this.categories.set(res.categories || []);
        this.newProducts.set(res.newProducts || []);
        this.bestSellingProducts.set(res.bestSellingProducts || []);
        this.saleProducts.set(res.saleProducts || []);
        this.latestBlogs.set(res.latestBlogs || []);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Lỗi khi tải dữ liệu trang chủ từ backend:', err);
        this.errorMessage.set('Không thể kết nối đến Backend API (http://localhost:5000).');
        this.isLoading.set(false);
      }
    });
  }

  setBannerIndex(idx: number): void {
    this.activeBannerIndex.set(idx);
  }

  buyProduct(product: Product): void {
    this.cartService.addToCart(product);
  }
}
