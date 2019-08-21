export interface StorageEventOptions {
  name: string;
  storeName: string;
  version: number;
  key: string | null;
  oldValue: any;
  newValue: any;
  isCrossTab?: boolean;
}

export enum StorageEventTypes {
  Default,
  SetItem,
  RemoveItem,
  Clear
}

function getEventFromJSON(json: StorageEventOptions & { type: StorageEventTypes }): StorageEvents {
  switch (json.type) {
    case StorageEventTypes.Clear:
      return new ClearStorageEvent(json);
    case StorageEventTypes.SetItem:
      return new SetItemStorageEvent(json);
    case StorageEventTypes.RemoveItem:
      return new RemoveItemStorageEvent(json);
    default:
      return new CustomStorageEvent(json);
  }
}

export class CustomStorageEvent<T = any> {
  public readonly name: string;
  public readonly storeName: string;
  public readonly version: number;
  public readonly key: string | null;
  public readonly oldValue: T;
  public readonly newValue: T;
  public isCrossTab: boolean;
  public type: StorageEventTypes = StorageEventTypes.Default;

  constructor({ name, storeName, version, key, oldValue, newValue, isCrossTab = false }: StorageEventOptions) {
    this.name = name;
    this.storeName = storeName;
    this.version = version;
    this.key = key;
    this.oldValue = oldValue;
    this.newValue = newValue;
    this.isCrossTab = isCrossTab;
  }

  public static deserialize(event: string): StorageEvents {
    const json = JSON.parse(event);
    return getEventFromJSON(json);
  }

  public static serialize(event: CustomStorageEvent): string {
    return JSON.stringify(event);
  }

  public copyWith({
                    name = this.name,
                    storeName = this.storeName,
                    version = this.version,
                    key = this.key,
                    oldValue = this.oldValue,
                    newValue = this.newValue,
                    isCrossTab = this.isCrossTab
                  }: Partial<StorageEventOptions>): StorageEvents {

    return getEventFromJSON({
      type: this.type,
      name,
      storeName,
      version,
      key,
      oldValue,
      newValue,
      isCrossTab
    });
  }
}

export class SetItemStorageEvent extends CustomStorageEvent {
  public type: StorageEventTypes = StorageEventTypes.SetItem;
}

export class RemoveItemStorageEvent extends CustomStorageEvent {
  public type: StorageEventTypes = StorageEventTypes.RemoveItem;
}

export class ClearStorageEvent extends CustomStorageEvent {
  public type: StorageEventTypes = StorageEventTypes.Clear;
}

export type StorageEvents =
  CustomStorageEvent |
  SetItemStorageEvent |
  RemoveItemStorageEvent |
  ClearStorageEvent;
