import { Component } from '@angular/core';
import { Features } from '../features/features';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-home',
  imports: [Features],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

}
