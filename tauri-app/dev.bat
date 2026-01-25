@echo off
chcp 65001 > nul
echo ========================================
echo    Ai Talk - 开发模式启动
echo ========================================
echo.

:: 检查环境
where cargo >nul 2>nul
if %errorlevel% neq 0 (
    echo 错误: 未找到 Rust/Cargo
    pause
    exit /b 1
)

where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo 错误: 未找到 npm/Node.js
    pause
    exit /b 1
)

echo 环境检查通过
echo.
echo 启动开发模式...
echo 提示: 修改文件后会自动重新加载
echo.
echo 按 Ctrl+C 停止开发服务器
echo.

call npm run tauri:dev
