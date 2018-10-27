var accessid = 'LTAICW4ajkAHlmUJ'; // 你阿里云的accessid
var accesskey = 'tZbBFQ0DjG1wXNEuXW1VZBHdyUueIL'; // 你阿里云的accesskey
var host = 'https://tjce-image.oss-cn-beijing.aliyuncs.com'; // 你阿里云的blockname和地区请对应更改

var objectNname = ' ';
var policyText = {
    "expiration": "2020-01-01T12:00:00.000Z", //设置该Policy的失效时间，超过这个失效时间之后，就没有办法通过这个policy上传文件了
    "conditions": [
        ["content-length-range", 0, 2097152] // 设置上传文件的大小限制
    ]
};

var policyBase64 = Base64.encode(JSON.stringify(policyText));
var message = policyBase64;
var bytes = Crypto.HMAC(Crypto.SHA1, message, accesskey, { asBytes: true });
var signature = Crypto.util.bytesToBase64(bytes);
function add0(m) { return m < 10 ? '0' + m : m }
function getNewTime(now) {
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var date = now.getDate();
    var hour = now.getHours();
    var minute = now.getMinutes();
    var second = now.getSeconds();
    var millsecond = now.getMilliseconds()
    return year + '' + add0(month) + '' + add0(date) + '' + add0(hour) + '' + add0(minute) + '' + add0(second) + '' + add0(millsecond);
}

function get_suffix(filename) {
    let pos = filename.lastIndexOf('.')
    let fname = ''
    if (pos != -1) {
        fname = filename.substring(pos)
    }
    return fname
}

function set_upload_param(up, filename, ret) {
    objectNname = '';
    if (filename !== '') {
        var suffix = get_suffix(filename)
        objectNname = getNewTime(new Date()) + 'web' + suffix;
    }
    alert(objectNname)
    var new_multipart_params = {
        'key': objectNname,
        'policy': policyBase64,
        'OSSAccessKeyId': accessid,
        'success_action_status': '200', //让服务端返回200,不然，默认会返回204
        'signature': signature,
    };

    up.setOption({
        'url': host,
        'multipart_params': new_multipart_params
    });
}

var UPLOADER = editor => {
    let uploader = new plupload.Uploader({
        runtimes: 'html5,flash,silverlight,html4',
        browse_button: editor.imgMenuId,
        containerId: editor.toolbarElemId,
        multi_selection: true,
        //flash_swf_url: '../../static/lib/plupload-2.1.2/js/Moxie.swf',
        //silverlight_xap_url: '../../static/lib/plupload-2.1.2/js/Moxie.xap',
        url: host,

        filters: {
            mime_types: [
                //只允许上传图片和zip,rar文件
                {title: 'Image files', extensions: 'jpg,jpeg,gif,png,bmp'}
            ],
            max_file_size: '2097152', //最大只能上传10mb的文件
            prevent_duplicates: false, //不允许选取重复文件
        },

        init: {
            BeforeUpload: function(up, file) {
                set_upload_param(up, file.name, true)
            },

            FilesAdded: function (up, files) {
                //显示添加进来的文件信息
                plupload.each(files, function (file) {
                    console.log('文件名:' + file.name + '文件大小:' + plupload.formatSize(file.size));
                });
                // 文件添加之后，开始执行上传
                uploader.start()
            },

            UploadProgress: function (up, file) {
                alert(file.percent);
            },

            FileUploaded: function(up, file, info) {
                alert('222');
                if (info.status === '200') {
                    var url = host + '/' + objectNname;
                    console.log('上传成功 ', url);
                    // 插入到编辑器中
                    editor.command(null, 'insertHtml', '<img src="' + url + '?x-oss-process=style/img_800_x" style="max-width:100%;"/>');
                }
                else {
                    alert(info.status)
                }
            },

            UploadComplete: function () {
                //队列文件处理完毕后,处理相关的事情
                console.log('on UploadComplete');
            },

            Error: function(up, err) {
                alert(err.message)
            },
        },
    });
    return uploader
};

export {UPLOADER}
