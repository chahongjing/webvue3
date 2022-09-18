import axios from '@/common/axios.js';
import SparkMD5 from "spark-md5";

/**
 * code
 * 1: 成功
 * 2失败
 * 3上传文件
 * 4上传分片失败
 */
var fileService = {
    unit1Mb: 1024 * 1024,
    async uploadFileList(uploadResult) {
        for(var i = 0; i < uploadResult.fileList.length; i++) {
            await this.uploadFile(uploadResult, uploadResult.fileList[i])
        }
    },
    async uploadFile(uploadResult, objFile) {
        uploadResult.progress = 0
        objFile.type = 1
        var file = objFile.file
        if(file.size < 3 * this.unit1Mb) {
            return await this.uploadSimple(objFile)
        } else {
            var param = {
                file: file,
                fileName: file.name,
                chunkSize: this.unit1Mb * 2,
                chunks: Math.ceil(file.size / (this.unit1Mb * 2)),
                chunk: 0,
                fileId: null,
                fileMd5: null,
                size: file.size
            }
            // 超过10mb的大文件只校验前2mb和后2mb
            if(param.size > 10 * this.unit1Mb) {
                return await this.uploadByHeadTailMd5(uploadResult, objFile, param)
            } else {
                // 小文件校验整个文件的md5
                return await this.uploadByMd5(uploadResult, objFile, param)
            }
        }
    },
    async uploadSimple(objFile) {
        var formData = new FormData();
        formData.append("myfile", objFile.file);
        return await axios.post('/file/upload', formData).then(function (resp) {
            if (resp.data.status == ResultStatus.OK.value) {
                objFile.data = resp.data.value[0]
                objFile.type = 2
                return {code: 1}
            } else {
                return {code: 2, msg: resp.data.msg}
            }
        });
    },
    async uploadByMd5(uploadResult, objFile, param) {
        var me = this
        // 小文件直接获取整个文件的md5值
        var md5 = await me.getMd5(param.file);
        param.fileMd5 = md5;
        var uParam = {md5: param.fileMd5, headMd5: param.headMd5, tailMd5: param.tailMd5, fileName:param.fileName, size:param.size, chunks: param.chunks, chunkSize:param.chunkSize, showMsg:false}
        var res = await axios.get('/file/checkFileMd5', uParam).then(function(resp) {
            if(resp.data && resp.data.value) {
                param.fileId = resp.data.value.id;
                param.chunk = resp.data.value.chunk;
            }
            if(resp.data.status === ResultStatus.OK.value && resp.data.value.exists) {
                // 文件已存在
                objFile.data = resp.data.value
                objFile.type = 2
                return {code: 1}
            } else if(resp.data.status === ResultStatus.NO.value) {
                // 没有上传过，开始切片上传
                return {code: 3}
            }
        })
        if(res.code == 1) {
            return res
        } else {
            return me.uploadSliceList(uploadResult, objFile, param);
        }
    },
    async uploadByHeadTailMd5(uploadResult, objFile, param) {
        var me = this
        // 大文件获取md5值较慢，校验前2mb，后2mb两个md5和后台数据对比
        param.headMd5 = await me.getMd5(me.getBlobSlice().call(param.file, 0, param.chunkSize));
        param.tailMd5 = await me.getMd5(me.getBlobSlice().call(param.file, param.size - param.chunkSize, param.size))
        var uParam = {md5: param.fileMd5, headMd5: param.headMd5, tailMd5: param.tailMd5, fileName:param.fileName, size:param.size, chunks: param.chunks, chunkSize:param.chunkSize, showMsg:false}
        var res = await axios.get('/file/checkFileMd5', uParam).then(function(resp) {
            if(resp.data && resp.data.value) {
                param.fileId = resp.data.value.id;
                param.chunk = resp.data.value.chunk;
            }
            if(resp.data.status === ResultStatus.OK.value && resp.data.value.exists) {
                // 文件已存在
                objFile.data = resp.data.value
                objFile.type = 2
                return {code:1}
            } else if(resp.data.status === ResultStatus.NO.value) {
                // 没有上传过，开始切片上传
                return {code:3}
            }
        })
        if(res.code == 1) {
            return res
        } else {
            return me.uploadSliceList(uploadResult, objFile, param);
        }
    },
    async uploadSliceList(uploadResult, objFile, param) {
        var me = this
        for(var i = param.chunk; i < param.chunks; i++) {
            var start = i * param.chunkSize
            var end = ((start + param.chunkSize) >= param.size) ? param.size : start + param.chunkSize;
            var chunkFile = me.getBlobSlice().call(param.file, start, end);
            var md5 = await me.getMd5(chunkFile)
            var uParam = {fileMd5: param.fileMd5, fileHeadMd5: param.headMd5, fileTailMd5: param.tailMd5, fileId: param.fileId, md5: md5,size: param.chunkSize,chunk:param.chunk,showMsg:false}
            var res = await axios.get('/file/checkSliceMd5', uParam).then(function(resp) {
                if(resp.data.status === ResultStatus.OK.value) {
                    return {code:1}
                } else if(resp.data.status === ResultStatus.NO.value) {
                    return {code:4}
                }
            })
            if(res.code == 1) {
                param.chunk++
                uploadResult.progress = Math.floor((param.chunk / param.chunks) * 100);
                continue
            }
            res = await me.uploadSlice(chunkFile, param, md5, start, end)
            if(res.code == 1) {
                param.chunk++
                uploadResult.progress = Math.floor((param.chunk / param.chunks) * 100);
            } else {
                return res
            }
        }
        // 上传完成，可以合并文件
        return await this.mergeSliceFile(objFile, param.fileId, param.fileMd5, param.fileName, param.headMd5, param.tailMd5, param.chunkSize);
    },
    async uploadSlice(chunkFile, param, md5, start, end) {
        var formData = new FormData();
        formData.append("sliceFile", chunkFile);
        formData.append("md5", md5);
        formData.append("chunkSize", chunkFile.size);
        formData.append("chunk", param.chunk);

        formData.append("fileName", param.fileName);
        formData.append("fileMd5", param.fileMd5 || '');
        formData.append("fileId", param.fileId);
        formData.append("fileHeadMd5", param.headMd5 || '');
        formData.append("fileTailMd5", param.tailMd5 || '');
        formData.append("chunks", param.chunks);
        formData.append("size", end - start);
        return await axios.post('/file/uploadSlice', formData).then(function(resp) {
            if(resp.data.status === ResultStatus.OK.value) {
                return {code:1}
            } else {
                return {code: 4}
            }
        })
    },
    async mergeSliceFile(objFile, fileId, fileMd5, fileName, headMd5, tailMd5, chunkSize) {
        var param = {
            id: fileId,
            fileName: fileName,
            md5: fileMd5,
            headMd5: headMd5,
            tailMd5: tailMd5,
            chunkSize: chunkSize
        }
        return await axios.get('/file/mergeSliceFile', param).then(function(resp) {
            if(resp.data.status === ResultStatus.OK.value){
                objFile.data = resp.data.value
                objFile.type = 2
                return {code:1}
            } else if(resp.data.status === ResultStatus.NO.value) {
                return {code:2}
            }
        })
    },
    async getMd5(file) {
        var me = this
        return new Promise((resolve) => {
            var fileReader = new FileReader()
            fileReader.onload = function (e) {
                var spark = me.getSpark()
                spark.append(e.target.result);
                resolve(spark.end())
            }
            fileReader.readAsArrayBuffer(file);
        })
    },
    getBlobSlice: function() {
        return File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice
    },
    getSpark: function() {
        return new SparkMD5.ArrayBuffer()
    },
}

export default fileService