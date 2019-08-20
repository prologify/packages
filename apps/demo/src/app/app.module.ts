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
