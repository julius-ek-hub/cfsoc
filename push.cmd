@ECHO OFF

set /p Build=<version.txt
git add . && git commit -m "Version changed to %Build%" && git push && npm run build
