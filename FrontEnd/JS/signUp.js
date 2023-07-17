function setFormMessage(formElement, type, message) {
  const messageElement = formElement.querySelector(".form__message");

  messageElement.textContent = message;
  messageElement.classList.remove(
    "form__message--success",
    "form__message--error"
  );
  messageElement.classList.add(`form__message--${type}`);
}

function setloginError(loginElement, message) {
  loginElement.classList.add("form__input--error");
  loginElement.parentElement.querySelector(
    ".form__input-error-message"
  ).textContent = message;
}

function clearloginError(loginElement) {
  loginElement.classList.remove("form__input--error");
  loginElement.parentElement.querySelector(
    ".form__input-error-message"
  ).textContent = "";
}
function ValidateEmail(login) {
  var validRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+\.([a-zA-Z0-9-]+)*$/;
  if (login.match(validRegex)) {
    return true;
  }
}
function ValidateMobile(login) {
  var validRegex = /^\d{10}$/;
  if (login.match(validRegex)) {
    return true;
  }
}
function ValidatePassword(login) {
  var validRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
  if (login.match(validRegex)) {
    return true;
  }
} 
document.querySelectorAll(".form__input").forEach((loginElement) => {
  loginElement.addEventListener("input", (e) => {
    clearloginError(loginElement);
  });
  loginElement.addEventListener("blur", (e) => {
    if (
      e.target.id === "signup-username" &&
      e.target.value.length > 0 &&
      e.target.value.length < 6
    ) {
      setloginError(
        loginElement,
        "Username must be at least 6 characters in length"
      );
    }
  });
  loginElement.addEventListener("blur", (e) => {
    if (e.target.id === "signup-email" && ValidateEmail(e.target.value) != true) {
      setloginError(loginElement, "Invalid email");
    }
  });
  loginElement.addEventListener("blur", (e) => {
    if (e.target.id === "signup-mobnum" && ValidateMobile(e.target.value) != true) {
      setloginError(loginElement, "Invalid mobile number");
    }
  });
  loginElement.addEventListener("blur", (e) => {
    if (e.target.id === "signup-password" && ValidatePassword(e.target.value) != true) {
      setloginError(
        loginElement,
        "Password must contain atlest 6 characters with a digit, one uppercase and one lowercase letter"
      );
    }
  });
});
let signup = document.getElementById("createAccount");
signup.addEventListener("submit", async function (e) {
  e.preventDefault();
  let userName = document.getElementById("signup-username");
  let email = document.getElementById("signup-email");
  let mobNum = document.getElementById("signup-mobnum");
  let pswd = document.getElementById("signup-password");
  let hasErrors = false;
  if (userName.value.length < 6 || !ValidateEmail(email.value) || !ValidatePassword(pswd.value) || !ValidateMobile(mobNum.value)) {
    hasErrors = true;
  }
  if (hasErrors) {
    return;
  }
  const resp = await fetch("http://localhost:3556/api/user/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: userName.value,
      email: email.value,
      umobile_num: mobNum.value,
      password: pswd.value,
    }),
  });
  console.log(resp);
  const msg = await resp.json();
  console.log(msg);
  setFormMessage(
    signup,
    resp.status == 200 ? "success" : "error",
    msg["message"]
  );
  if (resp.status == 200) {
    window.setTimeout(function () {
      window.location.href = "/FrontEnd/HTML/login.html";
    }, 1000);
  }
});


