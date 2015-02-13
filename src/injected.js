function prepareSendMessage() {
  safari.self.addEventListener("message", function(event){
    var callback = callbacksSafari[event.name]
    delete callbacksSafari[event.name]
    callback(event.message)
  })
}

var callbacksSafari = {}

function sendMessage(data, callback){
  chrome.runtime.sendMessage(data, callback)
}

function sendMessageSafari(data, callback){
  var id = Math.random().toString()
  callbacksSafari[id] = callback
  safari.self.tab.dispatchMessage(id, data)
}

if (typeof safari !== "undefined") {
  sendMessage = sendMessageSafari
} else {
  prepareSendMessage = function(){}
}
// ----

var players = {}

function requestAllMMR() {
  var playerTags = document.querySelectorAll(".comment-player")
  for (var i = 0; i < playerTags.length; ++i) {
    var playerTag = playerTags[i]
    var playerName = playerTag.querySelector("a").textContent

    if(players[playerName]) {
      players[playerName].push(playerTag)
    } else {
      players[playerName] = []
      players[playerName].push(playerTag)
      sendMessage({ _message: "fetchMMR", name: playerName }, handleMessage)
    }
  }
}

function handleMessage(data) {
  console.log(data.name, data.solo)

  if (!data.solo) { return }
  var playerTags = players[data.name]
  playerTags.forEach(function(playerTag){
    var soloTag = document.createElement("a")
    if (data.href) {
      soloTag.href = data.href
    }
    soloTag.className = "t2b-rank"
    soloTag.textContent = data.solo

    playerTag.insertAdjacentElement("afterend", soloTag)
  })
}

if (window.top === window) {
  console.log("injected")
  prepareSendMessage()
  requestAllMMR()
}
