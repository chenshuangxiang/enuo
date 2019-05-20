// pages/orderDetails/index.js
import {showToastFunc} from "../../utils/util";

var utils = require('../../utils/util.js');

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [{ //商品列表
      id: 2,
      img: 'https://wx.yogalt.com/file/images/img1.jpeg',
      name: "榴恋草莓蛋糕-2磅188元/138元/4磅298元（深圳）",
      spec: "2磅，+19.9元得水果（中盒）…",
      price: 999.00,
      num: 2,
      select: false,
    },
    {
      id: 3,
      img: 'https://wx.yogalt.com/file/images/img1.jpeg',
      name: "榴恋草莓蛋糕-2磅188元/138元/4磅298元（深圳）",
      spec: "2磅，+19.9元得水果（中盒）…",
      price: 999.01,
      num: 1,
      select: false
    }],
      animationData: {},
    address:null,
    data:null,
      loading: false,
      postImgSrc:'https://t10.baidu.com/it/u=3702882126,3600342519&fm=76'
  },
    lower:function(e){
        console.log(e)
        this.getList()
    },
    onPullDownRefresh: function() {
      console.log('触发下拉')
        // 用户触发了下拉刷新操作

        // 拉取新数据重新渲染界面

        // wx.stopPullDownRefresh() // 可以停止当前页面的下拉刷新。

    },
  selectChild:function(e){
    console.log(e)
    console.log(e.currentTarget.dataset.tid);
    console.log(e.timeStamp)
  },
    buttontap:function () {
    var elthis = this;
      this.setData({
          loading: true
      })
        setTimeout(function () {
            /*wx.showToast({ // 显示Toast
                title: '已发送',
                icon: 'success',
                duration: 1500
            });*/
            app.showToast('已发送aaa','success','1500')
            elthis.setData({
             loading: false
            })
        },1500);
    },
    pay:function () {
        wx.requestPayment({
            'timeStamp': '',
            'nonceStr': '',
            'package': '',
            'signType': 'MD5',
            'paySign': '',
            'success':function(res){
            },
            'fail':function(res){
            }
        })
    },
    postImg:function () {
    var elthis = this;
        wx.chooseImage({
            success(res) {
                const tempFilePaths = res.tempFilePaths
                elthis.setData({
                    postImgSrc:tempFilePaths[0]
                })
                wx.uploadFile({
                    url: 'https://example.weixin.qq.com/upload', // 仅为示例，非真实的接口地址
                    filePath: tempFilePaths[0],
                    name: 'file',
                    formData: {
                        user: 'test'
                    },
                    success(res) {
                        const data = res.data
                        // do something
                    }
                })
            }
        })
    },
    showMusic:function () {

      /*  wx.playBackgroundAudio({
            dataUrl: 'https://www.enuo120.com/hosAdminRe/hudiexiu.mp3',
            title: '蝴蝶秀',
            coverImgUrl: 'https://t10.baidu.com/it/u=3702882126,3600342519&fm=76'
        })*/
        const back=wx.getBackgroundAudioManager();
        back.src ="http://fs.w.kugou.com/201905111730/63be77c4e274fdd690330edfd22119f3/G160/M05/04/1B/4A0DAFzS1SiAYrJxAByeJiM6QNU565.mp3";
        back.title="天天音乐";
        back.coverImgUrl ="https://t10.baidu.com/it/u=3702882126,3600342519&fm=76";
        back.play();
        back.onPlay(()=>{
            console.log("音乐播放开始");
        })
        back.onEnded(()=>{
            console.log("音乐播放结束");
        })
    },
    readPhoto:function () {
        wx.previewImage({
            current: '', // 当前显示图片的http链接
            urls: ['https://avatar.csdn.net/F/C/E/3_emdd2016.jpg','https://t11.baidu.com/it/u=1813554778,3781788195&fm=76','https://t10.baidu.com/it/u=3702882126,3600342519&fm=76'] // 需要预览的图片http链接列表
        })
    },
    sao:function () {
        app.showModal('','这是体顺的名字',false,'取消','#000000','确定','#576B95',function () {});
        wx.scanCode({
            success(res) {
                var content = res.result;
                app.showModal('标题','这是体顺的名字',false,'取消','#000000','确定','#576B95',function (res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                })
               /* wx.showModal({
                    title: '',
                    content: content,
                    showCancel:false,
                    success(res) {
                        if (res.confirm) {
                            console.log('用户点击确定')
                        } else if (res.cancel) {
                            console.log('用户点击取消')
                        }
                    }
                })*/
            }
        })
    },
    phonecall:function () {
        wx.makePhoneCall({
            phoneNumber: '15314805417' // 仅为示例，并非真实的电话号码
        })
    },
    zhen:function () {
        wx.vibrateLong({
            success(res) {
               // alert(res)
            }
        })
    },
    animate(){
        const animation = wx.createAnimation({
            duration: 1000,
            timingFunction: 'ease',
        })

        this.animation = animation

        animation.scale(2, 2).rotate(45).step()

        this.setData({
            animationData: animation.export()
        })

        /*setTimeout(function () {
            animation.translate(30).step()
            this.setData({
                animationData: animation.export()
            })
        }.bind(this), 1000)*/
        setTimeout(function () {
            this.rotateThenScale();
        }.bind(this), 3000)
    },
    //animate
    rotateAndScale() {
        // 旋转同时放大
        this.animation.rotate(45).scale(2, 2).step()
        this.setData({
            animationData: this.animation.export()
        })
    },
    rotateThenScale() {
        // 先旋转后放大
        this.animation.rotate(75).step()
        this.animation.scale(1, 2).step()
        this.animation.rotate3d(90, 90,90,90).step()
        this.setData({
            animationData: this.animation.export()
        })
    },
    rotateAndScaleThenTranslate() {
        // 先旋转同时放大，然后平移
        this.animation.rotate(75).scale(3, 2).step()
        this.animation.translate(100, 100).step({duration: 1000})
        this.setData({
            animationData: this.animation.export()
        })
    },
    getuserinfo:function (e) {
        console.log(e)
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      wx.showModal({
          title: '标题',
          content: '告知当前状态，信息和解决方法',
          confirmText: '主操作',
          cancelText: '次要操作',
          success: function(res) {
              if (res.confirm) {
                  console.log('用户点击主操作')
              } else if (res.cancel) {
                  console.log('用户点击次要操作')
              }
          }
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
      var result = utils.chengVal(4);
      console.log('外部导入方法的值'+result)
     // console.log('外部导入方法的时间'+utils.formatTime(new Date()))
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      //address: app.globalData.userInfo.address
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})