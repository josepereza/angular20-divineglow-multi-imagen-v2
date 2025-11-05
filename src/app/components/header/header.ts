import { isPlatformBrowser } from '@angular/common';
import { Component, HostListener, inject, PLATFORM_ID } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-header',
  imports: [NgbCollapseModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
cartService=inject(CartService)
   private platformId = inject(PLATFORM_ID);
   isScrolled = false;
  isMenuCollapsed = true;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (isPlatformBrowser(this.platformId)) {
      this.isScrolled = window.scrollY > 50;
    }
  }
}
