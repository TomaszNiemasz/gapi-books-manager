import {Component, OnInit, ElementRef, NgZone} from '@angular/core';
import {AuthService} from '../auth.service';
import {BooksService} from '../books.service';
import {Router} from '@angular/router';
import {oAuthCredentials} from '../oauth2_key';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  private scope = 'https://www.googleapis.com/auth/books';
  private discoveryDocs = ['https://www.googleapis.com/discovery/v1/apis/books/v1/rest'];
  private accessToken;
  public auth2;
  userId;
  userName;

  constructor(
    private element: ElementRef,
    private authService: AuthService,
    private router: Router,
    private zone: NgZone
  ) {
  }

  ngOnInit() {
    this.googleInit();
  }

  public googleInit() {
    // let that = this;
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id: oAuthCredentials.client_id,
        scope: this.scope,
        redirect_uri: oAuthCredentials.redirect_uri
      })
/*        .then(googleAuth => {
        console.log(googleAuth.isSignedIn.get());
        if (googleAuth.isSignedIn.get()) {
          this.authService.setSessionToken(this.authService.getToken());
          console.log(`AlreadySignedIn ${this.authService.getSessionToken()}`);
        }
      });*/
      this.authService.listenSignInStatus();
      if (!this.authService.getSessionToken()) {
        this.attachSignin(this.element.nativeElement.firstChild);
      }
    });
  }

  public attachSignin(element) {
    this.auth2.attachClickHandler(element, {},
      (googleUser) => {
        const userProfile = googleUser.getBasicProfile();
        this.accessToken = googleUser.getAuthResponse().access_token;
        this.userId = userProfile.getId();
        this.userName = userProfile.getName();
        localStorage.setItem('userName', this.userName);
        this.authService.setUserName(this.userName);
        sessionStorage.setItem('accessToken', this.accessToken);
        console.log(`token: ${sessionStorage.getItem('accessToken')}`);
        this.zone.run(() => this.router.navigateByUrl('/library')).then();
      }
      , (error) => {

      });
  }

  public clickHandler() {
    if (this.authService.getSessionToken()) {
      this.zone.run(() => this.router.navigateByUrl('/library')).then();
    }
  }

}
