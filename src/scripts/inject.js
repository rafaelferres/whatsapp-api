console.log(
  "%c 😜 WhatsApp - Unofficial API ",
  "background: #27ae60; color: #fff; font-size: 24px"
);

console.log(
  "%c Rafael Ferrés - https://github.com/rafaelferres/whatsapp-api",
  "color: #27ae60"
);

var socket = io("http://localhost:3001");

socket.on("connect", () => {
  console.log("%c ✅ Connected to socket", "color: #27ae60");
});

WAPI.waitNewMessages(false, (data) => {
  data.forEach((message) => {
    if (!message.isGroupMsg) {
      body = {};
      body.text = message.body;

      if (message.isMedia) {
        body.type = "media";
      } else {
        body.type = "text";
      }

      body.user = message.sender.pushname;
      body.timestamp = message.timestamp;
      body.from = message.from.toString().replace("@c.us", "");
      body.to = message.to.toString().replace("@c.us", "");
      body.isMedia = message.isMedia;
      body.isNotification = message.isNotification;
      body.isMMS = message.isMMS;
      body.isGroupMsg = message.isGroupMsg;
      body.mimetype = message.mimetype;
      body.mediaData = message.mediaData;

      socket.emit("message", body);
    }
  });
});

WAPI.addOptions = function () {
  var suggestions = "";
  intents.smartreply.suggestions.map((item) => {
    suggestions += `<button style="background-color: #eeeeee;
                                margin: 5px;
                                padding: 5px 10px;
                                font-size: inherit;
                                border-radius: 50px;" class="reply-options">${item}</button>`;
  });
  var div = document.createElement("DIV");
  div.style.height = "40px";
  div.style.textAlign = "center";
  div.style.zIndex = "5";
  div.innerHTML = suggestions;
  div.classList.add("grGJn");
  var mainDiv = document.querySelector("#main");
  var footer = document.querySelector("footer");
  footer.insertBefore(div, footer.firstChild);
  var suggestions = document.body.querySelectorAll(".reply-options");
  for (let i = 0; i < suggestions.length; i++) {
    const suggestion = suggestions[i];
    suggestion.addEventListener("click", (event) => {
      console.log(event.target.textContent);
      window
        .sendMessage(event.target.textContent)
        .then((text) => console.log(text));
    });
  }
  mainDiv.children[mainDiv.children.length - 5].querySelector(
    "div > div div[tabindex]"
  ).scrollTop += 100;
};
