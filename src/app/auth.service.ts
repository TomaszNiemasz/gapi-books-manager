import {Injectable, NgZone} from '@angular/core';
import {GoogleAuthService} from 'ng-gapi/lib';
import {Router} from '@angular/router';
import GoogleUser = gapi.auth2.GoogleUser;
import GoogleAuth = gapi.auth2.GoogleAuth;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public static readonly SESSION_STORAGE_KEY: string = 'accessToken';

  user: GoogleUser;
  userName: string;
  googleAuth: GoogleAuth;

  constructor(
    private googleAuthService: GoogleAuthService,
    private router: Router,
    private ngZone: NgZone
  ) { }

  public setUser(user: GoogleUser) {
    this.user = user;
  }

  public getUser(): GoogleUser {
    return this.user;
  }

  public setUserName(userName: string) {
    this.userName = userName;
  }

  public getUserName(): string {
    return this.userName;
  }

  public signIn() {
    this.googleAuthService.getAuth().subscribe((googleAuth) => {
      googleAuth.signIn().then(
        res => this.handleSignInSuccess(res),
          err => this.handleSignInError(err));
    });
  }

  public signOut() {
    if (sessionStorage.getItem('accessToken') !== '') {
      sessionStorage.clear();
      localStorage.clear();
      gapi.auth2.getAuthInstance().signOut();
      this.router.navigate(['/main']);
/*      this.getSignInStatus();
      this.getToken();
      this.getRealToken();*/
    }
  }

  public getSessionToken() {
    // console.log(`SessionToken: ${sessionStorage.getItem('accessToken')}`)
    return sessionStorage.getItem('accessToken');
  }

  public setSessionToken(accessToken) {
    sessionStorage.setItem('accessToken', accessToken);
  }

  public getToken() {
    return gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;
  }

  public getRealToken() {

  }

  public getSignInStatus() {
    return gapi.auth2.getAuthInstance().isSignedIn.get();
  }

  public listenSignInStatus() {
    gapi.auth2.getAuthInstance().isSignedIn.listen(signedIn => {
      console.log('SignInStatus CHANGED')
      console.log(`SignInStatus: ${signedIn}`);
      console.log(`HasBooksScope: ${gapi.auth2.getAuthInstance().currentUser.get().hasGrantedScopes('https://www.googleapis.com/auth/books')}`);
      console.log(`AccessToken: ${gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token}`);
      if (signedIn) {
        this.setSessionToken(this.getToken());
        console.log('SessionTokenUpdated');
      } else {
        sessionStorage.clear();
        localStorage.clear();
        console.log('SessionTokenCleared');
      }
    });
  }

  private handleSignInSuccess(signInResponse: GoogleUser) {
    this.ngZone.run(() => {
      this.user = signInResponse;
      sessionStorage.setItem(
        AuthService.SESSION_STORAGE_KEY, signInResponse.getAuthResponse().access_token
      );
    });
  }

  private handleSignInError(signInError) {
    console.warn(signInError);
  }
}
