function setFormMessage(formElement, type, message) {
  const messageElement = formElement.querySelector(".form__message");

  messageElement.textContent = message;
  messageElement.classList.remove(
    "form__message--success",
    "form__message--error"
  );
  messageElement.classList.add(`form__message--${type}`);
}
let login = document.getElementById("login");
login.addEventListener("submit", async function (e) {
  e.preventDefault();
  let userName = document.getElementById("login-username");
  let pswd = document.getElementById("login-password");
  const resp = await fetch("http://localhost:3556/api/user/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: userName.value,
      password: pswd.value,
    }),
  });
  console.log(resp);
  const msg = await resp.json();
  setFormMessage(
    login,
    resp.status == 200 ? "success" : "error",
    msg["message"]
  );
  if (resp.status == 200) {
    localStorage.setItem("username",userName.value);
    window.setTimeout(function () {
      window.location.href = "/FrontEnd/HTML/dash.html";
    }, 1000);
  }
});
function showPswd() {
  var x = document.getElementById("login-password");
  if (x.type === "password") {
    x.type = "text";
  } else {
    x.type = "password";
  }
}
