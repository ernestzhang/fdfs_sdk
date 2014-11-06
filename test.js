'use strict';
var hdfs = require("fdfs_sdk");
var fs = require("fs");


hdfs.connectSvr({host:"172.18.81.219" , port:22122} , function(err){

            if(err)
            {
                console.log("connect error:%s" , err);
            }
            else
            {
                 //支持本地文件和Buffer两种模式
                 var file = "/home/psd/FastDFS_v4.06.tar";
                 hdfs.uploadFile(file , 'tar',  function (err ,res){
                         if(err)
                            console.log(err);
                         else
                         {
                             console.log("file upload ok , groupname:%s  file_name:%s" , res.group_name , res.file_name);

                             //下载文件
                             var groupname = res.group_name ;
                             var filename =  res.file_name  ;
                             var filesize = 0;
                             var fd = fs.openSync('fastdfs.tar', 'w+');
                             hdfs.downloadFile(groupname, filename, function (err, data) {
                                 if (err) {
                                     console.log(err);
                                 }
                                 else
                                 {
                                     fs.writeSync(fd, data.data, 0, data.data.length);
                                     filesize += data.data.length;
                                     if (data.end)//下载完毕
                                     {
                                         console.log("file download ok , size:%d" , filesize);
                                         fs.close(fd);

                                         //删除文件
                                         hdfs.deleteFile(res.group_name , res.file_name, function(err){
                                             if(err)
                                             {
                                                 console.log("delete file err:%s" , err);
                                             }
                                             else
                                             {
                                                 console.log("delete file ok!!");
                                             }
                                             hdfs.close();
                                         }) ;//end delete
                                     }


                                 }

                             });//end download
                         }

                 });//end upload

            }

});

