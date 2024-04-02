// db.ts
import Dexie, { type Table } from 'dexie';

export interface Friend {
  id?: number;
  name: string;
  age: number;
}

export interface StaticData {
  type: string;
  data: JSON;
}

export class MySubClassedDexie extends Dexie {
  // 'friends' is added by dexie when declaring the stores()
  // We just tell the typing system this is the case
  friends!: Table<Friend>;
  staticdata!: Table<StaticData>; 

  constructor() {
    super('BalanceAnalytics');
    this.version(1).stores({
      friends: '++id, name, age', // Primary key and indexed props
      staticdata: 'type, data'
    });
  }
}

export const db = new MySubClassedDexie();