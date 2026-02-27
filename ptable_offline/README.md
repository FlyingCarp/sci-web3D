# Ptable 离线版

这是 ptable.com 元素周期表的离线版本。

## 使用方法

### 方法 1: 使用 Python 内置服务器

```bash
cd ptable_offline
python server.py
```

### 方法 2: 手动启动服务器

```bash
cd ptable_offline
python -m http.server 8000
```

然后在浏览器中打开: http://localhost:8000

## 注意事项

1. 由于浏览器安全限制，无法直接通过 file:// 协议打开 index.html，需要使用 HTTP 服务器。
2. 本离线版仅限个人学习和教育用途，不可商业使用或公开分发。
3. 所有数据和内容版权归 ptable.com 所有。

## 文件结构

```
ptable_offline/
├── index.html          # 主页面
├── server.py           # 本地服务器脚本
├── JSON/               # JSON 数据文件
│   ├── properties-*.json
│   ├── compounds.json
│   └── isotope/        # 同位素数据 (1-118)
├── js/                 # JavaScript 文件
├── css/                # CSS 样式文件
├── icon/               # 图标文件
├── Images/             # 图片文件
└── wiki/en/A/          # 维基百科内容
```

## 生成日期

本离线版由 Ptable Scraper 自动生成。
