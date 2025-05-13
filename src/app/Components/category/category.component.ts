import { Component, OnInit } from '@angular/core'; 
import { Catgoery } from '../../Interfaces/Catgory/CatgoryModel'; 
import { CatgoryService } from '../../Service/catgory.service';
import { Router, RouterModule } from '@angular/router';
import {  FilterService} from '../../Service/filter.service';
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'] ,
  imports:[RouterModule]
})
export class CategoryComponent implements OnInit {
  element: Catgoery = {
    id: 0,
     name: '',
    image: ''
   
  };

  categories: Catgoery[] = [];

  constructor(private service: CatgoryService,private filter:FilterService, private router: Router) {}

  ngOnInit(): void {
    this.service.getCatgory().subscribe(
      (data: Catgoery[]) => {
        this.categories = data;
        console.log("Categories received:", this.categories);
      }
    );



  }


  filterProduct(id:number)
  {
this.filter.updateFilter({
    typeId: id,
    
  });
    this.router.navigate(['/products']);
}
}
