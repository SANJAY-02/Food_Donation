window.addEventListener("DOMContentLoaded", (_) => {
  let websocket = new WebSocket("ws://" + window.location.host + "/websocket");
  let room = document.getElementById("chat-text");

  websocket.addEventListener("message", function (e) {
    let data = JSON.parse(e.data);
    let p = document.createElement("p");
      p.innerHTML = `<strong>${data.username}</strong>&nbsp;:&nbsp;<span>${data.text}</span>`;
      room.append(p);
      room.scrollTop = room.scrollHeight; 
  });
  window.addEventListener("load", function () {
    let username = localStorage.getItem("username");
    document.getElementById("username-display").innerHTML = username;
  });
  let form = document.getElementById("input-form");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    let username = document.getElementById("input-username");
    let text = document.getElementById("input-text");
      websocket.send(
        JSON.stringify({
          username: username.value,
          text: text.value,
        })
      );
    text.value = "";
  });
});