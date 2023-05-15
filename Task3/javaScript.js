const wsUri = "wss://echo-ws-service.herokuapp.com/";

function pageLoaded() {
  const chatEnter = document.querySelector(".chat_enter");
  const infoOutput = document.querySelector(".info_output");
  const input = document.querySelector("input");
  const sendBtn = document.querySelector(".send_btn");
  const geoBtn = document.querySelector(".geo_btn");

  let webSocket = new WebSocket(wsUri);

  webSocket.onopen = () => {
    infoOutput.innerText = "Connected";
  }

  webSocket.onmessage = (event) => {
    writeToScreen(event.data, true);
  }

  webSocket.onerror = () => {
    infoOutput.innerText = "При передачи данных произошла ошибка";
  }

  sendBtn.addEventListener("click", sendMessage);
  geoBtn.addEventListener("click", sendLocation);

  function sendMessage () {
    if(!input.value) return;
    webSocket.send(input.value);
    writeToScreen(input.value, false);
    input.value ==="";
  }

  function writeToScreen(message, isReceived) {
    let messageHTML = `<div class="${isReceived? "received" : "sent"}">${message}</div>`;
    chatEnter.innerHTML += messageHTML;
  }

  function sendLocation () {
    if("geolocation" in navigator){
      navigator.geolocation.getCurrentPosition(locationSuccess, locationError);
    }else{
      infoOutput.innerText = "Браузер не поддерживает определение местоположения"
    }
  }

  function locationSuccess(data) {
    let link = `https://www.openstreetmap.org/search?whereami=1&query=${data.coords.longitude}%${data.coords.latitude}#map=18/53.94218/27.70787`
    let result = `<a class="link" target="_blank" href="${link}">Моё местоположение</a>`
    writeToScreen(result);
  }

  function locationError() {
    chatEnter.innerText = "Произошла ошибка"
  } 
}

document.addEventListener("DOMContentLoaded", pageLoaded);