import { ModuleWithProviders, NgModule } from '@angular/core';
import { STORAGE_CONFIG } from './ngx-storage.tokens';
import { StorageOptions } from '@prologify/storage/core';

@NgModule({})
export class NgxStorageModule {
  public static forRoot(config: StorageOptions): ModuleWithProviders {
    return {
      ngModule: NgxStorageModule,
      providers: [
        {
          provide: STORAGE_CONFIG,
          useValue: config
        }
      ]
    };
  }
}
