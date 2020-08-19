
mkdir -p testing-e2e/libs/zea-ux 
ln -s $(pwd)/dist ./testing-e2e/libs/zea-ux/dist 

mkdir -p testing-e2e/libs/zea-engine 
ln -s $(pwd)/node_modules/@zeainc/zea-engine/dist ./testing-e2e/libs/zea-engine/dist

yarn run es-dev-server -r testing-e2e

