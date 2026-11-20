import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {

  // Tekst błędu pokazywany użytkownikowi. Pusty = brak błędu.
  public errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  // Wywoływane po kliknięciu przycisku "MY LIBRARY".
  public clickHandler(): void {
    this.errorMessage = '';

    // Jeśli mamy ważny token, od razu idziemy do biblioteki.
    if (this.authService.getSessionToken()) {
      this.router.navigateByUrl('/library');
      return;
    }

    // Inaczej prosimy o logowanie i mówimy, co zrobić po sukcesie lub błędzie.
    this.authService.signIn(
      () => {
        this.router.navigateByUrl('/library');
      },
      (message) => {
        this.errorMessage = message;
      }
    );
  }

}