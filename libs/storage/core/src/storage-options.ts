import { Driver } from './driver';

export interface StorageOptions {
  name: string;
  storeName: string;
  version: number;
  drivers: Driver | Driver[];
  crossTabNotification?: boolean;
}
