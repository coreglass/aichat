@echo off
chcp 65001 > nul
echo ========================================
echo    Ai Talk - Tauri 版本构建脚本
echo ========================================
echo.

:: 检查是否安装了必要的工具
echo [1/5] 检查环境...
where cargo >nul 2>nul
if %errorlevel% neq 0 (
    echo 错误: 未找到 Rust/Cargo。请从 https://www.rust-lang.org/tools/install 安装。
    pause
    exit /b 1
)

where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo 错误: 未找到 npm/Node.js。请从 https://nodejs.org/ 下载安装。
    pause
    exit /b 1
)

echo ✓ Rust 和 Node.js 已安装
echo.

:: 安装依赖
echo [2/5] 安装依赖...
call npm install
if %errorlevel% neq 0 (
    echo 错误: 依赖安装失败
    pause
    exit /b 1
)

echo ✓ 依赖安装完成
echo.

:: 构建前端
echo [3/5] 构建前端资源...
call npm run build
if %errorlevel% neq 0 (
    echo 错误: 前端构建失败
    pause
    exit /b 1
)

echo ✓ 前端构建完成
echo.

:: 构建 Tauri 应用
echo [4/5] 构建 Tauri 应用...
echo 这可能需要几分钟时间，请耐心等待...
call npm run tauri:build
if %errorlevel% neq 0 (
    echo 错误: Tauri 构建失败
    pause
    exit /b 1
)

echo ✓ Tauri 构建完成
echo.

:: 显示构建结果
echo [5/5] 查找构建产物...
echo.
echo ========================================
echo    构建成功！
echo ========================================
echo.
echo 构建产物位置:
echo   - src-tauri\target\release\bundle\nsis\
echo.
echo 安装程序文件名类似:
echo   - Ai Talk_1.0.2_x64-setup.exe
echo.
echo ========================================

:: 打开构建目录
if exist "src-tauri\target\release\bundle\nsis" (
    explorer "src-tauri\target\release\bundle\nsis"
) else (
    echo 警告: 未找到构建目录
)

echo.
echo 按任意键退出...
pause >nul
