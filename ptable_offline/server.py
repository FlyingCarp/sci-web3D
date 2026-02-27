#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
本地 HTTP 服务器启动脚本（增强版）
支持从 compounds.json 查询化合物数据

使用方法:
    python server.py
    
然后在浏览器中打开: http://localhost:8000
"""

import http.server
import socketserver
import webbrowser
import os
import json
import urllib.parse

PORT = 8000

# 切换到离线版目录
os.chdir(os.path.dirname(os.path.abspath(__file__)))

# 预加载 compounds.json 数据
COMPOUNDS_DATA = {}
compounds_file = "JSON/compounds.json"
if os.path.exists(compounds_file):
    try:
        with open(compounds_file, 'r', encoding='utf-8') as f:
            COMPOUNDS_DATA = json.load(f)
        print(f"[OK] 已加载化合物数据: {len(COMPOUNDS_DATA)} 个条目")
    except Exception as e:
        print(f"[WARN] 加载 compounds.json 失败: {e}")


class PtableHandler(http.server.SimpleHTTPRequestHandler):
    """自定义请求处理器，支持化合物查询"""
    
    def do_GET(self):
        # 处理化合物查询: /JSON/compounds/formula=H -> 从 compounds.json 读取 "H" 键
        if self.path.startswith('/JSON/compounds/'):
            query = urllib.parse.unquote(self.path.split('/JSON/compounds/')[-1])
            
            # 解析查询
            # /JSON/compounds/DEFAULT -> key = "DEFAULT"
            # /JSON/compounds/formula=H -> key = "H"
            if query.startswith('formula='):
                key = query.replace('formula=', '')
            else:
                key = query
            
            # 从预加载的数据中查找
            if key in COMPOUNDS_DATA:
                data = COMPOUNDS_DATA[key]
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps(data).encode('utf-8'))
                return
            else:
                # 键不存在，返回空对象
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(b'{"matches":[]}')
                return
        
        # 处理 service-worker.js（返回空响应避免错误）
        if self.path == '/service-worker.js':
            self.send_response(200)
            self.send_header('Content-type', 'application/javascript')
            self.end_headers()
            self.wfile.write(b'// Service worker disabled for offline version')
            return
        
        # 处理 manifest 文件
        if self.path.endswith('.webmanifest'):
            self.send_response(200)
            self.send_header('Content-type', 'application/manifest+json')
            self.end_headers()
            manifest = {
                "name": "Ptable Offline",
                "short_name": "Ptable",
                "start_url": "/",
                "display": "standalone"
            }
            self.wfile.write(json.dumps(manifest).encode())
            return
        
        return super().do_GET()
    
    def guess_type(self, path):
        """猜测文件 MIME 类型"""
        if path.endswith('.json'):
            return 'application/json'
        if path.endswith('.svg'):
            return 'image/svg+xml'
        if path.endswith('.webmanifest'):
            return 'application/manifest+json'
        return super().guess_type(path)
    
    def log_message(self, format, *args):
        """自定义日志格式"""
        # 过滤掉成功的请求，只显示错误
        if '404' in str(args) or '500' in str(args):
            super().log_message(format, *args)
        elif '/JSON/compounds/' not in str(args):
            # 显示非化合物请求（化合物请求太多会刷屏）
            super().log_message(format, *args)


# 设置 MIME 类型
PtableHandler.extensions_map.update({
    '.json': 'application/json',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.html': 'text/html',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.webmanifest': 'application/manifest+json',
})

print(f"启动本地服务器: http://localhost:{PORT}")
print("按 Ctrl+C 停止服务器")
print()

# 自动打开浏览器
webbrowser.open(f'http://localhost:{PORT}')

with socketserver.TCPServer(("", PORT), PtableHandler) as httpd:
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n服务器已停止")
