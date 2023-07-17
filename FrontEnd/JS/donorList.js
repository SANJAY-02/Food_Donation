let filterButton = document.getElementById("filter");
filterButton.addEventListener("click", () => {
  getDonorsList("http://localhost:3556/api/foodstatus");
});
let donate = document.getElementById("donate-popup");
donate.addEventListener("submit", async function (e) {
  e.preventDefault();
  let donorName = document.getElementById("donorName");
  let foodItems = document.getElementById("foodItems");
  let donorAddr = document.getElementById("donorAddr");
  let donorCity = document.getElementById("donorCity");
  let donorMob = document.getElementById("donorMob");
  let dateTime = document.getElementById("donatedDate");
  const resp = await fetch("http://localhost:3556/api/updonor", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      donor_name: donorName.value,
      food_items: foodItems.value,
      donor_addr: donorAddr.value,
      donor_city: donorCity.value,
      dmobile_num: donorMob.value,
      date: dateTime.value,
    }),
  });
  var msg = await resp.json();
  console.log(msg);
  alert(msg["message"]);
  getDonorsList("http://localhost:3556/api/donors");
});
