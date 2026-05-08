import { BaseService } from './base/BaseService';
import { CategoryRepository } from './repositories/CategoryRepository';
import { Category, CategoryType } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export class CategoryService extends BaseService {
  private categoryRepository: CategoryRepository;

  constructor() {
    super('CategoryService');
    this.categoryRepository = new CategoryRepository();
  }

  // 获取所有分类
  getCategories(type?: CategoryType): Category[] {
    if (type) {
      return this.categoryRepository.getByType(type);
    }
    return Array.from(this.categoryRepository.sorted('order'));
  }

  // 获取一级分类
  getRootCategories(type?: CategoryType): Category[] {
    return this.categoryRepository.getRootCategories(type);
  }

  // 获取子分类
  getSubCategories(parentId: string): Category[] {
    return this.categoryRepository.getSubCategories(parentId);
  }

  // 创建分类
  createCategory(data: {
    name: string;
    type: CategoryType;
    icon: string;
    color: string;
    parentId?: string;
  }): Category {
    const category = this.categoryRepository.create({
      id: uuidv4(),
      ...data,
      order: this.categoryRepository.count(),
      usageCount: 0,
      isDefault: false,
    } as Partial<Category>);

    this.log('Category created:', category.id);
    return category;
  }

  // 更新分类
  updateCategory(
    id: string,
    data: Partial<Omit<Category, 'id' | 'createdAt'>>,
  ): Category | null {
    const category = this.categoryRepository.update(id, data);
    if (category) {
      this.log('Category updated:', id);
    }
    return category;
  }

  // 删除分类
  deleteCategory(id: string, strategy: 'cascade' | 'setNull' = 'setNull'): boolean {
    const category = this.categoryRepository.getById(id);
    if (!category) return false;

    // 检查是否有子分类
    const subCategories = this.categoryRepository.getSubCategories(id);
    if (subCategories.length > 0) {
      if (strategy === 'cascade') {
        // 级联删除子分类
        subCategories.forEach(sub => {
          this.categoryRepository.delete(sub.id);
        });
      } else {
        // 将子分类的parentId设为null
        subCategories.forEach(sub => {
          this.categoryRepository.update(sub.id, { parentId: undefined } as Partial<Category>);
        });
      }
    }

    // TODO: 处理关联的交易记录

    const success = this.categoryRepository.delete(id);
    if (success) {
      this.log('Category deleted:', id);
    }
    return success;
  }

  // 重新排序分类
  reorderCategories(categoryIds: string[]): void {
    this.categoryRepository.reorder(categoryIds);
    this.log('Categories reordered');
  }

  // 获取常用分类
  getRecentCategories(type: CategoryType, limit: number = 10): Category[] {
    return this.categoryRepository.getFrequentCategories(type, limit);
  }

  // 增加使用次数
  incrementUsageCount(categoryId: string): void {
    this.categoryRepository.incrementUsageCount(categoryId);
  }

  // 获取分类统计
  getCategoryStats(): {
    totalCategories: number;
    incomeCategories: number;
    expenseCategories: number;
  } {
    const all = this.categoryRepository.getAll();
    const incomeCategories = all.filter(c => c.type === 'income').length;
    const expenseCategories = all.filter(c => c.type === 'expense').length;

    return {
      totalCategories: all.length,
      incomeCategories,
      expenseCategories,
    };
  }

  // 搜索分类
  searchCategories(keyword: string, type?: CategoryType): Category[] {
    let results = this.categoryRepository.getAll();
    
    if (type) {
      results = results.filtered('type == $0', type);
    }
    
    results = results.filtered('name CONTAINS[c] $0', keyword);
    
    return Array.from(results);
  }
}
