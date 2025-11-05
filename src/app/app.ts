import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProductList } from './components/product-list/product-list';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { AsyncPipe, NgFor } from '@angular/common';
import { NgbToast } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from './admin/services/toast-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,Header,Footer, NgbToast,AsyncPipe],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('divineglow');
  constructor(public toastService: ToastService) {}

}
