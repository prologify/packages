import { Serializer } from '@prologify/storage/core';

export class SessionstorageSerializer implements Serializer {
  public async deserialize<T>(value: string): Promise<T> {
    return JSON.parse(value);
  }

  public async serialize(value: any): Promise<string> {
    return JSON.stringify(value);
  }
}
