import { BrandService } from '../../../Service/brand.service';
import { TypesBrandService } from '../../../Service/types-brand.service';
import { Product, ProductToSend } from '../../../Interfaces/Product/Product.models';
import { Brand } from '../../../Interfaces/Catgory/CatgoryModel';
import { Type } from '../../../Interfaces/TypesBrands/TypesBrand';
import { environment } from '../../../../environments/enviroment';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ProductService } from '../../../Service/product.service';
import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard-product',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './dashboard-product.component.html',
  styleUrls: ['./dashboard-product.component.css']
})
export class DashboardProductComponent implements OnInit {
  public products: Product[] = [];
  public currentPage = 1;
  public itemsPerPage = 9;
  public totalItems = 0;
  public totalPages = 0;
  public brands: Brand[] = [];
  public types: Type[] = [];

  // Modal states
  public showEditModal = false;
  public showDeleteModal = false;
  public showViewModal = false;

  // Selected product
  public selectedProduct: Product = {
    id: 0,
    name: '',
    description: '',
    price: 0,
    pictureUrl: '',
    typeId: 0,
    brandId: 0,
    brand: '',
    type: '',
    category: '',
    isFavourited: false
  };

  // File handling
  public selectedFile: File | null = null;

  // Loading states
  public saving = false;
  public deleting = false;
  public isLoading = false;

  constructor(
    private productService: ProductService,
    private brandService: BrandService,
    private typeService: TypesBrandService
  ) {}

  ngOnInit(): void {
    this.loadBrands();
    this.loadTypes();
    this.loadProducts();
  }

  loadBrands(): void {
    this.brandService.getBrands().subscribe({
      next: (brands) => this.brands = brands,
      error: (err) => console.error('Error loading brands:', err)
    });
  }

  loadTypes(): void {
    this.typeService.getTypes().subscribe({
      next: (types) => this.types = types,
      error: (err) => console.error('Error loading types:', err)
    });
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService.getProducts(
      this.currentPage,
      this.itemsPerPage,
    ).subscribe({
      next: (response: any) => {
        const productsData = response.value?.data || response.data || [];
        const totalCount = response.value?.count || response.count || 0;

        this.products = productsData.map((p: Product) => ({
          ...p,
          pictureUrl: p.pictureUrl.replace(
            environment.apiBaseUrl.substring(0, environment.apiBaseUrl.length-3),
            ''
          )
        }));

        this.totalItems = totalCount;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  // Modal handlers
  openEditModal(product: Product): void {
    this.selectedProduct = { ...product };
    this.selectedFile = null;
    this.showEditModal = true;
  }

  openDeleteModal(product: Product): void {
    this.selectedProduct = { ...product };
    this.showDeleteModal = true;
  }

  openViewModal(product: Product): void {
    this.selectedProduct = { ...product };
    this.showViewModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedFile = null;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
  }

  closeViewModal(): void {
    this.showViewModal = false;
  }

  // File handling
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.match(/image\/*/)) {
        alert('Only image files are allowed');
        return;
      }

      // Validate file size (e.g., 5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('Maximum file size is 5MB');
        return;
      }

      this.selectedFile = file;

      // Preview the image
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedProduct.pictureUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // CRUD operations
  saveProduct(): void {
    if (!this.selectedProduct.name || !this.selectedProduct.description ||
        !this.selectedProduct.price || !this.selectedProduct.typeId ||
        !this.selectedProduct.brandId) {
      alert('Please fill all required fields');
      return;
    }

    if (!this.selectedProduct.pictureUrl && !this.selectedFile) {
      alert('Please select an image');
      return;
    }

    this.saving = true;

    const formData = new FormData();
    formData.append('name', this.selectedProduct.name);
    formData.append('description', this.selectedProduct.description);
    formData.append('price', this.selectedProduct.price.toString());
    formData.append('typeId', this.selectedProduct.typeId.toString());
    formData.append('brandId', this.selectedProduct.brandId.toString());

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    } else if (this.selectedProduct.pictureUrl) {
      formData.append('pictureUrl', this.selectedProduct.pictureUrl);
    }

    this.productService.updateProduct(this.selectedProduct.id, formData).subscribe({
      next: (updatedProduct) => {
        const index = this.products.findIndex(p => p.id === updatedProduct.id);
        if (index !== -1) {
          this.products[index] = updatedProduct;
        }
        this.saving = false;
        this.showEditModal = false;
        this.loadProducts(); // Refresh the list
      },
      error: (err) => {
        console.error('Error updating product:', err);
        this.saving = false;

        if (err.error?.errors) {
          alert(err.error.errors.join('\n'));
        } else {
          alert('An error occurred while updating the product');
        }
      }
    });
  }

  confirmDelete(): void {
    if (!this.selectedProduct) return;

    this.deleting = true;
    this.productService.deleteProduct(this.selectedProduct.id).subscribe({
      next: () => {
        this.products = this.products.filter(p => p.id !== this.selectedProduct.id);
        if (this.products.length === 0 && this.currentPage > 1) {
          this.currentPage--;
          this.loadProducts();
        }
        this.deleting = false;
        this.showDeleteModal = false;
      },
      error: (err) => {
        console.error('Error deleting product:', err);
        this.deleting = false;
        alert('Error deleting product: ' + (err.error?.message || err.message));
      }
    });
  }

  // Helper methods
  getBrandName(brandId: number): string {
    return this.brands.find(b => b.id === brandId)?.name || 'Unknown Brand';
  }

  getTypeName(typeId: number): string {
    return this.types.find(t => t.id === typeId)?.name || 'Unknown Type';
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.loadProducts();
    }
  }

  getPages(): number[] {
    const pagesToShow = 5;
    const pages: number[] = [];
    let startPage = Math.max(1, this.currentPage - Math.floor(pagesToShow / 2));
    let endPage = startPage + pagesToShow - 1;

    if (endPage > this.totalPages) {
      endPage = this.totalPages;
      startPage = Math.max(1, endPage - pagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) pages.push(i);
    return pages;
  }

  trackByProductId(index: number, product: Product): number {
    return product.id;
  }
}
