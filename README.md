# Smart Calculator - 多功能智能计算器

<div align="center">
  <img src="public/calculator.svg" alt="Smart Calculator Logo" width="120" height="120">
  
  <h3>一个功能强大的在线计算器</h3>
  <p>支持基础运算、科学计算、财务计算和单位换算</p>
  
  [在线演示](#) | [功能特性](#功能特性) | [快速开始](#快速开始) | [部署指南](#部署指南)
</div>

---

## ✨ 功能特性

### 🔢 基础计算器
- ✅ 四则运算（加、减、乘、除）
- ✅ 百分比计算
- ✅ 小数运算
- ✅ 括号运算
- ✅ 表达式计算

### 🔬 科学计算器（开发中）
- ⏳ 三角函数（sin、cos、tan）
- ⏳ 对数运算（log、ln）
- ⏳ 指数运算（x²、x³、xⁿ）
- ⏳ 根号运算（√、∛）
- ⏳ 常量（π、e）

### 💰 财务计算器（开发中）
- ⏳ 房贷计算（等额本息/等额本金）
- ⏳ 复利计算
- ⏳ 投资回报率（ROI）
- ⏳ 贷款利息计算

### 📏 单位换算（开发中）
- ⏳ 长度、重量、温度
- ⏳ 面积、体积
- ⏳ 货币换算（可选）

### 🎯 特色功能
- ✅ 历史记录（LocalStorage 持久化）
- ✅ 键盘快捷键支持
- ✅ 一键复制结果
- ✅ 响应式设计（手机/平板/桌面）
- ⏳ 暗色/亮色主题切换

---

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm >= 7.0.0

### 本地开发

```bash
# 1. 克隆项目
git clone https://github.com/YOUR_USERNAME/smart-calculator.git
cd smart-calculator

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev

# 4. 在浏览器中打开
# 默认地址: http://localhost:3000
```

### 构建生产版本

```bash
# 构建项目
npm run build

# 预览构建结果
npm run preview
```

---

## 📦 部署指南

本项目支持双平台部署：

### 🥇 方案一：Vercel 部署（推荐）

#### 为什么选择 Vercel？
- ✅ 访问速度快（CDN节点多，国内访问友好）
- ✅ 构建速度快（增量构建、智能缓存）
- ✅ 自动 HTTPS
- ✅ 自动预览环境（每个分支都有预览链接）
- ✅ 一键回滚

#### 部署步骤

**方式 1：通过 Vercel 网站部署（推荐）**

1. 访问 [vercel.com](https://vercel.com)
2. 使用 GitHub 账号登录
3. 点击 "New Project"
4. 导入你的 GitHub 仓库
5. Vercel 会自动识别 Vue 项目配置
6. 点击 "Deploy"
7. 等待部署完成（约1-2分钟）
8. 访问分配的域名：`https://你的项目名.vercel.app`

**方式 2：通过命令行部署**

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录 Vercel
vercel login

# 部署到生产环境
vercel --prod
```

**配置自定义域名（可选）**

1. 在 Vercel 项目设置中添加域名
2. 在域名服务商处配置 CNAME 记录指向 `cname.vercel-dns.com`
3. 等待 DNS 生效（通常几分钟到几小时）

---

### 🥈 方案二：GitHub Pages 部署（备份）

#### 为什么选择 GitHub Pages？
- ✅ 完全免费，无流量限制
- ✅ 与 GitHub 仓库无缝集成
- ✅ 稳定可靠（GitHub 官方维护）

#### 部署步骤

**自动部署（推荐）**

项目已配置 GitHub Actions 自动部署，只需：

1. 将代码推送到 GitHub 仓库的 `main` 或 `master` 分支
2. GitHub Actions 会自动构建并部署到 GitHub Pages
3. 访问地址：`https://你的用户名.github.io/smart-calculator/`

**手动部署**

```bash
# 安装 gh-pages 工具
npm install -D gh-pages

# 构建并部署
npm run deploy:github
```

**配置 GitHub Pages**

1. 进入 GitHub 仓库的 Settings → Pages
2. Source 选择 "GitHub Actions"
3. 等待部署完成

---

### 🔄 双平台部署架构

```
┌─────────────────┐
│   GitHub 仓库   │
│  (代码托管)     │
└────────┬────────┘
         │
         ├──────────────┐
         │              │
         ▼              ▼
┌─────────────┐  ┌──────────────┐
│   Vercel    │  │ GitHub Pages │
│  (主访问)   │  │   (备份)     │
└─────────────┘  └──────────────┘
     ▲                  ▲
     │                  │
┌────┴────┐      ┌─────┴─────┐
│用户访问  │      │ 备份访问  │
│(快速)    │      │ (稳定)    │
└─────────┘      └───────────┘
```

---

## ⌨️ 键盘快捷键

| 按键 | 功能 |
|------|------|
| `0-9` | 输入数字 |
| `+` `-` `*` `/` | 输入运算符 |
| `.` | 小数点 |
| `Enter` 或 `=` | 计算结果 |
| `Escape` | 清除所有 |
| `Backspace` | 退格删除 |
| `(` `)` | 括号 |
| `%` | 百分比 |

---

## 🛠️ 技术栈

- **前端框架**: Vue 3 (Composition API)
- **构建工具**: Vite 5
- **样式方案**: Tailwind CSS
- **状态管理**: Pinia
- **数学计算**: Math.js + Decimal.js
- **部署平台**: Vercel + GitHub Pages

---

## 📁 项目结构

```
smart-calculator/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions 部署配置
├── public/
│   └── calculator.svg          # 网站图标
├── src/
│   ├── components/
│   │   └── BasicCalculator.vue # 基础计算器组件
│   ├── composables/
│   │   ├── useCalculator.js    # 计算器逻辑
│   │   ├── useHistory.js       # 历史记录管理
│   │   ├── useKeyboard.js      # 键盘快捷键
│   │   └── useClipboard.js     # 剪贴板操作
│   ├── App.vue                 # 根组件
│   ├── main.js                 # 应用入口
│   └── style.css               # 全局样式
├── index.html                  # HTML 模板
├── vite.config.js              # Vite 配置
├── vercel.json                 # Vercel 部署配置
├── tailwind.config.js          # Tailwind 配置
├── package.json                # 项目依赖
└── README.md                   # 项目文档
```

---

## 🔧 开发指南

### 添加新的计算器类型

1. 在 `src/components/` 下创建新组件
2. 在 `src/composables/` 下添加相关逻辑
3. 在 `src/App.vue` 中添加标签切换
4. 更新路由配置

### 自定义样式

编辑 `src/style.css` 和 `tailwind.config.js` 文件。

### 添加新功能

参考现有的 `useCalculator.js` 和 `useHistory.js`，创建新的组合式函数。

---

## 📝 更新日志

### v1.0.0 (2025-03-07)
- ✅ 初始版本发布
- ✅ 基础计算器功能
- ✅ 历史记录功能
- ✅ 键盘快捷键支持
- ✅ 双平台部署配置

---

## 🤝 贡献指南

欢迎贡献代码、报告问题或提出建议！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

---

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

---

## 🙏 致谢

- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [Vite](https://vitejs.dev/) - 下一代前端构建工具
- [Math.js](https://mathjs.org/) - 广泛的数学运算库
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的 CSS 框架
- [Vercel](https://vercel.com/) - 部署平台
- [GitHub Pages](https://pages.github.com/) - 静态网站托管

---

<div align="center">
  <p>如果这个项目对你有帮助，请给一个 ⭐️ Star!</p>
  <p>Made with ❤️ by Smart Calculator Team</p>
</div>