#!/bin/bash

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "========================================"
echo "   Ai Talk - Tauri 版本构建脚本"
echo "========================================"
echo ""

# 检查环境
echo "[1/5] 检查环境..."

if ! command -v cargo &> /dev/null; then
    echo -e "${RED}错误: 未找到 Rust/Cargo${NC}"
    echo "请从 https://www.rust-lang.org/tools/install 安装"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${RED}错误: 未找到 npm/Node.js${NC}"
    echo "请从 https://nodejs.org/ 下载安装"
    exit 1
fi

echo -e "${GREEN}✓${NC} Rust 和 Node.js 已安装"
echo ""

# 安装依赖
echo "[2/5] 安装依赖..."
if ! npm install; then
    echo -e "${RED}错误: 依赖安装失败${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} 依赖安装完成"
echo ""

# 构建前端
echo "[3/5] 构建前端资源..."
if ! npm run build; then
    echo -e "${RED}错误: 前端构建失败${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} 前端构建完成"
echo ""

# 构建 Tauri 应用
echo "[4/5] 构建 Tauri 应用..."
echo -e "${YELLOW}这可能需要几分钟时间，请耐心等待...${NC}"
if ! npm run tauri:build; then
    echo -e "${RED}错误: Tauri 构建失败${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} Tauri 构建完成"
echo ""

# 显示构建结果
echo "[5/5] 查找构建产物..."
echo ""
echo "========================================"
echo -e "${GREEN}   构建成功！${NC}"
echo "========================================"
echo ""

# 检测操作系统
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "构建产物位置:"
    echo "  - src-tauri/target/release/bundle/appimage/"
    echo "  - src-tauri/target/release/bundle/deb/"
    echo ""
    echo "AppImage 文件名类似:"
    echo "  - ai-talk_1.0.2_amd64.AppImage"
    echo ""
elif [[ "$OSTYPE" == "darwin"* ]]; then
    echo "构建产物位置:"
    echo "  - src-tauri/target/release/bundle/dmg/"
    echo ""
    echo "DMG 文件名类似:"
    echo "  - Ai Talk_1.0.2_x64.dmg"
    echo ""
fi

echo "========================================"
echo ""
echo -e "${GREEN}构建完成！${NC}"
