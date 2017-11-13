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
      gender: true//男为true(1)女为false(0)
    }
  },
  // 人找车<>车找人 标签页切换
  toggleTab: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    //同时切换发布类型
    that.data.formData.publish_type = index;
    that.setData({
      formData: that.data.formData,
      tabIndex: index
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
  formInput:function  (e) {
    console.log(e);
  },
  // 执行发布信息
  publish:function  () {
    let that=this;
    console.log(that.data.formData);
  }
});
