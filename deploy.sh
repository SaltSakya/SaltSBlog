#!/user/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
yarn docs:build

# 进入生成的文件夹
cd docs/.vuepress/dist

# git 初始化、暂存、提交
git init
git add -A
git commit -m "deploy at $(date +%Y/%m/%d %H:%M)"

# 推送发布
git push -f git@github.com:SaltSakya/SaltSakya.github.io.git master

cd -

read -p "按任意键继续..."