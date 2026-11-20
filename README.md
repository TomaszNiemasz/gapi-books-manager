# GAPI Books Manager

A single-page web app for searching Google Books and managing your own bookshelves.
Originally a university project (2020), revived in 2026 and kept as a realistic
application under test for my QA automation portfolio.

> **Status:** revived, not actively developed. It runs on Angular 8, so it needs a
> small workaround on modern Node.js versions (see [Running locally](#running-locally)).

## Features

- Search Google Books by any query (press **Enter** or click the magnifier; empty queries are ignored)
- Sign in with a Google account (Google Identity Services, OAuth 2.0 token flow)
- Browse your own library
- Heart and bookmark icons on search results add a book to, or remove it from,
  your **Favorites** and **To read** shelves
- Remove books from the *Favorites*, *To read*, *Reading now* and *Have read* shelves

### Known limitations

- The book details page (`/book/:id`) is an unfinished placeholder; clicking a book only logs its data to the console.
- Shelf contents are loaded once per page visit and are not paginated, so very large shelves may be shown partially.
- Shelf state on the search page is loaded when the page opens. If you sign in afterwards, reload the page.

## Tech stack

Angular 8 · TypeScript 3.5 · RxJS 6 · Angular MDC / Angular Material ·
Google Books API · Google Identity Services

## Running locally

The repository does **not** contain any Google credentials, so you have to create them
yourself. All credential files are listed in `.gitignore`.

### 1. Google Cloud setup

In the [Google Cloud Console](https://console.cloud.google.com/):

1. Create a project and enable the **Books API**.
2. Create an **API key**. Restrict it to the Books API and to the HTTP referrer
   `http://localhost:4200/*`. The key is visible in the browser, so these restrictions are its only protection.
3. Configure the **OAuth consent screen** (user type *External*) and add your own
   Google account as a **test user**.
4. Create an **OAuth client ID** of type *Web application* with
   `http://localhost:4200` as an authorized JavaScript origin.
   No redirect URI is needed.

### 2. Credential files

Create two files in `src/app/`:

```ts
// src/app/api_key.ts
export const apiKey = 'YOUR_API_KEY';
```

```ts
// src/app/oauth2_key.ts
export const oAuthCredentials = {
  client_id: 'YOUR_CLIENT_ID.apps.googleusercontent.com'
};
```

Never put the OAuth *client secret* anywhere in this project; the browser flow does not use it.

### 3. Install and start

Angular 8 builds with webpack 4, which does not work out of the box with Node.js 17+
(`ERR_OSSL_EVP_UNSUPPORTED`). Pick one of the options:

```bash
npm install

# Option A: modern Node.js, re-enable the legacy OpenSSL provider
NODE_OPTIONS=--openssl-legacy-provider npm start

# Option B: an older Node.js version, no extra flag (for example with nvm)
nvm use 16
npm start
```

Open **http://localhost:4200** (use `localhost`, not `127.0.0.1`: Google compares the origin literally).

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| `ERR_OSSL_EVP_UNSUPPORTED` when starting | Node.js 17+ with webpack 4. Use option A or B above. |
| Sign-in popup is blocked or closes immediately | The browser or an extension blocks pop-ups. Allow pop-ups for `localhost:4200` or try a private window. |
| `Error 400: origin_mismatch` in the Google window | The address in the browser does not match the authorized JavaScript origin (for example `127.0.0.1` instead of `localhost`). |
| `Access blocked` / `access_denied` | Your account is not listed as a test user on the OAuth consent screen. |
| `429` from the Books API | A request was sent without the API key (shared anonymous quota) or your project quota is exhausted. |
| `403` from the Books API | The API key restrictions do not match (referrer or API) or the Books API is not enabled. |

## Tests

The repository still contains the original Angular scaffolding (`npm test` for Karma/Jasmine
and `npm run e2e` for Protractor). They are not maintained. Automated tests for this
application are written with Playwright, with Google Books responses mocked
using `page.route()`, because the real API has quotas and is not stable enough for repeatable tests.
