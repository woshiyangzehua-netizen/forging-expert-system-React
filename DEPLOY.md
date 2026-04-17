# 部署到 Vercel 指南

## 方法一：通过 Vercel CLI 部署（推荐）

### 1. 安装 Vercel CLI

```bash
npm i -g vercel
```

### 2. 登录 Vercel

```bash
vercel login
```
按提示完成登录。

### 3. 进入项目目录并部署

```bash
cd forging-expert-system
vercel --prod
```

首次部署时会询问一些问题：
- `Set up and deploy "~/forging-expert-system"?` → 输入 `Y`
- `Which scope do you want to deploy to?` → 选择你的账号
- `Link to existing project?` → 输入 `N`（创建新项目）
- `What's your project name?` → 输入 `forging-expert-system`
- `In which directory is your code located?` → 直接回车（当前目录）

等待部署完成，会输出类似：
```
🔍  Inspect: https://vercel.com/yourname/forging-expert-system/xxxxx
✅  Production: https://forging-expert-system.vercel.app
```

---

## 方法二：通过 GitHub 自动部署

### 1. 创建 GitHub 仓库

在 GitHub 上创建一个新仓库，例如 `forging-expert-system`。

### 2. 推送代码到 GitHub

```bash
cd forging-expert-system
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/你的用户名/forging-expert-system.git
git push -u origin main
```

### 3. 在 Vercel 导入项目

1. 访问 https://vercel.com/new
2. 点击 "Import Git Repository"
3. 选择你的 `forging-expert-system` 仓库
4. 项目配置保持默认即可：
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. 点击 "Deploy"

等待部署完成，Vercel 会自动分配一个 `.vercel.app` 域名。

---

## 方法三：直接上传（最简单）

### 1. 构建项目

```bash
cd forging-expert-system
npm install
npm run build
```

### 2. 使用 Vercel 网页上传

1. 访问 https://vercel.com/new
2. 选择 "Import Git Repository" 下方的 "Upload" 选项
3. 将 `dist` 文件夹压缩成 zip 文件并上传
4. 项目配置：
   - **Framework Preset**: Other
   - **Build Command**: 留空
   - **Output Directory**: `./`
5. 点击 "Deploy"

---

## 自定义域名（可选）

部署完成后，可以在 Vercel 控制台设置自定义域名：

1. 进入项目设置 → Domains
2. 点击 "Add"
3. 输入你的域名（如 `forge.yourdomain.com`）
4. 按提示配置 DNS 记录

---

## 项目结构

```
forging-expert-system/
├── src/
│   ├── components/     # React 组件
│   ├── data/          # 规则库和案例数据
│   ├── lib/           # 专家系统核心逻辑
│   ├── types/         # TypeScript 类型定义
│   ├── App.tsx        # 主应用组件
│   └── main.tsx       # 入口文件
├── dist/              # 构建输出（Vercel部署用）
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── vercel.json        # Vercel 配置
```

---

## 常见问题

### Q: 部署失败，提示 "Build Failed"

A: 检查以下几点：
1. Node.js 版本是否 >= 18
2. 是否运行了 `npm install`
3. 检查 Vercel 的 Build Command 是否为 `npm run build`
4. 检查 Output Directory 是否为 `dist`

### Q: 页面空白或 404

A: 确保 `vercel.json` 文件存在且内容正确：
```json
{
  "version": 2,
  "name": "forging-expert-system",
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ]
}
```

### Q: 如何更新部署？

A: 
- **CLI方式**: 修改代码后再次运行 `vercel --prod`
- **GitHub方式**: 推送代码到 GitHub，Vercel 会自动重新部署

---

## 需要帮助？

- Vercel 文档: https://vercel.com/docs
- 项目 Issues: https://github.com/你的用户名/forging-expert-system/issues
