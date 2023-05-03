//hey u yes u i didn't use jQuery ......
let $ = (id) => document.querySelector(id);
let newIdDontTouchThis = Math.floor(Math.random() * 100);
let tried = false; //refers if SIMPle user tried to submit the form atleast once

// $("#id").value = `TEE/00${newIdDontTouchThis}`;
$("#chekboks").addEventListener("click", () => {
  if ($("#chekboks").checked) $("#simpPasswd").type = "text";
  else $("#simpPasswd").type = "password";
});

//  ---------- live validation ---------------

// live validation for Name
$("#simpName").addEventListener("keyup", (e) => {

  if(tried == true){
    if(e.target.value.length > 0){
      $("#simpName").classList.remove("errorStyle")
      $("#nameErr").style = "opacity: 0"
    }
  }
})
// live validation for Age
$("#simpAge").addEventListener("keyup", (e) => {
  if (tried == true) {
    if (e.target.value < 18 || e.target.value > 100) {
      $("#simpAge").classList.add("errorStyle");
      $("#ageErr").style = "opacity: 1";
    } else {
      $("#simpAge").classList.remove("errorStyle");
      $("#ageErr").style = "opacity: 0";
    }
  }
});
// live validation for phone
$("#simpPhone").addEventListener("keyup", (e) => {
  if (tried == true) {
    if (e.target.value.length === 10) {
      $("#simpPhone").classList.remove("errorStyle");
      $("#phoneErr").style = "opacity: 0";
    } else {
      $("#simpPhone").classList.remove("success");
      $("#simpPhone").classList.add("errorStyle");
      $("#phoneErr").style = "opacity: 1";
    }
  }
});

// live validation for Username
let liveResult = false;
$("#simpUname").addEventListener("keyup", (e) => {
  if (tried) {
    const liveOptions = /^[a-zA-Z0-9\_]*$/g;
    let liveUname = $("#simpUname").value;
    liveResult = liveOptions.test(liveUname);
    if (liveResult && liveUname != "") {
      $("#simpUname").classList.remove("errorStyle");
      $("#unameErr").style = "opacity: 0";
    } else {
      $("#simpUname").classList.add("errorStyle");
      $("#unameErr").style = "opacity: 1";
    }
  }
});
// live validation for P
$("#simpPasswd").addEventListener("keyup", () => {
  if (tried) {
    if ($("#simpPasswd").value.length < 8) {
      $("#simpPasswd").classList.add("errorStyle");
      $("#passwdErr").style = "opacity: 1";
    } else {
      $('#simpPasswd').classList.remove("errorStyle");
      $("#passwdErr").style = "opacity: 0";
    }
  }
});

// ----------- form submission
let result = false; //Variable for username validation result
const submitForm = (e) => {
  tried = true; //user tried to submite at least once
  let status = true; // no errors, form can be submited

  // you know deeeez u dont need comments cmoon
  let name = $("#simpName");
  let age = $("#simpAge");
  let phone = $("#simpPhone");
  let uname = $("#simpUname");
  let passwd = $("#simpPasswd");

  // validate Name
  if(name.value == '') {
    name.classList.add('errorStyle')
    $('#nameErr').style = 'opacity: 1'
    status = false
  } else {
    name.classList.remove('errorStyle')
    $('#nameErr').style = 'opacity: 0'
    
  }
  // validation for age
  if (age.value < 18 || age.value > 100) {
    age.classList.add("errorStyle");
    $("#ageErr").style = "opacity: 1";
    status = false;
  } else {
    age.classList.remove("errorStyle");
    $("#ageErr").style = "opacity: 0";
  }

  // validation for phone
  if (phone.value.length != 10) {
    phone.classList.add("errorStyle");
    $("#phoneErr").style = "opacity: 1";
    status = false;
  } else {
    phone.classList.remove("errorStyle");
    $("#phoneErr").style = "opacity: 0";
  }

  // validate Username
  const options = /^[a-zA-Z0-9\_]*$/g;
  let inpUname = uname.value;
  result = options.test(inpUname);
  if (result && inpUname != "") {
    uname.classList.remove("errorStyle");
    $("#unameErr").style = "opacity: 0";
  } else {
    uname.classList.add("errorStyle");
    $("#unameErr").style = "opacity: 1";
    status = false;
  }
  // validate Passwd
  const onlyNum = /^[0-9]*$/g;
  // const onlyNum = /^[a-zA-Z]*$/g;

  if (passwd.value.length < 8) {
    passwd.classList.add("errorStyle");
    $("#passwdErr").style = "opacity: 1";
    status = false;
  } else {
    passwd.classList.remove("errorStyle");
    $("#passwdErr").style = "opacity: 0";
  }

  if (status == true) alert(`Suucceess Mr ${name.value}`);
  else {
    $("#simp").style = "display: none"
    $("#youShallNotPass").style = "display: flex"
    return status; //form will be submited if no err else return
  }
};

// getStarted Animation
$("#getStarted").addEventListener("click", () => {
  $(".bdy").style = "animation: bg 10s ease-in; transition: 0;";
  setTimeout(() => {
    $(".bdy").style = "animation: none;";
  }, 10000);
});
/*




\
|
~


*/