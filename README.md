## Minimal Notes App

I use notes to store different bulleted lists, heaps of links, code snippets, commands, private keys. I need them many times a day. My perfect app for them should be:
- as fast as possible
- with a simple, not overloaded UI
- cross-platform
- transparent and secure

I tried many solutions, starting from specific apps, ending with Google Docs, but there is always something missing. That's how this project started, and here is the result.

**Instant as a native app.** The app is stored locally after the first loading using [Progressive Web App](https://en.wikipedia.org/wiki/Progressive_web_application) approach. It opens instantly on the next visit and even works **offline**. On Android it acts like a native app, just tap settings and "save to homescreen". All notes are stored in local storage. Also, they can be stored in the cloud with [Google Drive Application Data](https://developers.google.com/drive/api/v3/appdata), for backup and synchronization between several devices. Additionally, the notes database can be exported and imported as a JSON file.

**Open-source and serverless.** This app is static and served directly from [GitHub](https://github.com/htdt/mininote). It does not use any backend, meaning that your notes are stored only on your device and optionally on your Google Drive account. Additionally, notes can be encrypted with a password with the AES256 algorithm using [Web Crypto API](https://github.com/rndme/aes4js). The password and decrypted notes are not stored anywhere, this guarantees security. But remember that it is impossible to recover the password.

The app is free, ad-free, without user tracking. Classy mininote.js.org domain is provided by [js.org](https://js.org/). Notes markup is done with [Markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet). Frontend works on [Angular](https://angular.io/) & [Material Design](https://material.angular.io/), for any type of device.

Keyboard shortcuts:
- `ctrl + shift + p` to search by title
- `ctrl + shift + s` to save changes to Google Drive
- `shift + enter` to decrypt / edit / finish editing
- `esc` to cancel editing

This app is **not** designed for multimedia hosting, there is no way to upload a file or add a drawing, but you can embed content from other websites. This app is not for collaborative work, there is no sharing functionality.

Bugs and suggestions can be submitted with [GitHub Issues](https://github.com/htdt/mininote/issues).


## For Developers

Project is managed with [Angular CLI](https://cli.angular.io/).

To run the app from source:
- clone the [repository](https://github.com/htdt/mininote)
- `npm i` to install dependencies
- `npm start` to serve on https://localhost:4200/
- `npm run build` to build the project into `docs`  (default publishing source for [GitHub Pages](https://pages.github.com/))

Google Drive API key is restricted to mininote.js.org domain. If you want this functionality for localhost (or another domain), you need to get new [credentials](https://console.developers.google.com/apis/credentials) and replace `clientId` and `apiKey` in [gapi.service.ts](https://github.com/htdt/mininote/blob/master/src/app/core/gapi.service.ts).
