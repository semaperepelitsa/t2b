function sendMessage(data, callback){
  chrome.runtime.sendMessage(data, callback)
}

var callbacksSafari = {}

function prepareSendMessage() {
  safari.self.addEventListener("message", function(event){
    var callback = callbacksSafari[event.name]
    delete callbacksSafari[event.name]
    callback(event.message)
  })
}

function sendMessageSafari(data, callback){
  var id = Math.random().toString()
  callbacksSafari[id] = callback
  safari.self.tab.dispatchMessage(id, data)
}

function onMessage(callback) {
  chrome.runtime.onMessage.addListener(callback)
}

function onMessageSafari(callback) {
  safari.application.addEventListener("message", function (event) {
    callback(event.message, null, function(data){
      event.target.page.dispatchMessage(event.name, data)
    })
  })
}

if (typeof safari !== "undefined") {
  window.safrome = {
    sendMessage: sendMessageSafari,
    onMessage: onMessageSafari,
    prepareSendMessage: prepareSendMessage,
  }
} else {
  window.safrome = {
    sendMessage: sendMessage,
    onMessage: onMessage,
    prepareSendMessage: function(){},
  }
}
