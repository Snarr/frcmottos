function calculate () {
  let alliance1 = [document.getElementById('teamName1').value, document.getElementById('teamName2').value, document.getElementById('teamName3').value]
  let alliance2 = [document.getElementById('teamName4').value, document.getElementById('teamName5').value, document.getElementById('teamName6').value]

  let alliance1OPR = 0
  let alliance2OPR = 0

  let event = document.getElementById('eventKey').value
  let year = document.getElementById('eventYear').value

  let eventKey = year + event.toLowerCase()

  let apiKey = document.getElementById('apiKey').value

  fetch(`https://www.thebluealliance.com/api/v3/event/${eventKey}/oprs?X-TBA-Auth-Key=${apiKey}`)
    .then((resp) => resp.json())
    .then(function (data) {
      console.log('Request succeeded with JSON response', data)
      for (let i = 0; i < alliance1.length; i++) {
        alliance1OPR = alliance1OPR + fetchOPR(data, alliance1[i])
      }
      for (let i = 0; i < alliance2.length; i++) {
        alliance2OPR = alliance2OPR + fetchOPR(data, alliance2[i])
      }
      winner(alliance1OPR / 3, alliance2OPR / 3)
    })
    .catch(function (error) {
      console.log('Request failed', error)
      runError(error)
    })
}

function checkAPI (apiKey) {
  fetch(`https://www.thebluealliance.com/api/v3/status?X-TBA-Auth-Key=${document.getElementById('apiKey').value}`)
    .then((resp) => {
      if (resp.status === 401) {
        document.getElementById('apiKey').style.border = 'medium solid #ff7675'
      }
      if (resp.status === 200) {
        document.getElementById('apiKey').style.border = 'medium solid #00b894'

        setCookie('apiKeyCookie', apiKey, 1)

        console.log('Good Key!')
        var readOnlyArray = document.getElementsByClassName('disableWithoutAPI')

        for (var i = 0; i < readOnlyArray.length; i++) {
          readOnlyArray[i].removeAttribute('readonly')
        }
      }
    })
    .catch(function (error) {
      console.log('Request failed', error)
      runError(error)
    })
}

function checkTeam (number) {
  fetch(`https://www.thebluealliance.com/api/v3/team/frc${number.value}?X-TBA-Auth-Key=${document.getElementById('apiKey').value}`)
    .then((resp) => resp.json())
    .then(function (data) {
      if (data.nickname === undefined) {
        number.style.border = 'medium solid #d63031'
      } else {
        number.style.border = 'medium solid #00b894'
      }
    })
    .catch(function (error) {
      console.log('Request failed', error)
      runError(error)
    })
}

function checkTeam2 (number) {
  let event = document.getElementById('eventKey').value
  let year = document.getElementById('eventYear').value
  let eventKey = year + event.toLowerCase()
  fetch(`https://www.thebluealliance.com/api/v3/event/${eventKey}/teams/simple?X-TBA-Auth-Key=${document.getElementById('apiKey').value}`)
  .then((resp) => resp.json())
    .then(function (data) {
      console.log(data)
    })
  .catch(function (error) {
    console.log('Request failed', error)
    runError(error)
  })
}

function fetchOPR (data, teamNumber) {
  return data.oprs[`frc${teamNumber}`]
}

function runError (error) {
  document.getElementById('alertText').innerText = error
}

function winner (alliance1OPR, alliance2OPR) {
  let winMessage
  if (alliance1OPR > alliance2OPR) {
    winMessage = 'Alliance #1 Wins!'
  }
  if (alliance2OPR > alliance1OPR) {
    winMessage = 'Alliance #2 Wins!'
  }
  if (alliance1OPR === alliance2OPR) {
    winMessage = 'It\'s a tie!'
  }
  document.getElementById('alertText').classList.add('show')
  document.getElementById('alertText').innerText = winMessage
}

function setCookie (cname, cvalue, exdays) {
  var d = new Date()
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000))
  var expires = 'expires=' + d.toGMTString()
  document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/'
}

function getCookie (cname) {
  var name = cname + '='
  var decodedCookie = decodeURIComponent(document.cookie)
  var ca = decodedCookie.split(';')
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i]
    while (c.charAt(0) === ' ') {
      c = c.substring(1)
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length)
    }
  }
  return ''
}

function checkCookie () {
  var apiKeyCookie = getCookie('apiKey')
  if (apiKeyCookie !== '') {
    console.log('Returned')
  }
}
