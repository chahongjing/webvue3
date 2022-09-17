var commonService = {
  mediaType: {
    picture: 1,
    audio: 2,
    video: 3,
    code: 4,
    excel: 5,
    ppt: 6,
    word: 7,
    pdf: 8,
    text: 9,
    zip: 10,
    other: 99
  },
  uploadFileSize: 5, // mb
  pictureSuffix: ['png', 'jpeg', 'gif', 'jpg', 'bmp'],
  audioSuffix: ['mp3'],
  videoSuffix: ['mp4'],
  codeSuffix: ['html', 'htm', 'js', 'css', 'java', 'cs'],
  excelSuffix: ['xls', 'xlsx'],
  pptSuffix: ['ppt', 'pptx'],
  wordSuffix: ['doc', 'docx'],
  pdfSuffix: ['pdf'],
  textSuffix: ['txt', 'log'],
  zipSuffix: ['zip', 'rar', '7z', 'tar', 'gz', 'jar', 'war', 'dmg', 'iso'],
  K: 1024,
  M: 1024 * 1024,
  G: 1024 * 1024 * 1024,
  getPagerInfo: function (pager, callback) {
    pager.callback = callback;
    pager.loading = false;
    return pager;
  },
  getPagerModel: function (pagerId) {
    var pms = sessionStorage.getItem('pagerModel');
    var allModel, model;
    if (pms) {
      allModel = JSON.parse(pms);
    } else {
      allModel = {};
    }
    if(allModel[pagerId]) return allModel[pagerId];
    model = {};
    model.pageNum = 1;
    model.pageSize = 10;
    model.filter = {};
    allModel[pagerId] = model;
    return model;
  },
  setPagerModel: function (pagerId, pagerModel) {
    var pms = sessionStorage.getItem('pagerModel');
    var model;
    if (pms) {
      model = JSON.parse(pms);
    } else {
      model = {};
    }
    model[pagerId] = pagerModel;
    sessionStorage.setItem('pagerModel', JSON.stringify(model));
  },
  clearPagerModel: function (pagerId) {
    if (pagerId) {
      var pms = sessionStorage.getItem('pagerModel');
      if (pms) {
        var obj = JSON.parse(pms);
        delete obj[pagerId];
      }
    } else {
      sessionStorage.removeItem('pagerModel');
    }
  },
  getFileMediaType: function (fileName) {
    var suffix = this.getFileExtension(fileName);
    if (!suffix) return '';
    suffix = suffix.toLowerCase().replace('.', '');
    if (this.pictureSuffix.includes(suffix)) return this.mediaType.picture;
    if (this.audioSuffix.includes(suffix)) return this.mediaType.audio;
    if (this.videoSuffix.includes(suffix)) return this.mediaType.video;
    if (this.codeSuffix.includes(suffix)) return this.mediaType.code;
    if (this.excelSuffix.includes(suffix)) return this.mediaType.excel;
    if (this.pptSuffix.includes(suffix)) return this.mediaType.ppt;
    if (this.wordSuffix.includes(suffix)) return this.mediaType.word;
    if (this.pdfSuffix.includes(suffix)) return this.mediaType.pdf;
    if (this.textSuffix.includes(suffix)) return this.mediaType.text;
    if (this.zipSuffix.includes(suffix)) return this.mediaType.zip;
    return this.mediaType.other;
  },
  getFileFaType: function (fileName) {
    var fileMediaType = this.getFileMediaType(fileName);
    switch (fileMediaType) {
      case this.mediaType.picture: return ['fa-file-image-o', 'c699'];
      case this.mediaType.audio: return ['fa-file-audio-o', 'c71a'];
      case this.mediaType.video: return ['fa-file-video-o', 'c82a'];
      case this.mediaType.code: return ['fa-file-code-o', 'c339'];
      case this.mediaType.excel: return ['fa-file-excel-o', 'c393'];
      case this.mediaType.ppt: return ['fa-file-powerpoint-o', 'cc39'];
      case this.mediaType.word: return ['fa-file-word-o', 'c39c'];
      case this.mediaType.pdf: return ['fa-file-pdf-o' ,'cfc0'];
      case this.mediaType.text: return ['fa-file-text-o'];
      case this.mediaType.zip: return ['fa-file-archive-o', 'c933'];
      default: return ['fa-file-o']
    }
  },
  getFileExtension: function (fileName) {
    if (!fileName || fileName.indexOf(".") == -1) return '';
    var start = fileName.lastIndexOf(".");
    var end = fileName.length;
    return fileName.substring(start, end);
  },
  getFileSize: function(size) {
    if(!size) return '0'
    if(size / this.G >= 1) {
      return ((size / this.G)).toFixed(2) + 'G'
    }
    if(size / this.M >= 1) {
      return ((size / this.M)).toFixed(2) + 'M'
    }
    if(size / this.K >= 1) {
      return ((size / this.K)).toFixed(2) + 'K'
    }
    return size + 'B'
  }
};

export default commonService;
