var toArray = function(nodeList){ return Array.prototype.slice.call(nodeList,0); }

function fetchMMR(name, callback) {
  if (name === "The Great Cornholio") {
    console.log("jk", name)
    callback({
      name: "The Great Cornholio",
      solo: "over 9000",
      href: "http://www.dotabuff.com/topics/2015-02-16-best-dota-2-player-"
    })
  }

  var key = "fetchMMR-4/" + name
  var exist = sessionStorage[key]
  if (exist) {
    console.log("found", name)
    callback(JSON.parse(exist))
  } else {
    console.log("miss", name)
    fetchMMRWeb(name, function(data){
      if (data) {
        console.log("ok", name, data)
        sessionStorage[key] = JSON.stringify(data)
        callback(data)
      } else {
        console.log("error", name)
        callback({})
      }
    })
    return true // keep connection alive
  }
}

function d2tPlayerMatches(html, name){
  var playerCells = toArray(html.querySelectorAll(".table td.list-player"))
  var playerCellsEqual = playerCells.filter(function(cell){
    return name === cell.textContent
  })
  return playerCellsEqual.length
}

function d2tFirstPlayerData(html) {
  var cols = html.querySelectorAll(".table tbody tr:first-child td")
  var realname = cols[0].textContent
  var href = "http://dota2toplist.com" + cols[0].querySelector("a").getAttribute("href")
  var href = "http://dota2toplist.com" + cols[0].querySelector("a").getAttribute("href")
  return {
    name: cols[0].textContent,
    href:  href,
    solo:  cols[1].textContent,
    party: cols[2].textContent
  }
}

function fetchMMRWeb(name, callback) {
  var req = new XMLHttpRequest()
  var searchURL = "http://dota2toplist.com/search?q=" + encodeURIComponent(name)
  req.open("GET", searchURL)
  req.setRequestHeader('Accept', "text/html")
  req.addEventListener("load", function(){
    if (req.status !== 200) { return }

    var parser = new DOMParser()
    var html = parser.parseFromString(req.responseText, "text/html")
    var playerMatches = d2tPlayerMatches(html, name)

    if (playerMatches == 1) {
      callback(d2tFirstPlayerData(html))
    } else if (playerMatches > 1) {
      callback({ name: name, href: searchURL, solo: "***" })
    } else {
      callback({})
    }
  })
  req.addEventListener("error", function(){
    callback(null)
  })
  req.send()
}

safrome.onMessage(function(request, sender, sendResponse) {
  if (request._message == "fetchMMR") {
    return fetchMMR(request.name, sendResponse)
  }
})
