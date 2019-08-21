![](./images/logo.png)

# `@prologify/storage`

>The tool is in beta. Use it with caution.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

`@prologify/storage` is a async tool for storing and managing data in a browser. `@prologify/storage` does not use third-party packages for its work.

## Packages

- [@prologify/storage/core](https://github.com/prologify/packages/tree/master/libs/storage/core)
- [@prologify/storage/localstorage-driver](https://github.com/prologify/packages/tree/master/libs/storage/localstorage-driver)
- [@prologify/storage/sessionstorage-driver](https://github.com/prologify/packages/tree/master/libs/storage/sessionstorage-driver)
- [@prologify/storage/websql-driver](https://github.com/prologify/packages/tree/master/libs/storage/websql-driver)
- [@prologify/storage/indexeddb-driver](https://github.com/prologify/packages/tree/master/libs/storage/indexeddb-driver)
- [@prologify/storage/ngx](https://github.com/prologify/packages/tree/master/libs/storage/ngx)

## Install

```sh
$ npm i @prologify/storage

```

## Example

```typescript
import { Storage } from '@prologify/storage/core';
import { LocalstorageDriver } from '@prologify/storage/localstorage-driver';
import { WebsqlDriver } from '@prologify/storage/websql-driver';

const storage = new Storage({
  name: 'myDb',
  storeName: 'myStore',
  version: 1,
  drivers: [
    new WebsqlDriver({description: 'My first store', size: 2 * 1024 * 1024}),
    new LocalstorageDriver() // fallback, if websql is not supported
  ]
});

storage.setItem('a', 'b');

storage.getItem('a').then(console.log);

```

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgxStorageModule, NgxStorageService } from '@prologify/storage/ngx';
import { LocalstorageDriver } from '@prologify/storage/localstorage-driver';
import { mergeMap, tap } from 'rxjs/operators';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgxStorageModule.forRoot({
      version: 0,
      storeName: 'test',
      name: 'test',
      drivers: new LocalstorageDriver()
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(storage: NgxStorageService) {
    storage.setItem('a', 1).pipe(
      tap(console.log),
      mergeMap(() => storage.getItem('a')),
      tap(console.log)
    ).subscribe();
  }
}

```
