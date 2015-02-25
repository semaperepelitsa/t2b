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

function fetchMMRWeb(name, callback) {
  var req = new XMLHttpRequest()
  req.open("GET", "http://dota2toplist.com/search?q=" + encodeURIComponent(name))
  req.setRequestHeader('Accept', "text/html")
  req.addEventListener("load", function(){
    if (req.status == 200) {
      var parser = new DOMParser()
      var html = parser.parseFromString(req.responseText, "text/html")
      var cols = html.querySelectorAll(".table tbody tr:first-child td")
      if (cols.length > 0) {
        var realname = cols[0].textContent
        var href = "http://dota2toplist.com" + cols[0].querySelector("a").getAttribute("href")
        if (name === realname) {
          callback({
            name: realname,
            href:  href,
            solo:  cols[1].textContent,
            party: cols[2].textContent
          })
        } else {
          callback({})
        }
      } else {
        callback({})
      }
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
