$(document).ready(() => {
  let lightMode = true;
  $("#eve").text("You wanna buy human bones");
  setTimeout(() => {
    $("#eve").text("nevermind");
  }, 1000);

  $("#sike").click(() => {
    $(".alert").slideDown("fast");
    setTimeout(() => {
      $(".alert").slideUp("slow");
    }, 3000);
  });

  $("#changeColor").click(() => {
    if (lightMode) {
      $("body, .nav, .card").addClass("darkMode");
      $("body, .nav, .card").removeClass("lightMode");

      $("#viewMode").attr("src", "./icons/sun.svg");
      lightMode = false;
    } else {
      $("body, .nav, .card").addClass("lightMode");
      $("body, .nav, .card").removeClass("darkMode");
      $("#viewMode").attr("src", "./icons/moon.svg");

      lightMode = true;
    }
  });

  $("li").click((e) => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ ";
    let count = 0;
    const interval = setInterval(() => {
      let t = e.target.innerText;
      let val = t
        .split("")
        .map((letter, index) => {
          if (index < count) {
            return t[index];
          }
          return letters[Math.floor(Math.random() * 26)];
        })
        .join("");
      $("#txt").text(val);

      if (count >= $("#txt").data("value").length) clearInterval(interval);
      count = count + 1 / 2;
    }, 30);
  });

  $("li").click((e) => {
    let listId = e.target.id + "Page";
    $(".content").fadeOut("fast");
    $(`#${listId}`).fadeIn("slow");
  });

  let coin;
  let svGuess;

  $("#guessForm").submit((e) => {
    e.preventDefault();
    $("#status").fadeOut("fast");
    //const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let myGuess = $("#myGuess").val();
    $("#dispMyGuess").text(myGuess);
    $("#dispMyGuess").removeClass("btn btn-success");

    $.post(
      "/guess",
      {
        myGuess: myGuess,
      },
      (data, status) => {
        svGuess = data.letter;
        coin = data.coin;
      }
    ).done(() => {
      $("#myCoin").text(coin);
      const letters = "BINGO";
      let i = 0;
      let dat = "";

      $("#guessBtn").fadeOut();
      const inter = setInterval(() => {
        dat = letters[Math.floor(Math.random() * 5)];
        $("#dispTheLett").text(dat);

        if (i >= 30) clearInterval(inter);

        i = i + 1 / 2;
      }, 30);

      setTimeout(() => {
        $("#dispTheLett").text(svGuess);
        if (myGuess == svGuess) {
          $("#dispMyGuess").addClass("btn btn-success");
          $("#dispTheLett")
            .addClass("btn-success")
            .removeClass("btn-warning btn-danger");
          $("#status")
            .addClass("text-success")
            .removeClass("text-danger")
            .html(
              `You Won 5 🪙 .. <sub><em> *humph* don't worry i will get it back</em></sub>`
            )
            .fadeIn("fast");
          $("#myCoin").text(coin + 5);
        } else {
          $("#dispTheLett")
            .addClass("btn-danger")
            .removeClass("btn-warning btn-success");
          $("#status")
            .addClass("text-danger")
            .removeClass("text-success")
            .text("You have 💩 luck ")
            .fadeIn("fast");
          $("#myCoin").text(coin);
        }
        $("#guessBtn").fadeIn();
      }, 1850);
    });
  });

  $(".subOptions > button").click((e) => {
    let button = e.target;
    $("#myGuess").val(button.innerText);
  });
});
