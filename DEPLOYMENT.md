# 🚀 快速部署指南

本文档提供 Smart Calculator 项目的详细部署步骤，帮助你快速将项目部署到公网。

---

## 📋 部署前准备

### 1. 创建 GitHub 仓库

```bash
# 1. 在 GitHub 网站上创建新仓库
# 仓库名: smart-calculator
# 访问: https://github.com/new

# 2. 初始化本地 Git 仓库
cd smart-calculator
git init
git add .
git commit -m "Initial commit: Smart Calculator project"

# 3. 连接远程仓库
git remote add origin https://github.com/YOUR_USERNAME/smart-calculator.git
git branch -M main
git push -u origin main
```

---

## 🥇 方案一：Vercel 部署（主要访问）

### 步骤 1：注册 Vercel 账号

1. 访问 [vercel.com](https://vercel.com)
2. 点击 "Sign Up"
3. 选择 "Continue with GitHub"
4. 授权 Vercel 访问你的 GitHub 账号

### 步骤 2：导入项目

1. 登录 Vercel 后，点击 "Add New..." → "Project"
2. 在 "Import Git Repository" 中找到你的 `smart-calculator` 仓库
3. 点击 "Import"

### 步骤 3：配置项目

Vercel 会自动检测到 Vue 项目，默认配置即可：

- **Framework Preset**: Vue.js
- **Root Directory**: ./
- **Build Command**: npm run build
- **Output Directory**: dist
- **Install Command**: npm install

点击 "Deploy" 开始部署。

### 步骤 4：等待部署完成

- 部署通常需要 1-3 分钟
- 看到 "🎉 Congratulations!" 表示部署成功
- 点击 "Continue to Dashboard"

### 步骤 5：获取访问地址

在项目面板中，你会看到：

```
Production: https://smart-calculator-xxx.vercel.app
```

这就是你的公网访问地址！

### 步骤 6：配置自定义域名（可选）

如果你想使用自己的域名：

1. 在项目面板中点击 "Settings"
2. 左侧菜单选择 "Domains"
3. 输入你的域名（如 `calculator.yourdomain.com`）
4. 点击 "Add"
5. 在你的域名服务商处配置 DNS：

```
类型: CNAME
名称: calculator
值: cname.vercel-dns.com
```

6. 等待 DNS 生效（通常几分钟到几小时）

---

## 🥈 方案二：GitHub Pages 部署（备份访问）

### 步骤 1：启用 GitHub Pages

1. 进入你的 GitHub 仓库
2. 点击 "Settings" 标签
3. 左侧菜单找到 "Pages"
4. 在 "Source" 下选择 "GitHub Actions"
5. 保存

### 步骤 2：自动部署

当你推送代码到 `main` 或 `master` 分支时，GitHub Actions 会自动：

1. 检出代码
2. 安装依赖
3. 构建项目
4. 部署到 GitHub Pages

### 步骤 3：查看部署状态

1. 进入仓库的 "Actions" 标签
2. 查看 "Deploy to GitHub Pages" 工作流
3. 等待部署完成（绿色勾表示成功）

### 步骤 4：获取访问地址

部署成功后，访问地址为：

```
https://YOUR_USERNAME.github.io/smart-calculator/
```

在 "Settings" → "Pages" 中也可以看到访问地址。

---

## 🔄 后续更新流程

### 更新代码并部署

```bash
# 1. 修改代码后提交
git add .
git commit -m "Update: 添加新功能"
git push

# 2. 自动部署
# - Vercel: 自动检测推送，立即开始部署（约1分钟）
# - GitHub Pages: GitHub Actions 自动触发部署（约2-3分钟）
```

### 查看部署历史

**Vercel:**
1. 进入项目面板
2. 点击 "Deployments" 标签
3. 查看所有历史部署记录
4. 可以一键回滚到任意版本

**GitHub Pages:**
1. 进入仓库的 "Actions" 标签
2. 查看所有工作流运行记录
3. 点击具体运行记录查看详细日志

---

## 🐛 常见问题解决

### Vercel 部署失败

**问题：Build failed**

```bash
# 检查本地构建是否成功
npm run build

# 如果本地构建成功，但 Vercel 失败：
# 1. 检查 Node.js 版本（在 vercel.json 中指定）
# 2. 检查依赖版本是否兼容
# 3. 查看 Vercel 部署日志获取详细错误信息
```

**问题：404 Not Found**

```bash
# 确认 vercel.json 配置正确
# 确认 vite.config.js 中没有设置 base（或设置为 '/'）
```

### GitHub Pages 部署失败

**问题：GitHub Actions 失败**

1. 进入 "Actions" 标签查看错误日志
2. 常见原因：
   - Node.js 版本不匹配
   - 依赖安装失败
   - 构建命令错误

**问题：页面显示空白或样式丢失**

```javascript
// 检查 vite.config.js
// 确保设置了正确的 base
export default defineConfig({
  base: '/smart-calculator/', // GitHub Pages 需要仓库名
  // ...
})
```

### 访问速度慢

**Vercel 访问慢：**
- Vercel CDN 在国内访问速度较快
- 如果仍然慢，考虑配置自定义域名并使用国内 CDN

**GitHub Pages 访问慢：**
- 正常现象，GitHub Pages 国内访问速度较慢
- 建议主要使用 Vercel 访问，GitHub Pages 作为备份

---

## 📊 性能优化建议

### 1. 启用 Gzip 压缩

Vercel 和 GitHub Pages 默认已启用 Gzip 压缩。

### 2. 图片优化

```bash
# 使用 WebP 格式
# 压缩图片大小
# 使用 CDN 加速静态资源
```

### 3. 代码分割

项目已配置代码分割：

```javascript
// vite.config.js
manualChunks: {
  'vendor': ['vue', 'vue-router', 'pinia'],
  'math': ['mathjs', 'decimal.js']
}
```

### 4. 缓存策略

Vercel 和 GitHub Pages 都有自动缓存配置。

---

## 🎯 生产环境检查清单

部署前确认：

- [ ] 代码已推送到 GitHub
- [ ] Vercel 项目已创建并部署成功
- [ ] GitHub Pages 已启用并部署成功
- [ ] 访问地址可以正常访问
- [ ] 所有功能正常工作
- [ ] 移动端适配正常
- [ ] 键盘快捷键正常
- [ ] 历史记录功能正常
- [ ] 复制功能正常

---

## 📞 获取帮助

如果遇到问题：

1. 查看部署平台的错误日志
2. 检查本地构建是否成功
3. 参考 README.md 中的常见问题
4. 在 GitHub Issues 中搜索或提问

---

## 🎉 部署成功！

恭喜！你的 Smart Calculator 现在可以通过以下地址访问：

- **主要地址（Vercel）**: `https://smart-calculator-xxx.vercel.app`
- **备份地址（GitHub Pages）**: `https://YOUR_USERNAME.github.io/smart-calculator/`

分享给朋友开始使用吧！🎊