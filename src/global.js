function fetchMMR(name, callback) {
  if (name === "The Great Cornholio") {
    console.log("jk", name)
    callback({
      name: "The Great Cornholio",
      solo: "6K for sure",
      href: "http://www.dotabuff.com/topics/2015-02-07-great-cornholio-show-us-your-main-account-mmr"
    })
  }

  var key = "fetchMMR-3/" + name
  var exist = localStorage[key]
  if (exist) {
    console.log("found", name)
    callback(JSON.parse(exist))
  } else {
    console.log("miss", name)
    fetchMMRWeb(name, function(data){
      localStorage[key] = JSON.stringify(data)
      callback(data)
    })
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
        if (name === realname) {
          callback({
            name: realname,
            href:  "http://dota2toplist.com" + cols[0].querySelector("a").href,
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
  req.send()
}

function handleMessage(event) {
  console.log(event)
  if (event.name == "fetchMMR") {
    fetchMMR(event.message.name, function(data){
      if (!data.solo) { return }
      event.target.page.dispatchMessage("newMMR", data)
    })
  }
}

safari.application.addEventListener("message", handleMessage)
