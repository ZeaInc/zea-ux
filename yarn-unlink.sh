rm -r node_modules/@zeainc/zea-engine
rm -r node_modules/@zeainc/zea-collab

# now reinstall. Adding one package adds the others.
yarn add @zeainc/zea-engine
yarn add @zeainc/zea-collab
