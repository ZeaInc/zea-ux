mkdir -p testing-e2e/libs/zea-ux
ln -fs $PWD/dist/ ./testing-e2e/libs/zea-ux/

mkdir -p testing-e2e/libs/zea-engine
ln -fs $PWD/node_modules/@zeainc/zea-engine/dist/ ./testing-e2e/libs/zea-engine/

yarn run es-dev-server -r testing-e2e
