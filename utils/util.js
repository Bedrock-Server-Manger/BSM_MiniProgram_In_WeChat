const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function Ab2Str(arraybuffer){
  return decodeURIComponent(escape(String.fromCharCode.apply(null,new Uint8Array(arraybuffer))))
}

var a=false
function UDPsocket(o){
    this.r = false
    this.UDPi = wx.createUDPSocket()
    if(this.UDPi==null) wx.showToast({title: '暂不支持',icon:"none"})
    else {
      
      if(typeof(o)=="function") o()
    }

  this.bind=()=>this.UDPi.bind()

  this._send_recv =(data,addr,timeout,out)=>{
    this.UDPi.send(
      {
        address: addr[0],
        port: addr[1],
        message: data
      }
    )
    var r=false
    var msgt=new Promise((resolve,reject)=>{
        this.UDPi.onMessage((res)=>{
          let data=JSON.parse(String(Ab2Str(res.message)))
          r=true
          resolve(data)
      })
      setTimeout(()=>{reject()},timeout)
    })
    return msgt
  }
  this.send_recv=(data,addr,cbo)=>{
    var w=this._send_recv(data,addr,1000,cbo)
    w.then((v)=>{
      cbo.success(v)
    }).catch(()=>{
      cbo.fail()
    })
  }
}
const toast=(msg)=>{
  return wx.showToast({title: msg,icon:"none"})
}

module.exports = {
  formatTime: formatTime,
  Ab2Str: Ab2Str,
  UDPsocket:UDPsocket,
  toast:toast
}
