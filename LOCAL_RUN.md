# 本地运行指南

## 快速开始

### 方法1: 使用Expo(最简单,推荐)

Expo是React Native的简化版本,不需要配置原生项目。

```bash
cd /home/zack/code/AccountingApp

# 1. 安装Expo
npm install expo

# 2. 修改App.tsx为Expo兼容版本
# (见下方说明)

# 3. 启动Expo
npx expo start

# 4. 在手机上安装Expo Go App
# Android: https://play.google.com/store/apps/details?id=host.exp.exponent
# iOS: App Store搜索 "Expo Go"

# 5. 扫描二维码运行
```

### 方法2: 创建完整的React Native项目

```bash
# 1. 备份当前业务代码
cd /home/zack/code
cp -r AccountingApp/src AccountingApp_src_backup
cp AccountingApp/App.tsx AccountingApp_App_backup.tsx
cp AccountingApp/package.json AccountingApp_package_backup.json

# 2. 创建新的完整RN项目
npx react-native init AccountingAppNew --template typescript

# 3. 复制业务代码到新项目
cp -r AccountingApp_src_backup/* AccountingAppNew/src/
cp AccountingApp_App_backup.tsx AccountingAppNew/App.tsx

# 4. 合并package.json依赖
# 手动合并两个package.json的dependencies

# 5. 进入新项目安装依赖
cd AccountingAppNew
npm install

# 6. 运行项目
npx react-native run-android
```

### 方法3: 使用现有项目(需要手动配置)

```bash
cd /home/zack/code/AccountingApp

# 1. 下载Android项目模板
# 从GitHub下载完整的android文件夹
git clone --depth=1 https://github.com/react-native-community/react-native-template-typescript temp-template
cp -r temp-template/android .
cp -r temp-template/ios .
rm -rf temp-template

# 2. 修改包名
# 编辑 android/app/build.gradle 修改 applicationId
# 编辑 android/app/src/main/AndroidManifest.xml 修改 package

# 3. 运行
npx react-native run-android
```

---

## 详细步骤(方法2 - 推荐)

### 步骤1: 创建新项目

```bash
cd /home/zack/code

# 创建新项目(会自动生成android/ios文件夹)
npx react-native init AccountingAppFinal --template typescript

# 等待创建完成(约2-3分钟)
```

### 步骤2: 复制业务代码

```bash
# 复制src目录
cp -r AccountingApp/src/* AccountingAppFinal/src/

# 复制App.tsx
cp AccountingApp/App.tsx AccountingAppFinal/

# 复制类型定义
cp -r AccountingApp/src/types AccountingAppFinal/src/
```

### 步骤3: 合并依赖

编辑 `AccountingAppFinal/package.json`:

```json
{
  "dependencies": {
    "react": "18.2.0",
    "react-native": "0.73.1",
    "zustand": "^4.5.0",
    "realm": "^12.0.0",
    "react-native-paper": "^5.12.3",
    "@react-navigation/native": "^6.1.9",
    "@react-navigation/stack": "^6.3.20",
    "dayjs": "^1.11.10",
    "uuid": "^9.0.0",
    "react-native-safe-area-context": "4.8.2",
    "react-native-screens": "~3.29.0",
    "react-native-vector-icons": "^10.0.3"
  }
}
```

### 步骤4: 安装依赖

```bash
cd AccountingAppFinal

# 使用淘宝镜像加速
npm config set registry https://registry.npmmirror.com

# 安装依赖
npm install

# iOS需要额外安装pods(仅Mac)
cd ios && pod install && cd ..
```

### 步骤5: 运行项目

#### Android

```bash
# 确保已安装Android Studio和SDK
# 启动模拟器或连接真机

# 运行
npx react-native run-android
```

#### iOS(仅Mac)

```bash
# 运行
npx react-native run-ios
```

---

## 环境要求

### 必需环境

1. **Node.js** >= 18
```bash
node --version  # 检查版本
```

2. **JDK** >= 17 (Android)
```bash
java -version  # 检查版本
```

3. **Android Studio** (Android开发)
   - 下载: https://developer.android.com/studio
   - 安装SDK Platform 33
   - 安装Android Emulator

4. **Xcode** >= 14 (iOS开发,仅Mac)
   - 从App Store安装

### 环境变量配置

```bash
# 编辑 ~/.bashrc 或 ~/.zshrc

# Android
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools

# 使配置生效
source ~/.bashrc
```

---

## 常见问题解决

### 1. "Android project not found"

**原因**: 缺少android文件夹

**解决**: 使用方法2创建完整项目

### 2. "SDK location not found"

**解决**:
```bash
# 创建local.properties文件
cd android
echo "sdk.dir=$HOME/Android/Sdk" > local.properties
```

### 3. "Failed to install the app"

**解决**:
```bash
# 清理构建
cd android
./gradlew clean
cd ..

# 重新运行
npx react-native run-android
```

### 4. Metro bundler错误

**解决**:
```bash
# 清理缓存
npx react-native start --reset-cache

# 或删除缓存
rm -rf node_modules/.cache
rm -rf $TMPDIR/metro-*
```

### 5. 端口8081被占用

**解决**:
```bash
# 查找并杀死占用进程
lsof -i :8081
kill -9 <PID>

# 或使用其他端口
npx react-native start --port 8088
```

---

## 开发调试

### 启动开发服务器

```bash
# 终端1: 启动Metro
npx react-native start

# 终端2: 运行应用
npx react-native run-android
```

### 热重载

- 修改代码后按 `R` 键重新加载
- 按 `D` 键打开开发者菜单
- 按 `M` 键打开React DevTools

### 查看日志

```bash
# Android日志
npx react-native log-android

# 或使用adb
adb logcat *:S ReactNative:V ReactNativeJS:V
```

---

## 推荐开发流程

### 1. 使用Android Studio的模拟器

```bash
# 打开Android Studio
# Tools -> Device Manager
# 创建虚拟设备(Pixel 5, API 33)
# 启动模拟器
```

### 2. 或使用真机调试

```bash
# 1. 手机开启开发者选项和USB调试
# 2. 连接电脑
# 3. 授权调试
# 4. 检查连接
adb devices
```

### 3. 开发循环

```bash
# 1. 启动Metro
npx react-native start

# 2. 运行应用
npx react-native run-android

# 3. 修改代码
# 4. 按R键重新加载
# 5. 查看效果
```

---

## 快速测试命令

```bash
# 一键运行(推荐)
cd /home/zack/code
npx react-native init TestApp --template typescript
cd TestApp
npx react-native run-android

# 如果成功,说明环境正常
# 然后按照方法2迁移业务代码
```

---

## 总结

**最简单的方法**:
1. 创建新的完整RN项目
2. 复制业务代码
3. 安装依赖
4. 运行

**命令汇总**:
```bash
# 创建项目
npx react-native init MyApp --template typescript

# 安装依赖
npm install

# 运行Android
npx react-native run-android

# 运行iOS
npx react-native run-ios
```

按照这个流程,你就可以在本地成功运行项目了!
