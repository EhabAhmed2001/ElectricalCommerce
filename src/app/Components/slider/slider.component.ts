import { Component ,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


@Component({
  selector: 'app-slider',
  imports: [],
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class SliderComponent {

  
    images: string[] = [
      'img/1.avif',
      'img/2.avif',
     
    ];
  }
 

