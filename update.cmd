@ECHO OFF

REM This is a comment line.

@REM Listing all the files in the directory Program files 
set /p Build=<version.txt
git add . && git commit -m "Version changed to %Build%" && npm run build
