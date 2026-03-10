# 📚 GitHub 部署完整指南

> 本文档详细说明 Smart Calculator 项目的 GitHub 部署流程和原理

---

## 目录

- [概述](#概述)
- [两种分支的作用](#两种分支的作用)
- [部署流程](#部署流程)
- [命令详解](#命令详解)
- [一键部署](#一键部署)
- [常见问题](#常见问题)

---

## 概述

本项目使用 **GitHub Pages** 进行网站部署，涉及两个独立的 Git 分支：

1. **`master` 分支** - 存放源代码
2. **`gh-pages` 分支** - 存放构建后的网站文件

---

## 两种分支的作用

### 📂 master 分支（源代码仓库）

| 属性 | 说明 |
|------|------|
| **用途** | 存放开发源代码 |
| **内容** | `.vue`, `.js`, `.css`, `package.json` 等 |
| **受众** | 开发者 |
| **目的** | 版本控制、代码备份、团队协作 |

**包含的文件：**
```
smart-calculator/
├── src/              # 源代码
│   ├── components/   # Vue 组件
│   ├── composables/  # 组合式函数
│   ├── utils/        # 工具函数
│   ├── App.vue       # 根组件
│   └── main.js       # 入口文件
├── package.json      # 项目配置
├── vite.config.js    # Vite 配置
└── ...               # 其他配置文件
```

---

### 🌐 gh-pages 分支（网站部署）

| 属性 | 说明 |
|------|------|
| **用途** | 存放构建后的生产代码 |
| **内容** | `index.html`, `assets/*.js`, `assets/*.css` |
| **受众** | 网站访问者 |
| **目的** | GitHub Pages 托管静态网站 |

**包含的文件：**
```
gh-pages/
├── index.html        # 入口 HTML
└── assets/
    ├── index-xxx.js  # 打包后的 JS
    ├── index-xxx.css # 打包后的 CSS
    └── ...
```

---

## 部署流程

### 完整流程图

```
┌─────────────────────────────────────────────────────────┐
│                    开发者工作流程                          │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│  1. 编写/修改代码                                         │
│     - 修改 Vue 组件                                       │
│     - 更新样式文件                                        │
│     - 添加新功能                                          │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│  2. 推送到 master 分支                                    │
│     $ git add .                                          │
│     $ git commit -m "feat: 添加新功能"                    │
│     $ git push origin master                             │
│                                                          │
│     ✅ 源代码已保存到 GitHub                              │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│  3. 构建项目                                              │
│     $ npm run build                                      │
│                                                          │
│     生成 dist/ 文件夹，包含优化后的生产代码                 │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│  4. 部署到 gh-pages 分支                                  │
│     $ npx gh-pages -d dist                               │
│                                                          │
│     将 dist/ 内容推送到 gh-pages 分支                      │
│     ✅ 网站已更新                                         │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│  5. GitHub Pages 自动发布                                 │
│     https://shanggeshihun.github.io/smart-calculator/    │
│                                                          │
│     用户访问网站看到最新内容                                │
└─────────────────────────────────────────────────────────┘
```

---

## 命令详解

### 1. 推送源代码到 master

```bash
# 查看修改状态
git status

# 添加所有修改的文件
git add .

# 提交更改
git commit -m "feat: 添加新功能"

# 推送到 GitHub master 分支
git push origin master
```

**作用：** 保存源代码到 GitHub，便于版本控制和团队协作。

---

### 2. 构建项目

```bash
npm run build
```

**作用：**
- 使用 Vite 编译 Vue 代码
- 压缩 JS、CSS 文件
- 生成 `dist/` 文件夹（生产环境代码）

**输出：**
```
dist/
├── index.html          (1.06 KB)
└── assets/
    ├── index-xxx.js    (37.35 KB)
    ├── index-xxx.css   (30.99 KB)
    ├── vendor-xxx.js   (62.77 KB)
    └── math-xxx.js     (625.85 KB)
```

---

### 3. 部署到 gh-pages

```bash
npx gh-pages -d dist
```

**作用：**
- 创建/更新 `gh-pages` 分支
- 将 `dist/` 文件夹内容推送到该分支
- GitHub Pages 自动发布更新

---

## 一键部署

### 方法 1：使用现有脚本

```bash
npm run deploy:github
```

这个命令会：
1. 构建项目 (`npm run build`)
2. 部署到 gh-pages (`gh-pages -d dist`)

**注意：** 不会推送源代码到 master

---

### 方法 2：完整的部署流程

在 `package.json` 中添加：

```json
{
  "scripts": {
    "deploy:github": "npm run build && gh-pages -d dist",
    "deploy:full": "git add . && git commit -m 'Update' && git push origin master && npm run build && gh-pages -d dist"
  }
}
```

使用：
```bash
npm run deploy:full
```

**效果：**
1. ✅ 提交源代码到 master
2. ✅ 推送到 GitHub
3. ✅ 构建项目
4. ✅ 部署网站到 gh-pages

---

## 常见问题

### Q1: 为什么需要两个分支？

**A:** 分离关注点：
- `master` 存放源代码 → 便于开发、版本控制
- `gh-pages` 存放构建产物 → 便于网站部署、访问

---

### Q2: 只部署不推送源代码会怎样？

**A:** 
- ✅ 网站正常更新
- ❌ GitHub 上看不到源代码更新
- ❌ 无法回滚代码
- ❌ 团队成员无法获取最新代码

---

### Q3: 只推送源代码不部署会怎样？

**A:**
- ✅ GitHub 上代码已更新
- ❌ 网站不会更新
- ❌ 用户看不到新功能

---

### Q4: 如何查看部署是否成功？

**方法 1：检查分支**
```bash
git branch -r
# 应该看到：
#   origin/master
#   origin/gh-pages
```

**方法 2：访问网站**
```
https://shanggeshihun.github.io/smart-calculator/
```

**方法 3：查看 GitHub 仓库设置**
1. 进入仓库 → Settings → Pages
2. Source 应显示 `gh-pages` 分支

---

### Q5: 部署后网站多久更新？

**A:** 通常 1-3 分钟，GitHub Pages 需要：
1. 检测到 gh-pages 分支更新
2. 重新构建和部署
3. CDN 缓存刷新

---

### Q6: 如何回滚到之前的版本？

**回滚源代码：**
```bash
git log --oneline          # 查看提交历史
git reset --hard <commit>  # 回滚到指定版本
git push origin master --force  # 强制推送
```

**回滚网站：**
```bash
# 方法：重新部署旧版本
git checkout <commit>      # 切换到旧版本
npm run build              # 构建
npx gh-pages -d dist       # 部署
git checkout master        # 切回 master
```

---

## 最佳实践

### ✅ 推荐做法

1. **每次发布都推送源代码 + 部署网站**
   ```bash
   npm run deploy:full
   ```

2. **使用语义化提交信息**
   ```bash
   git commit -m "feat: 添加货币换算功能"
   git commit -m "fix: 修复换算页面空白问题"
   git commit -m "docs: 更新部署文档"
   ```

3. **部署前先测试**
   ```bash
   npm run dev      # 本地测试
   npm run build    # 构建测试
   npm run preview  # 预览构建结果
   ```

---

### ❌ 避免的做法

1. **只部署不推送源代码** → 丢失代码历史
2. **直接修改 gh-pages 分支** → 下次部署会被覆盖
3. **忘记构建直接部署** → 部署的是旧版本

---

## 总结

| 操作 | 命令 | 作用 |
|------|------|------|
| 推送源代码 | `git push origin master` | 保存代码历史 |
| 构建项目 | `npm run build` | 生成生产代码 |
| 部署网站 | `npx gh-pages -d dist` | 更新线上网站 |
| 一键部署 | `npm run deploy:full` | 全部完成 |

---

## 相关链接

- 📦 项目地址: https://github.com/shanggeshihun/smart-calculator
- 🌐 网站地址: https://shanggeshihun.github.io/smart-calculator/
- 📖 GitHub Pages 文档: https://docs.github.com/en/pages
- 📘 gh-pages 工具: https://github.com/tschaub/gh-pages

---

*最后更新: 2026年3月*