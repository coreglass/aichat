@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo.
echo ========================================
echo    Ai Talk 快速重启脚本 v1.1
echo ========================================
echo.
echo [1/4] 停止旧进程...
taskkill /F /IM ai-talk.exe 2>nul
if %errorlevel% equ 0 (
    echo     [✓] 已停止旧进程
) else (
    echo     [ℹ] 未找到运行中的进程（正常）
)

echo.
timeout /t 2 /nobreak

echo [2/4] 等待文件释放...
timeout /t 2 /nobreak

echo [3/4] 删除旧的可执行文件...
if exist "src-tauri\target\release\ai-talk.exe" (
    del /F /Q "src-tauri\target\release\ai-talk.exe"
    if %errorlevel% equ 0 (
        echo     [✓] 已删除旧文件
    ) else (
        echo     [✗] 删除失败
    )
) else (
    echo     [ℹ] 未找到旧文件（正常）
)

echo.
timeout /t 1 /nobreak

echo [4/4] 重新构建应用...
echo     正在编译 Rust 代码...
call npm run tauri:build

if %errorlevel% equ 0 (
    echo     [✓] 构建成功！
    echo.
    echo ========================================
    echo.
    echo     [5/4] 启动应用...
    cd src-tauri\target\release
    start ai-talk.exe
    echo     [✓] 应用已启动
) else (
    echo.
    echo ========================================
    echo     [✗] 构建失败
    echo.
    echo     请查看上方的错误信息
    echo.
    echo     常见问题：
    echo     1. 依赖未安装 - 运行 npm install
    echo     2. 端口被占用 - 关闭其他应用
    echo     3. 文件被占用 - 重启电脑
    echo.
    echo     详细错误信息已保存到控制台
)

echo.
echo ========================================
echo.
if %errorlevel% equ 0 (
    echo     完成！新的应用已经启动。
    echo.
    echo     检查要点：
    echo     - 窗口应该显示完整的界面
    echo     - 右上角应该有关闭按钮（X）
    echo     - 左侧应该有所有 AI 按钮
    echo     - 按任意按钮应该有反应
    echo.
    echo     如果仍有问题：
    echo     - 按 F12 打开开发者工具查看错误
    echo     - 查看文档：Button-Fix-Guide.md
    echo.
    echo     技术支持：https://github.com/Funsiooo/Ai-Talk/issues
)

echo.
pause
