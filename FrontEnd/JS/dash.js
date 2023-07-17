function showHide() {
  var userDetails = document.getElementById("list-items");
  if (userDetails.style.display === "none") {
    userDetails.style.display = "block";
  } else {
    userDetails.style.display = "none";
  }
}
function openPopup(str) {
  document.getElementById("data1").reset();
  document.getElementById("data2").reset();
  document.getElementById("data3").reset();
  document.querySelector(str).classList.add("open-popup");
  document.querySelector(".div_outer").classList.add("blur");
}
function closePopup(str) {
  document.querySelector(str).classList.remove("open-popup");
  document.querySelector(".div_outer").classList.remove("blur");
}
window.addEventListener("load", function () {
  let username = localStorage.getItem("username");
  document.getElementById("username-display").innerHTML = username;
  getUser();
});
async function getUser() {
  const email = document.getElementById("email");
  const mob = document.getElementById("mob");
  const response = await fetch("http://localhost:3556/api/user/getdetails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: localStorage.getItem("username"),
    }),
  });
  var resp = await response.json();
  console.log(resp);
  email.innerHTML = "EMAIL ID : "+resp["email"];
  mob.innerHTML = "MOBILE NUMBER : "+resp["mobile_num"];
}
var donorLocations = [],
  receiverLocations = [],
  volunteerLocations = [],
  latitude,
  longitude;
function getLocation(str1, str2,key) {
  var name, newLocation;
  var form = document.getElementById(str1);
  name = form.elements[str2].value;
  if (name == "") {
    alert("Please fill the details");
    return;
  }
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
  
        if (str1 == "data1") {
          newLocation = [name, latitude, longitude];
          if (
            !donorLocations.length ||
            !donorLocations.some((location) => location[0] === newLocation[0])
          ) {
            donorLocations.push(newLocation);
            alert("Got location");
          }
        }
        if (str1 == "data2") {
          newLocation = [name, latitude, longitude];
          if (
            !receiverLocations.length ||
            !receiverLocations.some(
              (location) => location[0] === newLocation[0]
            )
          ) {
            receiverLocations.push(newLocation);
            alert("Got location");
          }
        }
        if (str1 == "data3") {
          newLocation = [name, latitude, longitude];
          if (
            !volunteerLocations.length ||
            !volunteerLocations.some(
              (location) => location[0] === newLocation[0]
            )
          ) {
            alert("Got location");
            volunteerLocations.push(newLocation);
          }
        }
        var mergedLocations = [
          ...donorLocations,
          ...receiverLocations,
          ...volunteerLocations,
        ];
        console.log(mergedLocations);
      },
      function () {
        alert("Unable to get location");
      }
    );
  } else {
    alert("Geolocation is not supported by browser");
  }
}
let donate = document.getElementById("donate-popup");
donate.addEventListener("submit", async function (e) {
  e.preventDefault();
  let donorName = document.getElementById("donor-name");
  let foodItems = document.getElementById("food-items");
  let donorAddr = document.getElementById("donor-addr");
  let donorCity = document.getElementById("donor-city");
  let donorMob = document.getElementById("donor-mob");
  let dateTime = document.getElementById("donated-date");
  const resp = await fetch("http://localhost:3556/api/donate", {
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
      d_lat: latitude,
      d_lon: longitude,
    }),
  });
  var msg = await resp.json();
  console.log(msg);
  alert(msg["message"]);
});
let receive = document.getElementById("receive-popup");
receive.addEventListener("submit", async function (e) {
  e.preventDefault();
  let receiverName = document.getElementById("receiver-name");
  let receiverAddr = document.getElementById("receiver-addr");
  let receiverCity = document.getElementById("receiver-city");
  let receiverMob = document.getElementById("receiver-mob");
  let dateTime = document.getElementById("received-date");
  const resp = await fetch("http://localhost:3556/api/receive", {
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
      r_lat: latitude,
      r_lon: longitude,
    }),
  });
  var msg = await resp.json();
  console.log(msg);
  alert(msg["message"]);
});
let volunteer = document.getElementById("volunteer-popup");
volunteer.addEventListener("submit", async function (e) {
  e.preventDefault();
  let volunteerName = document.getElementById("volunteer-name");
  let volunteerAddress = document.getElementById("volunteer-address");
  let volunteerCity = document.getElementById("volunteer-city");
  let volunteerMob = document.getElementById("volunteer-mob");
  const resp = await fetch("http://localhost:3556/api/help", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      volunteer_name: volunteerName.value,
      vol_addr: volunteerAddress.value,
      vol_city: volunteerCity.value,
      vmobile_num: volunteerMob.value,
      v_lat: latitude,
      v_lon: longitude,
    }),
  });
  var msg = await resp.json();
  console.log(msg);
  alert(msg["message"]);
});
function list(str) {
  if (str == "donors") {
    window.location.href = "/FrontEnd/HTML/donorList.html";
  } else if (str == "receivers") {
    window.location.href = "/FrontEnd/HTML/receiverList.html";
  } else {
    window.location.href = "/FrontEnd/HTML/volunteerList.html";
  }
}
