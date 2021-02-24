// miniprogram/pages/user/user.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},    //存储用户数据
    isAuth: false    //判断是否授权成功
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSetting({
      success: res => {
        console.log(res)
        //授权成功，获取用户信息
        if(res.authSetting['scope.userInfo']){
          console.log(222)
          wx.getUserInfo({
            success: e =>{
              console.log(e)
              this.setData({
                userInfo: e.userInfo,
                isAuth: true
              })
            }
          })
        }
      }
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  //获取用户信息
  getUserInfo: function(e){
    console.log(e)

    //点击授权，获取用户信息
    if(e.detail.userInfo){
      console.log(111)
    
    this.setData({
      userInfo: e.detail.userInfo,
      isAuth: true
    })
  }
}

})