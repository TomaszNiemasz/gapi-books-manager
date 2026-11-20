import {Injectable, NgZone} from '@angular/core';
import {oAuthCredentials} from './oauth2_key';
import {Router} from '@angular/router';

// Mówimy TypeScriptowi: "obiekt google istnieje, dołącza go skrypt z index.html".
// Bez tej linijki kompilator zgłosiłby błąd "Cannot find name 'google'".
declare const google: any;

// Zakres uprawnień = o co prosimy użytkownika (tu: dostęp do jego półek w Google Books).
const BOOKS_SCOPE = 'https://www.googleapis.com/auth/books';

// Nazwy "szuflad" w pamięci przeglądarki, w których trzymamy token i czas jego wygaśnięcia.
const TOKEN_KEY = 'accessToken';
const EXPIRES_AT_KEY = 'accessTokenExpiresAt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Obiekt od Google, który umie poprosić użytkownika o zgodę.
  private tokenClient: any;

  // NgZone = narzędzie Angulara, wyjaśnione niżej.
constructor(private ngZone: NgZone, private router: Router) { }

  // Wywoływane po kliknięciu "Sign in".
  // onSuccess: co zrobić, gdy się uda. onError: co zrobić, gdy coś pójdzie nie tak.
  public signIn(onSuccess: () => void, onError: (message: string) => void): void {

    // Zabezpieczenie: biblioteka Google mogła się nie załadować (brak internetu, adblock).
    if (typeof google === 'undefined') {
      onError('Nie udało się załadować logowania Google.');
      return;
    }

    // Tworzymy "klienta tokenów" i mówimy mu, kim jesteśmy i o co prosimy.
    this.tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: oAuthCredentials.client_id,
      scope: BOOKS_SCOPE,

      // Google wywoła tę funkcję, gdy użytkownik odpowie w okienku (zgoda albo odmowa).
      callback: (response: any) => {
        this.ngZone.run(() => {
          if (response.error) {
            onError('Logowanie nie powiodło się: ' + response.error);
            return;
          }
          this.saveToken(response.access_token, response.expires_in);
          onSuccess();
        });
      },

      // Wywoływane, gdy okienko się nie otworzy lub użytkownik je zamknie.
            error_callback: (error: any) => {
        // Zapisujemy pełny błąd w konsoli, żeby można go było przeczytać przy diagnozie.
        console.warn('Błąd okna logowania Google:', error);

        this.ngZone.run(() => {
          if (error.type === 'popup_failed_to_open') {
            onError('Przeglądarka zablokowała okno logowania. Zezwól tej stronie na wyskakujące okienka.');
          } else if (error.type === 'popup_closed') {
            onError('Okno logowania zostało zamknięte przed zakończeniem.');
          } else {
            onError('Logowanie nie powiodło się z nieznanego powodu.');
          }
        });
      }
    });

    // Otwieramy okienko Google z prośbą o zgodę.
    this.tokenClient.requestAccessToken();
  }

  // Zapisuje token i godzinę, o której przestanie być ważny.
  private saveToken(accessToken: string, expiresInSeconds: number): void {
    // Date.now() = bieżący czas w milisekundach. Dodajemy czas życia tokenu
    // (sekundy * 1000 = milisekundy) i odejmujemy 60 s zapasu.
    const expiresAt = Date.now() + (expiresInSeconds - 60) * 1000;
    sessionStorage.setItem(TOKEN_KEY, accessToken);
    // sessionStorage trzyma tylko tekst, więc liczbę zamieniamy na napis.
    sessionStorage.setItem(EXPIRES_AT_KEY, String(expiresAt));
  }

  // Zwraca ważny token albo null, gdy go nie ma lub wygasł.
  public getSessionToken(): string | null {
    const token = sessionStorage.getItem(TOKEN_KEY);
    const expiresAt = Number(sessionStorage.getItem(EXPIRES_AT_KEY));

    if (!token || Date.now() >= expiresAt) {
      return null;
    }
    return token;
  }

  // Wylogowanie: zapominamy token i wracamy na stronę główną.
  public signOut(): void {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(EXPIRES_AT_KEY);
    this.router.navigate(['/main']);
  }

}