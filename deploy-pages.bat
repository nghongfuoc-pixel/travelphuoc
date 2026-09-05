@echo off
setlocal

echo ============================================
echo   Deploy len Cloudflare Pages
echo ============================================
npx wrangler pages deploy . --project-name travelphuoc-pages
if errorlevel 1 (
  echo.
  echo Deploy that bai. Xem loi o tren roi thu lai.
  pause
  exit /b 1
)

echo.
echo ============================================
echo   Dat secret OPENWEATHER_API_KEY cho project nay
echo   (se duoc hoi nhap gia tri key - dan key that
echo    tu OpenWeatherMap vao roi bam Enter)
echo ============================================
npx wrangler pages secret put OPENWEATHER_API_KEY --project-name travelphuoc-pages

echo.
echo ============================================
echo   Hoan tat! Truy cap: https://travelphuoc-pages.pages.dev
echo ============================================
pause
