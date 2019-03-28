npx webpack --config ./FE/config/client.js --mode production
npx typescript --build ./BE
cp -R ./BE/queries ./BE/dist/queries
npx pkg . --options expose-gc --out-path ./build/
rm -rf ./BE/dist