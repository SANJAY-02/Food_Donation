function openPopup(str) {
  document.querySelector(str).classList.add("open-popup");
  document.querySelector(".root-container").classList.add("blur");
}
function closePopup(str) {
  document.querySelector(str).classList.remove("open-popup");
  document.querySelector(".root-container").classList.remove("blur");
}
function handleClick(event) {
  alert("User mismatch");
  event.preventDefault();
}
function addButtonEvents(button) {
  button.addEventListener("mouseover", function () {
    button.style.background = "#007f67";
  });
  button.addEventListener("mouseout", function () {
    button.style.background = "#009579";
  });
  button.addEventListener("mousedown", () => {
    button.style.transform = "scale(0.95)";
  });
  button.addEventListener("mouseup", () => {
    button.style.transform = "scale(1)";
  });
}
function buttons(button1, button2) {
  button1.style.cssText =
    "width: 100%;padding: 0.5rem 1rem;font-weight: bold;font-size: 1rem;color: #ffffff;border: none;border-radius:4px;outline: none;cursor: pointer;background:#009579;";
  button2.style.cssText =
    "width: 100%;padding: 0.5rem 1rem;font-weight: bold;font-size: 1rem;color: #ffffff;border: none;border-radius:4px;outline: none;cursor: pointer;background:#009579;";
  button1.innerText = "EDIT";
  button2.innerText = "DELETE";
  addButtonEvents(button1);
  addButtonEvents(button2);
}
async function updatePrediction() {
  const response = await fetch("http://127.0.0.1:5000/prediction");
  const data = await response.json();
  const receiverName = data.name;
  let table = document.getElementById("donors");
  let rows = table.rows;
  for (let i = 1; i < rows.length; i++) {
    if (receiverName.toLowerCase() === rows[i].cells[0].innerText.toLowerCase())
      rows[i].querySelector("#prediction").textContent = data.prediction;
  }
}
setInterval(updatePrediction, 1000);
async function getDonorsList(url) {
  const response = await fetch(url);
  var resp = await response.json();
  console.log(resp);
  if (resp == null) alert("No Food available");
  let tab = `<tr>
          <th>DONOR NAME</th>
          <th>FOOD ITEMS</th>
          <th>DONOR ADDRESS</th>
          <th>CITY</th>
          <th>MOBILE NUMBER</th>
      <th>DATE&nbsp;/&nbsp;TIME</th>
          <th>DONATED STATUS</th>
          <th colspan="2" style="text-align:center">OPTIONS</th>
          <th>FRESH</th>
          </tr>`;
  for (let r of resp) {
    // const datetimeString = `${r.date}`;
    // const datetime = new Date(datetimeString);
    // const formattedDate = datetime.toLocaleDateString();
    // const formattedTime = datetime.toLocaleTimeString([], {
    //   hour: "2-digit",
    //   minute: "2-digit",
    //   hour12: true,
    // });
    // <td>${formattedDate + " " + formattedTime}</td>
    tab += `<tr>
              <td>${r.donor_name} </td>
              <td>${r.food_items}</td>
              <td>${r.donor_addr}</td>
              <td>${r.donor_city}</td>
              <td>${r.dmobile_num}</td>
              <td>${r.date}</td>
        <td></td>
        <td></td>
        <td></td>
        <td><span id="prediction"></span></td>
              </tr>`;
  }
  document.getElementById("donors").innerHTML = tab;
  let table = document.getElementById("donors");
  let rows = table.rows;
  for (let i = 1; i < rows.length; i++) {
    let cols = rows[i].cells;
    let lastCol = rows[i]["cells"][cols.length - 2];
    let lastPrev = rows[i]["cells"][cols.length - 3];
    let lastPrevPrev = rows[i]["cells"][cols.length - 4];
    let check = document.createElement("input");
    let buttonEdit = document.createElement("button");
    let buttonDelete = document.createElement("button");
    buttons(buttonEdit, buttonDelete);
    check.type = "checkbox";
    if (resp[i - 1].donated == true) {
      check.checked = true;
    }
    check.style.cssText = "width:30px;height:30px;";
    const donorName = rows[i].cells[0].innerText;
    const foodItems = rows[i].cells[1].innerText;
    const donorAddr = rows[i].cells[2].innerText;
    const donorCity = rows[i].cells[3].innerText;
    const donorMob = rows[i].cells[4].innerText;
    const donatedDate = rows[i].cells[5].innerText;
    const form = document.getElementById("data1");
    if (
      localStorage.getItem("username").toUpperCase() == donorName.toUpperCase()
    ) {
      buttonDelete.addEventListener("click", async () => {
        const deleteResponse = await fetch(
          `http://localhost:3556/api/deldonor`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ donor_name: donorName }),
          }
        );
        if (deleteResponse.status === 200) {
          rows[i].remove();
        }
        getDonorsList("http://localhost:3556/api/donors");
      });
      buttonEdit.addEventListener("click", async () => {
        openPopup("#donate-popup");
        form.elements.donorName.value = donorName;
        form.elements.foodItems.value = foodItems;
        form.elements.donorAddr.value = donorAddr;
        form.elements.donorCity.value = donorCity;
        form.elements.donorMob.value = donorMob;
        form.elements.donatedDate.value = donatedDate;
      });
      check.addEventListener("click", async () => {
        const url = check.checked
          ? `http://localhost:3556/api/donate_yes`
          : `http://localhost:3556/api/donate_no`;
        await fetch(`${url}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ donor_name: donorName }),
        });
      });
    } else {
      buttonEdit.addEventListener("click", handleClick);
      buttonDelete.addEventListener("click", handleClick);
      check.addEventListener("click", handleClick);
    }
    lastCol.appendChild(buttonDelete);
    lastPrev.appendChild(buttonEdit);
    lastPrevPrev.appendChild(check);
  }
}
async function getReceiversList(url) {
  const response = await fetch(url);
  var resp = await response.json();
  console.log(resp);
  if (resp == null) alert("No Receivers available");
  let tab = `<tr>
          <th>RECEIVER NAME</th>
          <th>RECEIVER ADDRESS</th>
          <th>CITY</th>
          <th>MOBILE NUMBER</th>
      <th>DATE</th>
          <th>RECEIVED STATUS</th>
          <th colspan="2" style="text-align:center">OPTIONS</th>
          </tr>`;
  for (let r of resp) {
    tab += `<tr>
      <td>${r.receiver_name} </td>
      <td>${r.receiver_addr}</td>
      <td>${r.receiver_city}</td>
      <td>${r.rmobile_num}</td>
    <td>${r.date}</td>		
      <td></td>
      <td></td>
      <td></td>
  </tr>`;
  }
  document.getElementById("receivers").innerHTML = tab;
  let table = document.getElementById("receivers");
  let rows = table.rows;
  for (let i = 1; i < rows.length; i++) {
    let cols = rows[i].cells;
    let lastCol = rows[i]["cells"][cols.length - 1];
    let lastPrev = rows[i]["cells"][cols.length - 2];
    let lastPrevPrev = rows[i]["cells"][cols.length - 3];
    let check = document.createElement("input");
    let buttonEdit = document.createElement("button");
    let buttonDelete = document.createElement("button");
    buttons(buttonEdit, buttonDelete);
    check.type = "checkbox";
    if (resp[i - 1].received == true) {
      check.checked = true;
    }
    check.style.cssText = "width:30px;height:30px;";
    const receiverName = rows[i].cells[0].innerText;
    const receiverAddr = rows[i].cells[1].innerText;
    const receiverCity = rows[i].cells[2].innerText;
    const receiverMob = rows[i].cells[3].innerText;
    const receivedDate = rows[i].cells[4].innerText;
    const form = document.getElementById("data2");
    if (
      localStorage.getItem("username").toUpperCase() ==
      receiverName.toUpperCase()
    ) {
      buttonDelete.addEventListener("click", async () => {
        const deleteResponse = await fetch(
          `http://localhost:3556/api/delreceiver`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ receiver_name: receiverName }),
          }
        );
        if (deleteResponse.status === 200) {
          rows[i].remove();
        }
        getReceiversList("http://localhost:3556/api/receivers");
      });
      buttonEdit.addEventListener("click", async () => {
        openPopup("#receive-popup");
        form.elements.receiverName.value = receiverName;
        form.elements.receiverAddr.value = receiverAddr;
        form.elements.receiverCity.value = receiverCity;
        form.elements.receiverMob.value = receiverMob;
        form.elements.receivedDate.value = receivedDate;
      });
      check.addEventListener("click", async () => {
        const url = check.checked
          ? `http://localhost:3556/api/receive_yes`
          : `http://localhost:3556/api/receive_no`;
        await fetch(`${url}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ receiver_name: receiverName }),
        });
      });
    } else {
      buttonEdit.addEventListener("click", handleClick);
      buttonDelete.addEventListener("click", handleClick);
      check.addEventListener("click", handleClick);
    }
    lastCol.appendChild(buttonDelete);
    lastPrev.appendChild(buttonEdit);
    lastPrevPrev.appendChild(check);
  }
}
async function getVolunteersList(url) {
  const response = await fetch(url);
  var resp = await response.json();
  console.log(resp);
  if (resp == null) alert("No volunteers available");
  let tab = `<tr>
          <th>VOLUNTEER NAME</th>
          <th>VOLUNTEER ADDESSS</th>
          <th>CITY</th>
          <th>MOBILE NUMBER</th>
      <th>AVAILABILITY</th>
      <th colspan="2" style="text-align:center">OPTIONS</th>
          </tr>`;
  for (let r of resp) {
    tab += `<tr>
      <td>${r.volunteer_name} </td>
      <td>${r.vol_addr}</td>
      <td>${r.vol_city}</td>
      <td>${r.vmobile_num}</td>
    <td></td>		
    <td></td>		
    <td></td>
  </tr>`;
  }
  document.getElementById("volunteers").innerHTML = tab;
  let table = document.getElementById("volunteers");
  let rows = table.rows;
  for (let i = 1; i < rows.length; i++) {
    let cols = rows[i].cells;
    let lastCol = rows[i]["cells"][cols.length - 1];
    let lastPrev = rows[i]["cells"][cols.length - 2];
    let lastPrevPrev = rows[i]["cells"][cols.length - 3];
    let check = document.createElement("input");
    let buttonEdit = document.createElement("button");
    let buttonDelete = document.createElement("button");
    buttons(buttonEdit, buttonDelete);
    check.type = "checkbox";
    if (resp[i - 1].availability == true) {
      check.checked = true;
    }
    check.style.cssText = "width:30px;height:30px;";
    const volunteerName = rows[i].cells[0].innerText;
    const volunteerAddress = rows[i].cells[1].innerText;
    const volunteerCity = rows[i].cells[2].innerText;
    const volunteerMob = rows[i].cells[3].innerText;
    const form = document.getElementById("data3");
    if (
      localStorage.getItem("username").toUpperCase() ==
      volunteerName.toUpperCase()
    ) {
      buttonDelete.addEventListener("click", async () => {
        const deleteResponse = await fetch(
          `http://localhost:3556/api/delvolunteer`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ volunteer_name: volunteerName }),
          }
        );
        if (deleteResponse.status === 200) {
          rows[i].remove();
        }
        getVolunteersList("http://localhost:3556/api/volunteers");
      });
      buttonEdit.addEventListener("click", async () => {
        openPopup("#volunteer-popup");
        form.elements.volunteerName.value = volunteerName;
        form.elements.volunteerAddress.value = volunteerAddress;
        form.elements.volunteerCity.value = volunteerCity;
        form.elements.volunteerMob.value = volunteerMob;
      });
      check.addEventListener("click", async () => {
        const url = check.checked
          ? `http://localhost:3556/api/avail/yes`
          : `http://localhost:3556/api/avail/no`;
        await fetch(`${url}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ volunteer_name: volunteerName }),
        });
      });
    } else {
      buttonEdit.addEventListener("click", handleClick);
      buttonDelete.addEventListener("click", handleClick);
      check.addEventListener("click", handleClick);
    }
    lastCol.appendChild(buttonDelete);
    lastPrev.appendChild(buttonEdit);
    lastPrevPrev.appendChild(check);
  }
}
window.addEventListener("load", function () {
  var page = document.getElementsByTagName("body")[0].getAttribute("data-page");
  document.getElementById("username-display").innerHTML =
    localStorage.getItem("username");
  if (page === "donor-page") {
    getDonorsList("http://localhost:3556/api/donors");
  } else if (page === "receiver-page") {
    getReceiversList("http://localhost:3556/api/receivers");
  } else if (page === "volunteer-page") {
    getVolunteersList("http://localhost:3556/api/volunteers");
  }
});
function search(fieldName, tableName, colNum) {
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById(fieldName);
  filter = input.value.toUpperCase();
  table = document.getElementById(tableName);
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[colNum];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}
