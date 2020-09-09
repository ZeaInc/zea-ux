mkdir -p testing-e2e/libs/zea-ux
ln -fs $PWD/dist/ ./testing-e2e/libs/zea-ux/

yarn run es-dev-server -r testing-e2e
