import Realm from 'realm';
import { getDatabase } from '../database';

// 基础Repository类
export abstract class BaseRepository<T> {
  protected schemaName: string;
  protected realm: Realm;

  constructor(schemaName: string) {
    this.schemaName = schemaName;
    this.realm = getDatabase();
  }

  // 创建记录
  create(data: Partial<T>): T {
    let result: T;
    this.realm.write(() => {
      result = this.realm.create<T>(this.schemaName, {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });
    return result!;
  }

  // 更新记录
  update(id: string, data: Partial<T>): T | null {
    const record = this.getById(id);
    if (!record) return null;

    let result: T;
    this.realm.write(() => {
      result = this.realm.create<T>(
        this.schemaName,
        {
          ...record,
          ...data,
          updatedAt: new Date(),
        },
        Realm.UpdateMode.Modified,
      );
    });
    return result!;
  }

  // 删除记录
  delete(id: string): boolean {
    const record = this.getById(id);
    if (!record) return false;

    this.realm.write(() => {
      this.realm.delete(record);
    });
    return true;
  }

  // 根据ID获取记录
  getById(id: string): T | null {
    return this.realm.objectForPrimaryKey<T>(this.schemaName, id);
  }

  // 获取所有记录
  getAll(): Realm.Results<T> {
    return this.realm.objects<T>(this.schemaName);
  }

  // 查询记录
  query(filter: string, ...args: any[]): Realm.Results<T> {
    return this.realm.objects<T>(this.schemaName).filtered(filter, ...args);
  }

  // 排序
  sorted(property: string, ascending: boolean = true): Realm.Results<T> {
    return this.getAll().sorted(property, ascending);
  }

  // 计数
  count(): number {
    return this.getAll().length;
  }

  // 批量创建
  createBatch(dataList: Partial<T>[]): T[] {
    const results: T[] = [];
    this.realm.write(() => {
      dataList.forEach(data => {
        const result = this.realm.create<T>(this.schemaName, {
          ...data,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        results.push(result);
      });
    });
    return results;
  }

  // 批量删除
  deleteBatch(ids: string[]): number {
    let count = 0;
    this.realm.write(() => {
      ids.forEach(id => {
        const record = this.getById(id);
        if (record) {
          this.realm.delete(record);
          count++;
        }
      });
    });
    return count;
  }
}
