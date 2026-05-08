import { BaseRepository } from '../base/BaseRepository';
import { Category, CategoryType } from '@/types';

export class CategoryRepository extends BaseRepository<Category> {
  constructor() {
    super('Category');
  }

  // 根据类型获取分类
  getByType(type: CategoryType): Category[] {
    return this.query('type == $0', type).sorted('order');
  }

  // 获取一级分类(无父分类)
  getRootCategories(type?: CategoryType): Category[] {
    const filter = type
      ? 'type == $0 AND parentId == null'
      : 'parentId == null';
    const args = type ? [type] : [];
    return this.query(filter, ...args).sorted('order');
  }

  // 获取子分类
  getSubCategories(parentId: string): Category[] {
    return this.query('parentId == $0', parentId).sorted('order');
  }

  // 增加使用次数
  incrementUsageCount(id: string): void {
    const category = this.getById(id);
    if (category) {
      this.realm.write(() => {
        (category as any).usageCount += 1;
        (category as any).updatedAt = new Date();
      });
    }
  }

  // 获取常用分类
  getFrequentCategories(type: CategoryType, limit: number = 10): Category[] {
    return this.query('type == $0', type)
      .sorted('usageCount', true)
      .slice(0, limit);
  }

  // 重新排序
  reorder(categoryIds: string[]): void {
    this.realm.write(() => {
      categoryIds.forEach((id, index) => {
        const category = this.getById(id);
        if (category) {
          (category as any).order = index;
          (category as any).updatedAt = new Date();
        }
      });
    });
  }

  // 获取默认分类
  getDefaultCategories(type: CategoryType): Category[] {
    return this.query('type == $0 AND isDefault == true', type).sorted('order');
  }

  // 检查分类是否被使用
  isCategoryUsed(categoryId: string): boolean {
    // 这里需要查询Transaction表,暂时返回false
    // 实际实现需要在TransactionRepository中完成
    return false;
  }
}
