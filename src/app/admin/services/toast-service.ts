// toast.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

export interface ToastInfo {
  text: string;
  classname?: string;
  delay?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  toasts$ = new BehaviorSubject<ToastInfo[]>([]);

  show(text: string, classname = 'bg-danger text-white', delay = 4000) {
    if (!this.isBrowser) return;
    this.toasts$.next([...this.toasts$.value, { text, classname, delay }]);
  }

  remove(toast: ToastInfo) {
    if (!this.isBrowser) return;
    this.toasts$.next(this.toasts$.value.filter(t => t !== toast));
  }
}
