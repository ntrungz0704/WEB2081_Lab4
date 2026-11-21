import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Blog } from '../../models/blog';
import { BlogService } from '../../services/blog.service';

@Component({
  selector: 'app-blogs',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './blogs.html',
  styleUrl: './blogs.css'
})
export class Blogs implements OnInit {
  private blogService = inject(BlogService);

  blogs = signal<Blog[]>([]);
  isLoading = signal<boolean>(true);
  searchQuery = signal<string>('');
  selectedCategory = signal<string>('all');
  selectedBlog = signal<Blog | null>(null);

  categories = [
    { id: 'all', name: 'Tất cả' },
    { id: 'Mẹo chăm sóc', name: 'Mẹo chăm sóc' },
    { id: 'Ý nghĩa hoa', name: 'Ý nghĩa hoa' },
    { id: 'Phong cách sống', name: 'Phong cách sống' },
    { id: 'Nghệ thuật cắm hoa', name: 'Cắm hoa' },
    { id: 'Sự kiện & Cưới', name: 'Sự kiện' },
  ];

  filteredBlogs = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    const cat = this.selectedCategory();
    return this.blogs().filter(b => {
      const matchCat = cat === 'all' || b.category === cat;
      const matchQuery = !query ||
        b.title.toLowerCase().includes(query) ||
        b.summary.toLowerCase().includes(query) ||
        b.author.toLowerCase().includes(query);
      return matchCat && matchQuery;
    });
  });

  ngOnInit(): void {
    this.blogService.getBlogs().subscribe({
      next: (data) => {
        this.blogs.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Lỗi tải bài viết:', err);
        this.isLoading.set(false);
      }
    });
  }

  setCategory(catId: string): void {
    this.selectedCategory.set(catId);
  }

  onSearchInput(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  openDetail(blog: Blog): void {
    this.selectedBlog.set(blog);
  }

  closeDetail(): void {
    this.selectedBlog.set(null);
  }
}
