#!/bin/bash
NODE_HOME=/opt/nodejs/v10.15.1
export PATH=$NODE_HOME/bin:$PATH
export NODE_PATH=$NODE_HOME/lib/node_modules
node -v
npm -v
ls -al
# npm i --registry=http://172.172.178.31:4873
# npm i --registry=https://registry.npm.taobao.org
npm i
rm package-lock.json -f
pwd
npm run build