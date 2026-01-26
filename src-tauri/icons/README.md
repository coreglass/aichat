# Icons Directory

This directory should contain application icons for different platforms.

For Windows, you need:
- icon.ico (Windows icon)

For macOS, you need:
- icon.icns (macOS icon)

For Linux, you need:
- 32x32.png
- 128x128.png
- 128x128@2x.png
- icon.png

You can generate icons from a PNG file using online tools or the Tauri CLI:

```bash
npm run tauri icon path/to/your/logo.png
```

This will automatically generate all required icon formats.
