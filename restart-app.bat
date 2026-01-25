@echo off
chcp 65001 > nul
echo ========================================
echo    Ai Talk 快速重启脚本 v2.0
echo ========================================
echo.

echo [1/4] 停止旧进程...
taskkill /F /IM ai-talk.exe >nul 2>&1
if %errorlevel% equ 0 (
    echo     [OK] 已停止旧进程
) else (
    echo     [INFO] 未找到运行中的进程（正常）
)

echo.
echo [2/4] 等待 2 秒...
timeout /t 2 >nul

echo.
echo [3/4] 删除旧的可执行文件...
if exist "src-tauri\target\release\ai-talk.exe" (
    del /F "src-tauri\target\release\ai-talk.exe" >nul 2>&1
    if %errorlevel% equ 0 (
        echo     [OK] 已删除旧文件
    ) else (
        echo     [WARN] 删除失败
    )
) else (
    echo     [INFO] 未找到旧文件（正常）
)

echo.
echo [4/4] 重新构建应用...
echo     正在编译 Rust 代码...
call npm run tauri:build

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo     [OK] 构建成功！
    echo.
    echo     启动应用...
    cd src-tauri\target\release
    start "" "ai-talk.exe"
    echo     [OK] 应用已启动
    echo.
    echo ========================================
    echo.
    echo     完成！新的应用已经启动。
    echo.
    echo     检查要点：
    echo       - 窗口应该显示完整的界面
    echo       - 右上角应该有关闭按钮（X）
    echo       - 左侧应该有所有 AI 按钮
    echo       - 按任意按钮应该有反应
    echo.
    echo     如果仍有问题：
    echo       - 按 F12 打开开发者工具查看错误
    echo       - 查看文档：README-TAURI-START.md
) else (
    echo.
    echo ========================================
    echo     [ERROR] 构建失败
    echo.
    echo     请查看上方的错误信息
    echo.
    echo     常见问题：
    echo       - 依赖未安装：运行 npm install
    echo       - 端口被占用：关闭其他应用
    echo       - 文件被占用：重启电脑
    echo.
)

echo.
echo ========================================
pause
