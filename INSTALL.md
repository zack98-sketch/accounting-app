# 安装指南

## 问题说明

由于网络或npm源的问题,直接运行`npm install`可能会超时或失败。以下是推荐的安装步骤:

## 解决方案

### 方案1: 使用国内镜像源(推荐)

```bash
# 设置淘宝镜像源
npm config set registry https://registry.npmmirror.com

# 清理缓存
npm cache clean --force

# 安装依赖
npm install

# 安装完成后可以切回官方源
npm config set registry https://registry.npmjs.org
```

### 方案2: 使用yarn代替npm

```bash
# 安装yarn
npm install -g yarn

# 使用yarn安装依赖
yarn install
```

### 方案3: 分步安装

```bash
# 先安装核心依赖
npm install react react-native zustand realm dayjs uuid

# 再安装导航依赖
npm install @react-navigation/native @react-navigation/stack react-native-paper

# 最后安装开发依赖
npm install --save-dev @types/react @types/react-native @types/uuid typescript
```

## 运行项目

### iOS
```bash
npm run ios
# 或
npx react-native run-ios
```

### Android
```bash
npm run android
# 或
npx react-native run-android
```

## 常见问题

### 1. react-native命令未找到
```bash
# 使用npx代替
npx react-native run-android
npx react-native run-ios
```

### 2. Metro bundler问题
```bash
# 清理Metro缓存
npx react-native start --reset-cache
```

### 3. iOS pod install问题
```bash
cd ios
pod install
cd ..
```

### 4. Android构建问题
```bash
# 清理Android构建
cd android
./gradlew clean
cd ..
```

## 项目结构说明

本项目是一个完整的React Native记账应用,包含:

- ✅ 完整的业务逻辑层
- ✅ Realm数据库加密存储
- ✅ Zustand状态管理
- ✅ TypeScript类型安全
- ✅ Material Design UI

## 技术栈

- React Native 0.73.2
- TypeScript 5.3.3
- Realm 12.0.0
- Zustand 4.5.0
- React Navigation 6.x
- React Native Paper 5.x

## 注意事项

1. 确保Node.js版本 >= 18
2. iOS开发需要Mac系统和Xcode
3. Android开发需要Android Studio和SDK
4. 首次运行可能需要较长时间下载依赖

## 获取帮助

如果遇到其他问题,请查看:
- [React Native官方文档](https://reactnative.dev/)
- [项目GitHub Issues](https://github.com/zack98-sketch/accounting-app/issues)
