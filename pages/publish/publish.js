let app = getApp();
let currDate = new Date();
let date_s = [currDate.getFullYear(), currDate.getMonth() + 1, currDate.getDate()].join('-');
let time_s = [(currDate.getHours() >= 10 ? '' : '0') + currDate.getHours(), (currDate.getMinutes() >= 10 ? '' : '0') + currDate.getMinutes()].join(':');
Page({
  data: {
    tabIndex: 0,
    formData: {
      date: date_s,
      time: time_s,
      gender: true,//男为true(1)女为false(0)
      publish_type: 0,//发布的类型，0=人找车，1=车找人
      people_num: 6//默认6人
    }
  },
  // 人找车<>车找人 标签页切换
  toggleTab: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    app.withOpenid(function (openid) {
      app.requestWithAppletId({
        url: app.globalData.apiPath + '/api/user/setUser',
        data: {openid},
        success: function (resp) {
          const is_verify = resp.data.data.is_verify;
          if (!is_verify) {
            //提示请认证
            console.log('请认证');
            wx.showModal({
              title: '未认证',
              content: '请先进行认证',
              success: function (resp) {
                if (resp.confirm) {
                  //跳转到认证页面
                  wx.navigateTo({
                    url:'/pages/verify/verify'
                  });
                }
              }
            });
          } else {
            // 设置数据
            //同时切换发布类型
            that.data.formData.publish_type = index;
            that.setData({
              formData: that.data.formData,
              tabIndex: index
            });
          }
        }
      });
    });
  },
  // 修改性别
  genderChange: function (e) {
    let that = this;
    that.data.formData.gender = e.currentTarget.dataset.value;
    that.setData({
      formData: that.data.formData
    });
  },
  // 日期选择
  bindDateChange: function (e) {
    let that = this;
    that.data.formData.date = e.detail.value;
    that.setData({
      formData: that.data.formData
    });
    
  },
  // 时间选择
  bindTimeChange: function (e) {
    let that = this;
    that.data.formData.time = e.detail.value;
    that.setData({
      formData: that.data.formData
    });
  },
  // 通用表单输入处理器
  formInput: function (e) {
    const that = this;
    const key = e.currentTarget.dataset.key;
    const value = e.detail.value;
    that.data.formData[key] = value;
    that.setData({
      formData: that.data.formData
    });
  },
  //选择地址
  chooseLocation: function (e) {
    let that = this;
    const key = e.currentTarget.dataset.key;
    console.log('Key', key);
    wx.chooseLocation({
      success: function (resp) {
        let addr = resp.address + resp.name;
        that.data.formData[key] = addr;
        that.setData({
          formData: that.data.formData
        });
      },
      fail: function () {
        app.resetAuth();
      }
    });
  },
  
  // 执行发布信息
  publish: function () {
    let that = this;
    app.loadingWrapper(function () {
      app.withOpenid(function (openid) {
        let sendData = that.data.formData;
        sendData.openid = openid;
        app.requestWithAppletId({
          url: app.globalData.apiPath + '/api/publish/add',
          data: sendData,
          success: function (resp) {
            console.log(resp);
          }
        });
      });
    });
  }
});
