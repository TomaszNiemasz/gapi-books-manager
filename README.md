# GAPI Books Manager

A single-page web app for browsing Google Books and managing your own
bookshelves. Built with Angular as a university project (2020).

> **Status:** archived. The project uses Angular 8 and the legacy Google
> Sign-In library, so it is kept as a portfolio piece and is not maintained.

## Features

- Search Google Books by any query
- Book details page
- Sign in with a Google account (OAuth 2.0)
- Browse your own library and bookshelves
- Add books to and remove them from your bookshelves

## Tech stack

Angular 8 · TypeScript · RxJS · Angular Material · `ng-gapi` · Google Books API ·
Karma / Jasmine (unit tests) · Protractor (e2e tests)

## Running locally

The repository does not contain Google credentials, so you must create two
files yourself. Both are listed in `.gitignore`.

1. In the Google Cloud Console, create an **API key** and an **OAuth 2.0 client ID**
   and enable the Books API.
2. Create `src/app/api_key.ts`:
   ```ts
   export const apiKey = 'YOUR_API_KEY';
   ```
3. Create `src/app/oauth2_key.ts` exporting `oAuthCredentials` with your
   `client_id` (see how it is used in `src/app/sign-in/sign-in.component.ts`).
4. Install and start (an older Node.js version, such as 12 or 14, may be needed for Angular 8):
   ```bash
   nvm use 16
   npm install
   npm start
   ```
   Open `http://localhost:4200/`.

## Tests

```bash
npm test     # unit tests (Karma + Jasmine)
npm run e2e  # end-to-end tests (Protractor)
```
