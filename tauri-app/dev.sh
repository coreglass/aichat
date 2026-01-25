#!/bin/bash

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "========================================"
echo "   Ai Talk - 开发模式启动"
echo "========================================"
echo ""

# 检查环境
if ! command -v cargo &> /dev/null; then
    echo -e "${RED}错误: 未找到 Rust/Cargo${NC}"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${RED}错误: 未找到 npm/Node.js${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} 环境检查通过"
echo ""
echo "启动开发模式..."
echo -e "${YELLOW}提示: 修改文件后会自动重新加载${NC}"
echo ""
echo -e "${YELLOW}按 Ctrl+C 停止开发服务器${NC}"
echo ""

npm run tauri:dev
