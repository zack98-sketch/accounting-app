# 部署和使用指南

## 目录
1. [项目初始化](#项目初始化)
2. [开发环境配置](#开发环境配置)
3. [运行项目](#运行项目)
4. [打包APK](#打包apk)
5. [部署到服务器](#部署到服务器)
6. [常见问题](#常见问题)

---

## 项目初始化

### 问题说明
当前项目包含完整的业务代码,但缺少React Native的原生项目文件(android/ios文件夹)。需要重新生成。

### 解决方案

#### 方案1: 使用react-native upgrade(推荐)

```bash
cd /home/zack/code/AccountingApp

# 生成Android和iOS原生项目
npx react-native upgrade

# 这会创建android/和ios/文件夹
```

#### 方案2: 手动创建新项目并迁移代码

```bash
# 1. 创建临时项目
cd /home/zack/code
npx react-native init AccountingAppTemp --template typescript

# 2. 复制原生项目文件
cp -r AccountingAppTemp/android AccountingApp/
cp -r AccountingAppTemp/ios AccountingApp/

# 3. 复制其他必要文件
cp AccountingAppTemp/index.js AccountingApp/
cp AccountingAppTemp/app.json AccountingApp/
cp AccountingAppTemp/metro.config.js AccountingApp/

# 4. 清理临时项目
rm -rf AccountingAppTemp
```

#### 方案3: 使用Expo(最简单)

如果不想处理原生配置,可以使用Expo:

```bash
# 安装Expo CLI
npm install -g expo-cli

# 初始化Expo项目
expo init AccountingAppExpo

# 将业务代码复制到新项目
```

---

## 开发环境配置

### Android环境

#### 1. 安装JDK
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install openjdk-17-jdk

# 验证安装
java -version
```

#### 2. 安装Android Studio
```bash
# 下载Android Studio
wget https://dl.google.com/dl/android/studio/ide-zips/2023.1.1/android-studio-2023.1.1-linux.tar.gz

# 解压
tar -xzf android-studio-2023.1.1-linux.tar.gz

# 启动
cd android-studio/bin
./studio.sh
```

#### 3. 配置环境变量
```bash
# 编辑 ~/.bashrc 或 ~/.zshrc
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin

# 使配置生效
source ~/.bashrc
```

#### 4. 安装SDK
打开Android Studio,安装:
- Android SDK Platform 33
- Android SDK Build-Tools 33
- Android Emulator
- Android SDK Platform-Tools

### iOS环境(仅Mac)

```bash
# 安装Xcode(从App Store)
# 安装CocoaPods
sudo gem install cocoapods

# 安装依赖
cd ios
pod install
```

---

## 运行项目

### 1. 启动Metro Bundler

```bash
cd /home/zack/code/AccountingApp

# 清理缓存
npx react-native start --reset-cache
```

### 2. 运行Android

#### 使用模拟器
```bash
# 列出可用模拟器
emulator -list-avds

# 启动模拟器
emulator -avd <avd_name>

# 运行应用
npx react-native run-android
```

#### 使用真机
```bash
# 连接手机并开启USB调试
adb devices

# 运行应用
npx react-native run-android
```

### 3. 运行iOS(仅Mac)

```bash
# 使用模拟器
npx react-native run-ios

# 指定模拟器
npx react-native run-ios --simulator="iPhone 15"

# 使用真机
npx react-native run-ios --device
```

---

## 打包APK

### 1. 生成签名密钥

```bash
cd android/app

# 生成密钥
keytool -genkeypair -v -storetype PKCS12 \
  -keystore my-release-key.keystore \
  -alias my-key-alias \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000

# 记住设置的密码!
```

### 2. 配置签名

编辑 `android/gradle.properties`:
```properties
MYAPP_RELEASE_STORE_FILE=my-release-key.keystore
MYAPP_RELEASE_KEY_ALIAS=my-key-alias
MYAPP_RELEASE_STORE_PASSWORD=你的密码
MYAPP_RELEASE_KEY_PASSWORD=你的密码
```

编辑 `android/app/build.gradle`:
```gradle
android {
    ...
    signingConfigs {
        release {
            storeFile file(MYAPP_RELEASE_STORE_FILE)
            storePassword MYAPP_RELEASE_STORE_PASSWORD
            keyAlias MYAPP_RELEASE_KEY_ALIAS
            keyPassword MYAPP_RELEASE_KEY_PASSWORD
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled enableProguardInReleaseBuilds
            proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
        }
    }
}
```

### 3. 生成APK

```bash
cd android

# 清理
./gradlew clean

# 生成Debug APK
./gradlew assembleDebug

# 生成Release APK
./gradlew assembleRelease

# APK位置
# Debug: android/app/build/outputs/apk/debug/app-debug.apk
# Release: android/app/build/outputs/apk/release/app-release.apk
```

### 4. 生成AAB(Android App Bundle)

```bash
cd android

# 生成AAB
./gradlew bundleRelease

# AAB位置
# android/app/build/outputs/bundle/release/app-release.aab
```

---

## 部署到服务器

### 方案1: 静态文件服务器

#### 1. 构建Web版本(使用React Native Web)
```bash
# 安装依赖
npm install react-native-web

# 构建
npm run build:web

# 输出在 build/ 目录
```

#### 2. 部署到Nginx
```bash
# 复制文件到服务器
scp -r build/* user@server:/var/www/accounting-app/

# Nginx配置
server {
    listen 80;
    server_name your-domain.com;
    
    root /var/www/accounting-app;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### 方案2: 应用分发服务器

#### 1. 搭建APK分发页面

创建 `deploy/index.html`:
```html
<!DOCTYPE html>
<html>
<head>
    <title>智能记账助手 - 下载</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
        }
        .download-btn {
            display: inline-block;
            padding: 15px 30px;
            background: #2196F3;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 10px;
        }
        .qr-code {
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <h1>智能记账助手</h1>
    <p>版本: 1.0.0</p>
    
    <h2>下载安装</h2>
    <a href="app-release.apk" class="download-btn">下载Android APK</a>
    
    <div class="qr-code">
        <p>扫描二维码下载:</p>
        <!-- 这里可以放置二维码图片 -->
    </div>
    
    <h2>更新日志</h2>
    <ul>
        <li>v1.0.0 - 初始版本发布</li>
    </ul>
</body>
</html>
```

#### 2. 部署到服务器

```bash
# 创建部署目录
mkdir -p /var/www/accounting-app-deploy

# 复制文件
cp android/app/build/outputs/apk/release/app-release.apk /var/www/accounting-app-deploy/
cp deploy/index.html /var/www/accounting-app-deploy/

# 设置权限
chmod 644 /var/www/accounting-app-deploy/*
```

#### 3. Nginx配置

```nginx
server {
    listen 80;
    server_name download.your-domain.com;
    
    root /var/www/accounting-app-deploy;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location ~* \.apk$ {
        add_header Content-Disposition "attachment";
    }
}
```

### 方案3: 使用第三方分发平台

#### 使用蒲公英(pgyer.com)
```bash
# 1. 注册蒲公英账号
# 2. 上传APK
# 3. 获取下载链接和二维码
```

#### 使用fir.im
```bash
# 1. 注册fir.im账号
# 2. 安装fir-cli
gem install fir-cli

# 3. 上传APK
fir publish app-release.apk
```

---

## 常见问题

### 1. Metro bundler无法启动

```bash
# 清理缓存
npx react-native start --reset-cache

# 或删除缓存目录
rm -rf node_modules/.cache
rm -rf $TMPDIR/metro-*
rm -rf $TMPDIR/haste-map-*
```

### 2. Android构建失败

```bash
# 清理Android构建
cd android
./gradlew clean
cd ..

# 重新构建
npx react-native run-android
```

### 3. iOS构建失败

```bash
# 清理iOS构建
cd ios
rm -rf build
pod deintegrate
pod install
cd ..

# 重新构建
npx react-native run-ios
```

### 4. 端口被占用

```bash
# 查找占用端口的进程
lsof -i :8081

# 杀死进程
kill -9 <PID>

# 或使用不同端口
npx react-native start --port 8088
```

### 5. 依赖问题

```bash
# 重新安装依赖
rm -rf node_modules
rm package-lock.json
npm install

# 或使用yarn
npm install -g yarn
yarn install
```

### 6. 签名问题

```bash
# 查看APK签名信息
keytool -printcert -jarfile app-release.apk

# 验证签名
jarsigner -verify -verbose -certs app-release.apk
```

---

## 性能优化

### 1. APK大小优化

编辑 `android/app/build.gradle`:
```gradle
android {
    ...
    defaultConfig {
        ...
        ndk {
            abiFilters 'armeabi-v7a', 'arm64-v8a' // 只包含需要的架构
        }
    }
}
```

### 2. 启用ProGuard

编辑 `android/app/build.gradle`:
```gradle
android {
    ...
    buildTypes {
        release {
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
        }
    }
}
```

### 3. 启用Hermes引擎

编辑 `android/app/build.gradle`:
```gradle
project.ext.react = [
    enableHermes: true
]
```

---

## 自动化部署

### 使用GitHub Actions

创建 `.github/workflows/deploy.yml`:
```yaml
name: Build and Deploy

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm install
    
    - name: Build APK
      run: |
        cd android
        ./gradlew assembleRelease
    
    - name: Upload APK
      uses: actions/upload-artifact@v2
      with:
        name: app-release
        path: android/app/build/outputs/apk/release/app-release.apk
```

---

## 总结

1. **开发阶段**: 使用 `npx react-native run-android` 运行调试版本
2. **测试阶段**: 生成签名APK进行测试
3. **发布阶段**: 上传到应用商店或分发服务器
4. **维护阶段**: 监控用户反馈,持续更新

项目已包含完整的业务代码,按照上述步骤即可完成部署和发布!
