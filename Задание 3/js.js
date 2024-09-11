const wsUri = "wss://echo-ws-service.herokuapp.com";

const sendChat = document.getElementById("send");
const geo = document.getElementById("geo");
const client = document.querySelector('.client');
const server = document.querySelector('.server');
const input = document.querySelector('.input');
const openChat = document.querySelector('.open_chat');
const conteiner = document.querySelector('.conteiner');
const closeChat = document.querySelector('.close');
const chat = document.querySelector('.chat');

let websocket

function writeToScreen(message) {
    chat.insertAdjacentHTML('beforeend', message)
}

openChat.addEventListener('click', () => {

    conteiner.style.cssText = `display: flex;`;

    websocket = new WebSocket(wsUri)
    websocket.onopen = function (evt) {
        console.log("CONNECTED")
    }
    websocket.onclose = function (evt) {
        console.log("DISCONNECTED")
    }
    websocket.onmessage = function (evt) {
        writeToScreen(
            '<div class="server"><span class="comment">' + evt.data + '</span></div>'
        )
    }
    websocket.onerror = function (evt) {
        writeToScreen(
            '<span style="color: red;">ERROR: ' + evt.data + '</span>'
        )
    }
})

closeChat.addEventListener('click', () => {
    websocket.close()
    websocket = null
    conteiner.style.cssText = `display: none;`;
})

function sendMessage() {
    const mes = input.value
    writeToScreen('<div class="client"><span class="comment">' + mes + '</span></div>')
    websocket.send(mes)
    input.value = ""
}

sendChat.addEventListener('click', () => {
    sendMessage()
})

input.addEventListener('keydown', (evt) => {
    if (evt.code === 'Enter') {
        sendMessage()
    }
})

function done(position) {
    const latitude = position.coords.latitude
    const longitude = position.coords.longitude
    const urlMap = `https://www.openstreetmap.org/#map=10/${latitude}/${longitude}`

    writeToScreen (`<div class="client"><span class="comment"> Широта: ${latitude} Долгота: ${longitude}<br> <a href=${urlMap} target="blank">Показать на карте</a></span></div>`)
}

function error(err) {
    writeToScreen('<div class="client"><span class="comment">' + `ERROR(${err.code}): ${err.message}` + '</span></div>')
}

geo.addEventListener('click', () => {
    if ('geolocation' in navigator) {
        writeToScreen('<div class="client"><span class="comment">Определение местоположения</span></div>')
        navigator.geolocation.getCurrentPosition(done, error)
    } else {
        writeToScreen('<div class="server"><span class="comment"> Геолокация не поддерживается вашим браузером </span></div>')
    }
})

