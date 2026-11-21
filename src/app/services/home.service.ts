import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Banner } from '../models/banner';
import { Category } from '../models/category';
import { Product } from '../models/product';
import { Blog } from '../models/blog';

export interface HomeResponse {
  banners: Banner[];
  categories: Category[];
  newProducts: Product[];
  bestSellingProducts: Product[];
  saleProducts: Product[];
  latestBlogs: Blog[];
}

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/home`;

  getHomeData(): Observable<HomeResponse> {
    return this.http.get<HomeResponse>(this.apiUrl);
  }
}
