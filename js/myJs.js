const textConfig = {
  text1: "Happy Anniversary 24/10! 🎉💖",
  text2: "Hôm nay là ngày kỷ niệm 24/10 vô cùng đặc biệt của hai đứa mình... Anh có điều này muốn hỏi em nè! 🥰",
  text3: "24/10 này, em có yêu anh nhiều nhất trên đời không? 🥺💖",
  text4: "Nếu em không trả lời mà thoát ra thì tức là đồng ý làm vợ anh suốt đời luôn đó nha! 😏💍",
  text5: "Hông yêu đâu 😏",
  text6: "💖 Yêu anh nhiều nhất trần đời!",
  text7: "Điều em muốn nhắn gửi đến anh nhân ngày kỷ niệm 24/10 là gì nè? 🥰💌",
  text8: "Gửi cho anh nào 💌",
  text9: "Mãi bên nhau anh nhé! Chúc mừng ngày 24/10 của hai đứa 💕✨",
  text10: "Anh yêu em nhiều lắm! Chúc mừng ngày kỷ niệm 24/10 😘🌹",
  text11:
    "Tối nay anh đưa công chúa đi chơi kỷ niệm 24/10 thật lãng mạn nhé! 🌙✨ Giờ thì cùng khám phá món quà anh làm riêng tặng em nào! 💕",
  text12: "Khám phá món quà 24/10 🎁✨",
};

$(document).ready(function () {
  // process bar
  setTimeout(function () {
    firstQuestion();
    $(".spinner").fadeOut();
    $("#preloader").delay(350).fadeOut("slow");
    $("body").delay(350).css({
      overflow: "visible",
    });
  }, 600);

  $("#text3").html(textConfig.text3);
  $("#text4").html(textConfig.text4);
  $("#no").html(textConfig.text5);
  $("#yes").html(textConfig.text6);

  function firstQuestion() {
    $(".content").hide();
    Swal.fire({
      title: textConfig.text1,
      text: textConfig.text2,
      imageUrl: "img/cutePanda.png",
      imageWidth: 300,
      imageHeight: 300,
      background: '#fff url("img/iput-bg.jpg")',
      imageAlt: "Custom image",
    }).then(function () {
      $(".content").show(200);
    });
  }

  // switch button position
  function switchButton() {
    var audio = new Audio("sound/duck.mp3");
    audio.play();
    var leftNo = $("#no").css("left");
    var topNO = $("#no").css("top");
    var leftY = $("#yes").css("left");
    var topY = $("#yes").css("top");
    $("#no").css("left", leftY);
    $("#no").css("top", topY);
    $("#yes").css("left", leftNo);
    $("#yes").css("top", topNO);
  }
  // move random button position safely below text
  function moveButton() {
    var audio = new Audio("sound/Swish1.mp3");
    audio.play();
    var winW = $(window).width();
    var winH = $(window).height();
    if (winW <= 600) {
      var x = Math.random() * (winW - 140) + 20;
      var y = Math.random() * (winH * 0.2) + (winH * 0.65);
    } else {
      var x = Math.random() * (winW * 0.65) + (winW * 0.1);
      var y = Math.random() * (winH * 0.22) + (winH * 0.58);
    }
    var left = Math.round(x) + "px";
    var top = Math.round(y) + "px";
    $("#no").css("left", left);
    $("#no").css("top", top);
  }

  var hoverCount = 0;
  var isAlertShowing = false;

  function handleNoButtonInteraction() {
    if (isAlertShowing) return;
    hoverCount++;

    if (hoverCount === 1) {
      switchButton();
    } else if (hoverCount < 4) {
      moveButton();
    } else {
      // Khi đưa con trỏ chuột vào nhiều lần (từ lần thứ 4 trở đi)
      moveButton();
      isAlertShowing = true;

      Swal.fire({
        title: "Con bé này lì ghê! 😤",
        text: "Đã bảo là phải chọn yêu anh rồi mà cứ cố né hoài à! Mau bấm nút bên kia đi nha cô nương~ 💖",
        imageUrl: "img/angryPanda.png",
        imageWidth: 240,
        imageHeight: 240,
        background: '#fff url("img/iput-bg.jpg")',
        confirmButtonText: "Dạ em biết òi, để em bấm yêu anh 💕",
        confirmButtonColor: "#ff4d8d",
      }).then(() => {
        isAlertShowing = false;
        // Hiệu ứng phóng to nhẹ nút Yes để người yêu chú ý
        $("#yes").css("transform", "scale(1.15)");
        setTimeout(() => {
          $("#yes").css("transform", "");
        }, 600);
      });
    }
  }

  $("#no").on("mouseenter", function () {
    handleNoButtonInteraction();
  });

  $("#no").on("click", function () {
    handleNoButtonInteraction();
  });

  // generate text in input
  function textGenerate() {
    var n = "";
    var text = " " + textConfig.text9;
    var a = Array.from(text);
    var textVal = $("#txtReason").val() ? $("#txtReason").val() : "";
    var count = textVal.length;
    if (count > 0) {
      for (let i = 1; i <= count; i++) {
        n = n + a[i];
        if (i == text.length + 1) {
          $("#txtReason").val("");
          n = "";
          break;
        }
      }
    }
    $("#txtReason").val(n);
  }

  // show popup
  $("#yes").click(function () {
    var audio = new Audio("sound/tick.mp3");
    audio.play();
    Swal.fire({
      title: textConfig.text7,
      html: true,
      width: 900,
      padding: "3em",
      html: "<input type='text' class='form-control' id='txtReason' placeholder='Gửi lời nhắn kỷ niệm 24/10 cho anh nè...'>",
      background: '#fff url("img/iput-bg.jpg")',
      backdrop: `
                    rgba(0,0,123,0.4)
                    url("img/giphy2.gif")
                    left top
                    no-repeat
                  `,
      showCancelButton: false,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonColor: "#fe8a71",
      cancelButtonColor: "#f6cd61",
      confirmButtonText: textConfig.text8,
    }).then((result) => {
      if (result.value) {
        Swal.fire({
          width: 900,
          confirmButtonText: textConfig.text12,
          background: '#fff url("img/iput-bg.jpg")',
          title: textConfig.text10,
          text: textConfig.text11,
          confirmButtonColor: "#83d0c9",
          onClose: () => {
            window.location = "reasons.html";
          },
        });
      }
    });

    $("#txtReason").focus(function () {
      var handleWriteText = setInterval(function () {
        textGenerate();
      }, 10);
      $("#txtReason").blur(function () {
        clearInterval(handleWriteText);
      });
    });
  });
});
