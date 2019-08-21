import {
  CustomStorageEvent,
  StorageEvents,
  ClearStorageEvent,
  RemoveItemStorageEvent,
  SetItemStorageEvent
} from './custom-storage-event';
import { StorageOptions } from './storage-options';
import { Driver } from './driver';

export function whenReady(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const original: Function = descriptor.value;

  descriptor.value = async function value(...args: any[]) {
    await (this as Driver).ready();

    return original.apply(this, args);
  };
}

export const EVENT_KEY = '__browser_storage_event_';

export type HandlerFn = (event: StorageEvents) => any;

export class Storage implements Driver {
  private readonly _driver: Driver;
  private readonly options: StorageOptions;
  private readonly _handlerStore = new Set<HandlerFn>();

  constructor(options: StorageOptions) {
    this._driver = (Array.isArray(options.drivers)
      ? options.drivers : [options.drivers])
      .find(driver => driver.isSupported) as Driver;

    this.options = {
      ...options
    };

    delete this.options.drivers;

    this.init(options);
  }

  public get isSupported(): boolean {
    return !!this._driver && this._driver.isSupported;
  }

  public async ready(): Promise<boolean> {
    return !!this._driver && this._driver.isSupported && this._driver.ready();
  }

  @whenReady
  public async clear(): Promise<void> {
    await this._driver.clear();

    const event = new ClearStorageEvent({
      name: this.options.name,
      storeName: this.options.storeName,
      version: this.options.version,
      key: null,
      oldValue: null,
      newValue: null
    });

    this._triggerEvent(event);
  }

  @whenReady
  public async getItem<T>(key: string): Promise<T> {
    return this._driver.getItem<T>(key);
  }

  @whenReady
  public async iterate<T>(iterator: (key: string, value: T, index: number) => any): Promise<void> {
    return this._driver.iterate<T>(iterator);
  }

  @whenReady
  public async key(index: number): Promise<string> {
    return this._driver.key(index);
  }

  @whenReady
  public async keys(): Promise<string[]> {
    return this._driver.keys();
  }

  @whenReady
  public async length(): Promise<number> {
    return this._driver.length();
  }

  @whenReady
  public async removeItem(key: string): Promise<void> {
    const oldValue = await this.hasItem(key)
      ? await this.getItem(key)
      : undefined;

    await this._driver.removeItem(key);

    const event = new RemoveItemStorageEvent({
      name: this.options.name,
      storeName: this.options.storeName,
      version: this.options.version,
      key,
      oldValue,
      newValue: null
    });

    this._triggerEvent(event);
  }

  @whenReady
  public async setItem<T>(key: string, item: T): Promise<T> {
    const oldValue = await this.hasItem(key)
      ? await this.getItem(key)
      : undefined;

    const result = await this._driver.setItem<T>(key, item);

    const event = new SetItemStorageEvent({
      name: this.options.name,
      storeName: this.options.storeName,
      version: this.options.version,
      key,
      oldValue,
      newValue: item
    });

    this._triggerEvent(event);

    return result;
  }

  public init(dbOptions?: StorageOptions): Promise<void> {
    this._initCrossTabNotification();
    return !!this._driver && this._driver.init(dbOptions);
  }

  @whenReady
  public async hasItem(key: string): Promise<boolean> {
    return this._driver.hasItem(key);
  }

  @whenReady
  public async getDriver() {
    return this._driver;
  }

  public async destroy(): Promise<void> {
    window.removeEventListener('storage', this._storageChange);
    this._handlerStore.clear();
    return this._driver.destroy();
  }

  public addEventListener(fn: HandlerFn): () => any {
    this._handlerStore.add(fn);

    return () => this.removeEventListener(fn);
  }

  public removeEventListener(fn: HandlerFn) {
    this._handlerStore.delete(fn);
  }

  private _triggerEvent(event: StorageEvents) {
    this._applyHandlers(event);
    this._triggerCrossTabEvent(event);
  }

  private _triggerCrossTabEvent(event: CustomStorageEvent) {
    if (this.options.crossTabNotification) {
      localStorage.setItem(EVENT_KEY, CustomStorageEvent.serialize(event.copyWith({ isCrossTab: true })));
    }
  }

  private readonly _storageChange = (evt: StorageEvent) => {
    if (evt.key !== EVENT_KEY) {
      return;
    }

    const serializeEvent: string = localStorage.getItem(EVENT_KEY) as string;
    const event = CustomStorageEvent.deserialize(serializeEvent);

    if (event.name !== this.options.name || event.storeName !== this.options.storeName) {
      return;
    }

    this._applyHandlers(event);
  };

  private _applyHandlers(event: StorageEvents) {
    this._handlerStore.forEach(fn => fn(event));
  }

  private _initCrossTabNotification() {
    window.addEventListener('storage', this._storageChange);
  }
}
