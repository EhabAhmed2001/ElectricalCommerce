import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  private filterSubject = new BehaviorSubject<{
    typeId?: number | null,
    brandId?: number | null,
    price?: number|null,
   
  }>({});

  // Method to update filter
 updateFilter(params: {
  typeId?: number | null,
  brandId?: number | null,
  price?: number | null,
}) {
  const current = this.filterSubject.getValue();
  const updated = { ...current, ...params };
  this.filterSubject.next(updated);
}

 
  getFilterObservable(): Observable<{
    typeId?: number | null,
    brandId?: number | null,
      price?: number|null,
    
  }> {
    return this.filterSubject.asObservable();
  }

  
  getCurrentFilter() {
    return this.filterSubject.getValue();
  }
}