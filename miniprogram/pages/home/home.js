// miniprogram/pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    today: "",   //当天日期
    dayMsgData:[],
    a:[],
    currentDate: "", //当前选中的日期
    isToday: true,   //判断当前日期是否是当天
    dayCost:{
      zhichu:0,
      shouru:0
    },
    monCost: {
      zhichu: 0,
      shouru: 0
    },
    surplus:{    //月结余
      num:0,      //整数
      decimal:"00"  //小数
    },
    isFristShow: true  //页面首次进入
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 调用函数，获取当天日期
    this.getToday();
    //获取某天日期
    this.getDayMsgData(this.data.today);
    // this.getMonMsgData()
    //获取某天数据
    // console.log(this.data.today.substring(0,7))
    this.getMonMsgData(this.data.today.substring(0,7));

  },
  //生命周期函数，监听页面显示
  onShow: function(){
    if(this.data.isFristShow){
      console.log("首次进入")
      this.data.isFristShow = false;
    }else{
      console.log("再次进入页面")
      //调用函数，获取当天日期
      this.getToday();
      //获取某天数据
      this.getMonMsgData(this.data.today);

      //获取某月数据
       // console.log(this.data.today.substring(0,7))
    this.getMonMsgData(this.data.today.substring(0,7));
    }
  },
  // 获取当天日期
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

    // 修改data的数据
    this.setData({
      today: y + "-" + this.addZero(m) + "-" + this.addZero(d),
      currentDate: m + "月" + d + "日"
    })

    console.log(this.data.today)

  },
  // 补零函数
  addZero: function(num){
    return num < 10 ? "0"+num : num ;

  },
  //获取某天数据
  getDayMsgData: function(time){
    console.log(time)

    //收入与支出累加前需清零
    this.data.dayCost.shouru = 0;
    this.data.dayCost.zhichu = 0;

    //数据加载框
    wx.showLoading({
      title:'正在加载'
    })

    //调用云函数
    wx.cloud.callFunction({
      name:"get_day_msg_data",
      data:{
        date: time
      },
      success:res => {
        console.log("成功==>",res)
        //关闭加载框
        wx.hideLoading();

        //获取数据
        var data = res.result.data;
        console.log(data)

        //数据遍历，累加金额
        data.forEach((v,i) =>{
          // console.log(v,i)
          //v: 当前项 i：下标
          if(v.costType == "zhichu"){
            this.data.dayCost.zhichu += Number(v.money);
          }else{
            this.data.dayCost.shouru += Number(v.money);
          }

          //给money保留两个小数位
          v.money = Number(v.money).toFixed(2)
        })

        this.data.dayCost.zhichu =  this.data.dayCost.zhichu.toFixed(2);
        this.data.dayCost.shouru =  this.data.dayCost.shouru.toFixed(2);
        //判断当前选中的时期是否是当天
        if(time == this.data.today){
          this.data.isToday = true
        }else{
          this.data.isToday = false
        }

        //数据响应
        this.setData({
          dayMsgData: data,
          isToday: this.data.isToday,
          dayCost: this.data.dayCost
        })
        console.log(this.data.dayMsgData)
      },
      fail:err => {
        console.log("失败==>",err)
      }
    })
  },
  //选择日期，获取对应数据
  setDate: function(e){
    console.log(e)
    //获取今年年份
    var year = new Date().getFullYear();
    console.log(year)
    //选中的日期
    var time = e.detail.value;
    console.log(time)
    // split 字符分割，返回的是一个数组
    var timeArr = time.split("-")
    console.log(timeArr)

    if(year == timeArr[0]){
      this.data.currentDate = Number(timeArr[1]) + "月" + Number(timeArr[2]) + "日"
    }else{
      this.data.currentDate = timeArr[0] + "年" + Number(timeArr[1]) + "月" + Number(timeArr[2]) + "日"
    }

    //数据响应
    this.setData({
      currentDate: this.data.currentDate
    })

    //获取对应数据
    this.getDayMsgData(time)
    this.getMonMsgData(time.substring(0,7))
  },
  //获取某月的数据
  getMonMsgData: function(month){
   console.log("当前月份==>", month)
      //收入与支出清零
      this.data.monCost.shouru = 0;
      this.data.monCost.zhichu = 0;

   // 开始时间范围
   var start = month + "-01";
   console.log(start)

   var monArr = month.split("-");
   console.log(monArr)
   // 获取当前月份有多少天
  //  参数一：要查询的年份  参数二：要查询的月份  参数三：固定为0
   var monDay = new Date(monArr[0], monArr[1], 0).getDate(); 
   console.log(monDay)

   var end = month + "-" + monDay;
   console.log(end)

    //调用云函数，获取某月数据
    wx.cloud.callFunction({
      name:"get_mon_msg_data",
      data:{
        startTime: start,
        endTime: end
      },
      success: res =>{
        console.log("获取某月数据成功==>",res)
        var monData = res.result.data;

         // 数据遍历
         monData.forEach(v => {
          if(v.costType == "zhichu"){
            this.data.monCost.zhichu += Number(v.money)
          }else{
            this.data.monCost.shouru += Number(v.money)
          }

        })
        //toFixed() 保留小数点方法
        this.data.monCost.shouru = this.data.monCost.shouru.toFixed(2);
        this.data.monCost.zhichu = this.data.monCost.zhichu.toFixed(2);
        //结余 收入-支出
        var surPlus = (Number(this.data.monCost.shouru) - Number(this.data.monCost.zhichu)).toFixed(2).split(".");

        console.log(surPlus)

        //数据响应
        this.setData({
          monCost: this.data.monCost,
          surplus:{
            num: surPlus[0],
            decimal: surPlus[1]
          }
        })

      },
      fail: err => {
        console.log("获取某月数据失败==>",err)
      }
    })
  }


})