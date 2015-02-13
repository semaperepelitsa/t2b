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
      safrome.sendMessage({ _message: "fetchMMR", name: playerName }, handleMessage)
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
  safrome.prepareSendMessage()
  requestAllMMR()
}
