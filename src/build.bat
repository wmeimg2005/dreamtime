:: CLI
cd cli
pyinstaller main.py -y --onedir --name "cli" --distpath "../../dist"

:: GUI
cd ../gui
yarn build

pause