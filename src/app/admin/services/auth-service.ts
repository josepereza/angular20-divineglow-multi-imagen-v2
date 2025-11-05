import { Inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

interface LoginResponse {
  access_token: string;
  user: { id: number; username: string; role: string };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isBrowser: boolean;

  private baseUrl = 'http://localhost:3000/auth/login';

  private tokenSignal = signal<string | null>('');
  private userSignal = signal<any | null>(null);

  /* token = this.tokenSignal.asReadonlySignal();
  user = this.userSignal.asReadonlySignal(); */

  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      this.tokenSignal.set(localStorage.getItem('token'));
    }
  }

  login(username: string, password: string) {
    this.http.post<LoginResponse>(this.baseUrl, { username, password }).subscribe({
      next: (res) => {
        if (this.isBrowser) {
          this.tokenSignal.set(res.access_token);
        }
        this.userSignal.set(res.user);
        if (this.isBrowser) {
          localStorage.setItem('token', res.access_token);
        }
        this.router.navigate(['/admin']);
      },
      error: () => alert('Credenciales inválidas'),
    });
  }

  logout() {
    this.tokenSignal.set(null);
    this.userSignal.set(null);
    if (this.isBrowser) {
      localStorage.removeItem('token');
    }
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!this.tokenSignal();
  }

  getToken(): string | null {
    return this.tokenSignal();
  }
}
