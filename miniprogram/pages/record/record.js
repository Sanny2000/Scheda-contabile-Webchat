// miniprogram/pages/record/record.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookTitle: [
      {
        title: "支出",
        type: "zhichu",
        isAct: true
      },
      {
        title: "收入",
        type: "shouru",
        isAct: false
      }
    ],
    // 轮播的二维数组
    bannerArr: [],
    //账户选择的数据
  accountType:[
    {
      title:"现金",
      type:"xianjin",
      isAct:true
    },
    {
      title:"微信钱包",
      type:"wechat",
      isAct:false
    },
    {
      title:"支付宝",
      type:"zhifubao",
      isAct:false
    },
    {
      title:"储蓄卡",
      type:"chuxuka",
      isAct:false
    },
    {
      title:"信用卡",
      type:"xinyongka",
      isAct:false
    },
  ],
  //轮播的二维数组
  bannerArr:[

  ],
  info:{
    date:"",
    money:"",
    comment:""
  } 
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getToday();
    this.getBookIcon();

  },
//监听页面显示
onShow: function(){
  console.log("页面显示")
  if(this.data.isFristShow){
    console.log("首次进入")
    this.data.isFristShow = false;
  }else{
    console.log("再次进入页面")
    this.resetMsgData(); //数据恢复
  }
},

  // 记账图标标题的点击事件
  titleSelect: function(e){
    // 事件对象
    console.log(e)
    // 获取当前点击的标题对应的下标
    var index = e.currentTarget.dataset.index;
    console.log(index)

    //获取当前修改的数据名称
    var name = e.currentTarget.dataset.name;
    console.log(name)
    console.log(this.data.accountType)
    // 判断当前点击的标题是否已激活， 如果是激活状态，则终止代码
    if(this.data[name][index].isAct){
      console.log("当前已激活");
      return; // 终止代码，以下代码不执行
    }

    // 取消上一个激活的标题状态
    for(var i = 0; i < this.data[name].length; i++){
      if(this.data[name][i].isAct){
        this.data[name][i].isAct = false;
        break;  // 终止循环
      }
    }

    // 设置当前点击的标题为激活状态
    this.data[name][index].isAct = true;

    console.log(this.data[name])
    // 如果是页面绑定的数据，则一定要用setData重新赋值
    this.setData({
      [name]: this.data[name]
    })

  },
  getToday: function(){
    
    // 实例化时间
    var time = new Date();
    console.log(time)

    // 获取年份
    var y = time.getFullYear();
    console.log(y)

    // 获取月份  程序的月份是从0开始的，所以真实的月份需加一
    var m = time.getMonth() + 1;
    console.log(this.addZero(m))

    // 获取日
    var d = time.getDate();
    console.log(d)
    this.data.info.date = y + "-" + this.addZero(m) + "-" + this.addZero(d)
    // 修改data的数据
    this.setData({
      today: y + "-" + this.addZero(m) + "-" + this.addZero(d),
      info: this.data.info
    })

    console.log(this.data.today)

  },
  // 补零函数
  addZero: function(num){
    return num < 10 ? "0"+num : num ;

  },
  //获取轮播图标
  getBookIcon: function(){
//调用加载框
wx.showLoading({
  title:'正在加载'
})
//调用云函数get_book_icon_type
    wx.cloud.callFunction({
      name:"get_book_icon_type",
      success:res => {
        console.log("成功",res)

        //关闭加载框
        wx.hideLoading();

        // 接受返回数据
        var data = res.result.data;
        console.log(data)

        //添加激活字段 isAct
        data.forEach(function(v,i){
          //console.log(v,i)
          v.isAct = false;
        })

        // 开始截取下标
        var beginIndex = 0;

        while(beginIndex < data.length){
          var tmp = data.slice(beginIndex,beginIndex+8);
          console.log(tmp)
          beginIndex += 8;

          this.data.bannerArr.push(tmp)
        }
        console.log(this.data.bannerArr)
        this.setData({
          bannerArr: this.data.bannerArr
        })
      },
      fail: err => {
        console.log("失败",err)
      }
    })
  },
 //轮播图标的点击事件
bannerSelect:function(e){
  //console.log(e)

  //获取数据的第一层下标
  var index = e.currentTarget.dataset.index;

  //获取数据的第二层下标
  var id = e.currentTarget.dataset.id;
  console.log(index,id)

  //判断当前点击的图标是否是激活状态，如果是则取消激活
  if(this.data.bannerArr[index][id].isAct){

    this.data.bannerArr[index][id].isAct = false;
  }else{
    //将上一个激活的图标取消激活
    for(var i=0;i<this.data.bannerArr.length;i++){
      for(var j=0; j<this.data.bannerArr[i].length;j++){
        if(this.data.bannerArr[i][j].isAct){
          this.data.bannerArr[i][j].isAct = false;
          break; //找到就终止循环
        }
      }
    }
    //将点击的图标激活
    this.data.bannerArr[index][id].isAct = true;
  }

  //数据页面响应
  this.setData({
    bannerArr:this.data.bannerArr
  })
},
//用户输入的信息
getInfoData:function(e){
  console.log(e)

  //获取要修改的数据名称
  var type = e.currentTarget.dataset.type;

  this.data.info[type] = e.detail.value;

  //数据响应
  this.setData({
    info:this.data.info
  })

  console.log(this.data.info)
},
//将数据传到数据库上
addMsgData:function(){
  //存放用户选择填写的数据
  var msgData = {};

  //获取轮播标题的数据
  for(var i = 0; i < this.data.bookTitle.length; i++){
    if(this.data.bookTitle[i].isAct){
      msgData.cost = this.data.bookTitle[i].title;
      msgData.costType = this.data.bookTitle[i].type;
      break;
    }
  }

  //判断轮播图标是否有被选择，如果没有则终止代码，提醒用户进行选择
  var isBanner = false;

  //获取激活的轮播图标数据
  for(var i = 0; i < this.data.bannerArr.length; i++){
    for(var j=0; j<this.data.bannerArr[i].length;j++){
      if(this.data.bannerArr[i][j].isAct){
        msgData.iconUrl = this.data.bannerArr[i][j].icon_url;
        msgData.iconTitle = this.data.bannerArr[i][j].title;
        msgData.iconType = this.data.bannerArr[i][j].type
        isBanner = true;//条件成立则说明图标有被激活
        break;//找到就终止循环
      }
    }
  }

  if(!isBanner){
    //console.log("当前图标未激活")
    wx.showToast({
      title:'请选择记账类型',
      icon:'none',
      duration:2000
    })
    return; //终止代码，数据不提交
  }

  //获取账户选择数据
  for(var i = 0; i < this.data.accountType.length;i++){
    if(this.data.accountType[i].isAct){
      msgData.accountTitle = this.data.accountType[i].title;
      msgData.accountType = this.data.accountType[i].type;
      break;
    }
  }

  //判断金额是否为空
  if(this.data.info.money == ""){
    wx.showToast({
      title:'请输入金额',
      icon:'none',
      duration:2000
    })
    return;
  }
  //获取info的数据
  for(var key in this.data.info){
      console.log(key)
      msgData[key] = this.data.info[key]
  }
  //获取info的数据
  for(var key in this.data.info){
    console.log(key)
    msgData[key] = this.data.info[key]
  }
  wx.showLoading({
    title: '正在保存',
  })
  //调用云函数，添加数据
  wx.cloud.callFunction({
    name: "add_msg_data", //云函数名称
    data: msgData,
    success:res => {
      console.log("成功==>",res)

      //关闭加载框
      wx.hideLoading();
      wx.showToast({
        title: '保存成功',
        icon:'success',
        duration: 2000
      })
      //数据恢复
      this.resetMsgData();
    },
    fail: err => {
      console.log("失败==>",err)
    }
  })
  console.log(msgData)
},
//数据恢复
resetMsgData: function(){

  //重置轮播标题
  this.data.bookTitle[0].isAct=true;
  this.data.bookTitle[1].isAct=false;

  //重置轮播图标，取消激活
  for(var i = 0; i < this.data.bannerArr.length; i++){
    for(var j = 0; j < this.data.bannerArr[i].length; j++){
      if(this.data.bannerArr[i][j].isAct){
        this.data.bannerArr[i][j].isAct = false;
        break; //找到就终止循环
      }
    }
  }

  //重置账户选择
  this.data.accountType[0].isAct = true;
  for(var i = 1; i < this.data.accountType.length; i++){
    this.data.accountType[i].isAct = false;
  }

//数据响应
this.setData({
  bookTitle: this.data.bookTitle,
  bannerArr:this.data.bannerArr,
  accountType: this.data.accountType,
  info:{
    date:this.data.today,
    money:"",
    comment:""
  }
})
}
  })