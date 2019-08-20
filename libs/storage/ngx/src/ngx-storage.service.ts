import { Inject, Injectable } from '@angular/core';
import { defer, Observable, Subscriber } from 'rxjs';
import { STORAGE_CONFIG } from './ngx-storage.tokens';
import { Storage, CustomStorageEvent, StorageOptions } from '@prologify/storage/core';

@Injectable({
  providedIn: 'root'
})
export class NgxStorageService {
  private storage: Storage;

  constructor(@Inject(STORAGE_CONFIG) private storageConfig: StorageOptions) {
    this.storage = new Storage(storageConfig);
  }

  public clear(): Observable<void> {
    return defer<Promise<void>>(() => this.storage.clear());
  }

  public destroy(): Observable<void> {
    return defer<Promise<void>>(() => this.storage.destroy());
  }

  public getItem<T>(key: string): Observable<T> {
    return defer<Promise<T>>(() => this.storage.getItem<T>(key));
  }

  public hasItem(key: string): Observable<boolean> {
    return defer<Promise<boolean>>(() => this.storage.hasItem(key));
  }

  public iterate<T>(iterator: (key: string, value: T, index: number) => any): Observable<void> {
    return defer<Promise<void>>(() => this.storage.iterate<T>(iterator));
  }

  public key(index: number): Observable<string> {
    return defer<Promise<string>>(() => this.storage.key(index));
  }

  public keys(): Observable<string[]> {
    return defer<Promise<string[]>>(() => this.storage.keys());
  }

  public length(): Observable<number> {
    return defer<Promise<number>>(() => this.storage.length());
  }

  public ready(): Observable<boolean> {
    return defer<Promise<boolean>>(() => this.storage.ready());
  }

  public removeItem(key: string): Observable<void> {
    return defer<Promise<void>>(() => this.storage.removeItem(key));
  }

  public setItem<T>(key: string, item: T): Observable<T> {
    return defer<Promise<T>>(() => this.storage.setItem<T>(key, item));
  }

  public observe<T>(key: string): Observable<CustomStorageEvent<T>> {
    return new Observable((subscriber: Subscriber<CustomStorageEvent<T>>) => {
      const listener = this.storage.addEventListener((event: CustomStorageEvent<T>) => {
        if (key === event.key) {
          subscriber.next(event);
        }
      });

      return () => {
        subscriber.unsubscribe();
        listener();
      };
    });
  }
}
