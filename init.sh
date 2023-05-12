echo "此脚本用于初始化 VuePress 及相关依赖，如果已在此计算机进行过初始化，则无需重复操作。"
read -p "是否确定初始化？(y/n):" cmd 

if test "$cmd" == "y"
then
    echo "yes"
else
    echo "No"
    exit
fi

# 下载 yarn
npm install -g yarn

# 将 VuePress 安装为本地依赖
yarn add -D vuepress