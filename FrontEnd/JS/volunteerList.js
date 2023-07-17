let filterButton = document.getElementById("filter");
filterButton.addEventListener("click", () => {
  getVolunteersList("http://localhost:3556/api/volstatus");
});
let volunteer = document.getElementById("volunteer-popup");
volunteer.addEventListener("submit", async function (e) {
  e.preventDefault();
  let volunteerName = document.getElementById("volunteerName");
  let volunteerAddress = document.getElementById("volunteerAddress");
  let volunteerCity = document.getElementById("volunteerCity");
  let volunteerMob = document.getElementById("volunteerMob");
  const resp = await fetch("http://localhost:3556/api/upvolunteer", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      volunteer_name: volunteerName.value,
      vol_addr: volunteerAddress.value,
      vol_city: volunteerCity.value,
      vmobile_num: volunteerMob.value,
    }),
  });
  var msg = await resp.json();
  console.log(msg);
  alert(msg["message"]);
  getVolunteersList("http://localhost:3556/api/volunteers");
});
