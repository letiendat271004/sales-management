import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html'
})
export class LoginComponent {

  username = '';
  password = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login() {

    this.http.post<any>(
      'http://localhost:2644/api/auth/login',
      {
        username: this.username,
        password: this.password
      }
    ).subscribe({

      next: (res) => {

        localStorage.setItem(
          'token',
          res.token
        );

        this.router.navigate(['/']);
      },

      error: () => {
        alert('Sai tài khoản hoặc mật khẩu');
      }

    });
  }
}