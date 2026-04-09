@echo off
del package.json
npx -y create-next-app@latest tmp-app --typescript --tailwind --eslint --app --src-dir false --import-alias "@/*" --use-npm
xcopy /E /Y tmp-app\* .
xcopy /E /Y tmp-app\.* .
rmdir /S /Q tmp-app
del setup.bat
