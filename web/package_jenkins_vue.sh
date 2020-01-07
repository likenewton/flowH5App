###!/usr/bin
###描述：jenkins 压缩文件夹专用
###作者：张川
###############
project_path=/root/.jenkins/workspace/$1
project_name=$5
git_branch=$2
git_branch_commitID=$3
package_name=$4



if [  -d "${project_path}" ];then
	
	cd ${project_path}
	rm -rf ${package_name}_*_*
	echo "删除上一次的压缩包"

fi


 if [ ! -d "$project_path/${package_name}_${git_branch}_${git_branch_commitID}/$project_name" ];then
        mkdir   -p  "$project_path/${package_name}_${git_branch}_${git_branch_commitID}/$project_name"
	echo "$project_path/${package_name}_${git_branch}_${git_branch_commitID}/$project_name 创建好了 "      
 fi




#if [ ! -d "$project_path/$project_name" ];then
#       mkdir "$project_path/$project_name"
#     else
#       echo "$project_path/$project_name 已经创建啦"
#      echo "先将之前的文件夹删除，重新创建"
#	rm -rf $project_path/$project_name
#	mkdir "$project_path/$project_name"
#       echo "wechat 文件夹创建好了"     
# fi


cp -r  ${project_path}/web/dist/*  $project_path/${package_name}_${git_branch}_${git_branch_commitID}/$project_name

##将wechat 打gz包。
cd ${project_path}

#tar -czvf ${project_name}.tar.gz   ${project_name}
tar -czvf ${package_name}_${git_branch}_${git_branch_commitID}.tar.gz ${package_name}_${git_branch}_${git_branch_commitID}
