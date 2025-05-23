import { Component, OnInit } from '@angular/core';
import { CatgoryService } from '../../Service/catgory.service';
import { Catgoery, Brand } from '../../Interfaces/Catgory/CatgoryModel';
import { BrandService } from '../../Service/brand.service';
import { FilterService } from '../../Service/filter.service'; // استيراد خدمة الفلتر
import { filter } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css'],
  imports:[FormsModule]

})
export class FilterComponent implements OnInit {
  element: Catgoery = {
    id: 0,
    name: '',
    image: ''
  };
  categories: Catgoery[] = [];
  brand: Brand = {
    name: '',
    id: 0
  };
  Brands: Brand[] = [];

  public minPrice: number = 10;
  public Price: number = 1000;

  selectedCategoryId: number |null=null;
  selectedBrandId: number | null = null;
  selectedPriceRange:number =this.Price; ;

  constructor(
    private service: CatgoryService,
    private BrandSer: BrandService,
    private filterService: FilterService
  ) {}

  ngOnInit(): void {
    this.selectedCategoryId = this.filterService.getCurrentFilter().typeId ?? null;
  this.selectedBrandId = this.filterService.getCurrentFilter().brandId ?? null;
  this.selectedPriceRange = this.filterService.getCurrentFilter().price ?? this.Price/2;
    this.service.getCatgory().subscribe(
      (data: Catgoery[]) => {
        this.categories = data;
        console.log("Categories received:", this.categories);
      }
    );

    this.BrandSer.getBrands().subscribe(
      (data: Brand[]) => {
        this.Brands = data;
      }
    );
  }

  onCategoryChange(id:number) {
    this.selectedCategoryId=id
    this.filterService.updateFilter({
      typeId: this.selectedCategoryId,
      brandId: this.selectedBrandId,
      price: this.selectedPriceRange
    });
  }

  onBrandChange(id:number) {
    this.selectedBrandId=id
    this.filterService.updateFilter({
      typeId: this.selectedCategoryId,
      brandId: this.selectedBrandId,
      price: this.selectedPriceRange
    });
  }


  onPriceChange(event: any) {
 const price = parseFloat(event.target.value);
  if (isNaN(price)) {
    console.error('Invalid price value');
    return;
  }

  this.selectedPriceRange = price;
    this.filterService.updateFilter({
    typeId: this.selectedCategoryId,
    brandId: this.selectedBrandId,
    price: this.selectedPriceRange
  });
}

restCatgoryFilter()
{
  this.selectedCategoryId=null;
  this.filterService.updateFilter({
      typeId: this.selectedCategoryId,
      brandId: this.selectedBrandId,
      price: this.selectedPriceRange
    });
}
restBrandFilter()
{
   this.selectedBrandId=null;
  this.filterService.updateFilter({
      typeId: this.selectedCategoryId,
      brandId: this.selectedBrandId,
      price: this.selectedPriceRange
    });
}

getBubblePosition(): number {
  const range = this.Price - this.minPrice;
  const relativeValue = this.selectedPriceRange - this.minPrice;
  const percent = (relativeValue / range) * 100;
  return percent;
}

// Add this method to toggle section expansion
  toggleSection(event: Event): void {
    const target = event.currentTarget as HTMLElement;
    const section = target.closest('.filter-section');

    if (section) {
      section.classList.toggle('expanded');
      target.classList.toggle('expanded');
    }
  }
}
