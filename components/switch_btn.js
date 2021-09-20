Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    title: {
      type: String,
      value: 'default',
    },
    value: {
      type: Boolean,
      value: false
    }

  },
  data: {
  },
  methods: {
    // 这里是一个自定义方法
    change: function () { 
      console.log(this.data)
      this.setData({
        value: !this.data.value
      })
    }
  }
})