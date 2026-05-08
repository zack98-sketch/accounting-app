# 智能记账助手

一个简洁高效的个人记账应用,参考钱迹和vivo钱包的记账功能开发。

## 技术栈

- **React Native** - 跨平台移动应用框架
- **TypeScript** - 类型安全的JavaScript超集
- **Realm** - 高性能移动数据库
- **Zustand** - 轻量级状态管理
- **React Navigation** - 导航解决方案
- **React Native Paper** - Material Design UI组件库

## 项目结构

```
AccountingApp/
├── src/
│   ├── components/     # 可复用UI组件
│   ├── screens/        # 页面组件
│   ├── services/       # 业务逻辑和数据访问
│   │   ├── base/       # 基础类
│   │   ├── database/   # 数据库配置
│   │   └── repositories/ # 数据访问层
│   ├── stores/         # Zustand状态管理
│   ├── types/          # TypeScript类型定义
│   ├── utils/          # 工具函数
│   ├── assets/         # 静态资源
│   └── navigation/     # 导航配置
├── App.tsx             # 应用入口
└── package.json        # 依赖配置
```

## 核心功能

### 已实现
- ✅ 项目基础架构搭建
- ✅ TypeScript配置
- ✅ Realm数据库配置和加密
- ✅ 基础服务层架构
- ✅ 数据模型定义(Account, Category, Transaction, Budget)
- ✅ Repository层实现
- ✅ 核心业务服务
- � Zustand状态管理
- ✅ 主题系统(深色/浅色模式)
- � 预设数据初始化
- ✅ 基础页面(首页、快速记账、统计、设置)

### 待开发
- ⏳ 完整的记账流程
- ⏳ 分类选择器组件
- ⏳ 账户选择器组件
- ⏳ 交易记录列表
- ⏳ 统计图表
- ⏳ 预算管理
- ⏳ 数据备份与同步
- ⏳ 性能优化

## 安装和运行

### 安装依赖
```bash
npm install
```

### iOS运行
```bash
npm run ios
```

### Android运行
```bash
npm run android
```

## 数据模型

### Account (账户)
- 支持多种账户类型(现金、银行卡、信用卡、投资等)
- 记录余额和初始余额
- 可设置是否计入总资产

### Category (分类)
- 支持收入和支出分类
- 支持二级分类
- 记录使用频率用于智能推荐

### Transaction (交易)
- 支持收入、支出、转账三种类型
- 关联账户和分类
- 支持软删除

### Budget (预算)
- 支持多种周期(日、周、月、年)
- 可设置分类预算
- 预警提醒功能

## 开发指南

### 添加新功能
1. 在`src/types/`中定义类型
2. 在`src/services/repositories/`中创建Repository
3. 在`src/services/`中创建Service
4. 在`src/stores/`中创建Store
5. 在`src/screens/`中开发页面

### 代码规范
- 使用TypeScript严格模式
- 遵循ESLint和Prettier配置
- 组件使用函数式组件
- 状态管理使用Zustand

## 许可证

MIT
