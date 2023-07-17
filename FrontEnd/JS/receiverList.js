let receive = document.getElementById("receive-popup");
receive.addEventListener("submit", async function (e) {
  e.preventDefault();
  let receiverName = document.getElementById("receiverName");
  let receiverAddr = document.getElementById("receiverAddr");
  let receiverCity = document.getElementById("receiverCity");
  let receiverMob = document.getElementById("receiverMob");
  let dateTime = document.getElementById("receivedDate");
  const resp = await fetch("http://localhost:3556/api/upreceiver", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      receiver_name: receiverName.value,
      receiver_addr: receiverAddr.value,
      receiver_city: receiverCity.value,
      rmobile_num: receiverMob.value,
      date: dateTime.value,
    }),
  });
  var msg = await resp.json();
  console.log(msg);
  alert(msg["message"]);
  getReceiversList("http://localhost:3556/api/receivers");
});
