(function () {
  "use strict";

  var config = window.SupportBotConfig || {};
  var widgetId = config.widgetId;
  if (!widgetId) {
    console.warn("SupportBot: widgetId not configured");
    return;
  }

  var API_URL = (function () {
    var scripts = document.getElementsByTagName("script");
    for (var i = 0; i < scripts.length; i++) {
      var src = scripts[i].src;
      if (src && src.indexOf("widget.js") !== -1) {
        return src.replace("/widget.js", "");
      }
    }
    return "";
  })();

  var visitorId = localStorage.getItem("sb_visitor_id");
  if (!visitorId) {
    visitorId = "v_" + Math.random().toString(36).slice(2) + Date.now();
    localStorage.setItem("sb_visitor_id", visitorId);
  }

  var conversationId = null;
  var open = false;

  // Styles
  var style = document.createElement("style");
  style.textContent = [
    "#sb-widget { position: fixed; bottom: 24px; right: 24px; z-index: 99999; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }",
    "#sb-toggle { width: 56px; height: 56px; border-radius: 50%; background: #4f46e5; border: none; cursor: pointer; color: white; font-size: 24px; box-shadow: 0 4px 16px rgba(79,70,229,0.4); display: flex; align-items: center; justify-content: center; margin-left: auto; }",
    "#sb-toggle:hover { background: #4338ca; }",
    "#sb-box { width: 360px; background: white; border-radius: 16px; box-shadow: 0 8px 40px rgba(0,0,0,0.18); overflow: hidden; margin-bottom: 12px; display: none; flex-direction: column; max-height: 500px; }",
    "#sb-box.open { display: flex; }",
    "#sb-header { background: #4f46e5; padding: 16px 20px; color: white; }",
    "#sb-header h3 { margin: 0; font-size: 15px; font-weight: 600; }",
    "#sb-header p { margin: 2px 0 0; font-size: 12px; opacity: 0.8; }",
    "#sb-messages { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 12px; }",
    ".sb-msg { max-width: 80%; padding: 10px 14px; border-radius: 18px; font-size: 14px; line-height: 1.4; word-wrap: break-word; }",
    ".sb-msg.user { background: #4f46e5; color: white; align-self: flex-end; border-bottom-right-radius: 4px; }",
    ".sb-msg.bot { background: #f3f4f6; color: #111827; align-self: flex-start; border-bottom-left-radius: 4px; }",
    ".sb-msg.typing { color: #9ca3af; font-style: italic; }",
    "#sb-input-row { display: flex; border-top: 1px solid #e5e7eb; padding: 12px; gap: 8px; }",
    "#sb-input { flex: 1; border: 1px solid #e5e7eb; border-radius: 8px; padding: 8px 12px; font-size: 14px; outline: none; resize: none; font-family: inherit; }",
    "#sb-input:focus { border-color: #4f46e5; }",
    "#sb-send { background: #4f46e5; color: white; border: none; border-radius: 8px; width: 36px; height: 36px; cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; align-self: flex-end; }",
    "#sb-send:hover { background: #4338ca; }",
    "#sb-send:disabled { opacity: 0.5; cursor: default; }",
  ].join("\n");
  document.head.appendChild(style);

  // HTML
  var widget = document.createElement("div");
  widget.id = "sb-widget";
  widget.innerHTML = [
    '<div id="sb-box">',
    '  <div id="sb-header">',
    '    <h3>Support</h3>',
    '    <p>Ask us anything, we\'ll reply instantly</p>',
    '  </div>',
    '  <div id="sb-messages"></div>',
    '  <div id="sb-input-row">',
    '    <textarea id="sb-input" placeholder="Type a message..." rows="1"></textarea>',
    '    <button id="sb-send">&#8593;</button>',
    '  </div>',
    '</div>',
    '<button id="sb-toggle">&#128172;</button>',
  ].join("");
  document.body.appendChild(widget);

  var box = document.getElementById("sb-box");
  var toggle = document.getElementById("sb-toggle");
  var messages = document.getElementById("sb-messages");
  var input = document.getElementById("sb-input");
  var sendBtn = document.getElementById("sb-send");

  // Add welcome message
  addMessage("bot", "Hi! How can I help you today?");

  toggle.addEventListener("click", function () {
    open = !open;
    if (open) {
      box.classList.add("open");
      toggle.innerHTML = "&#10005;";
      input.focus();
    } else {
      box.classList.remove("open");
      toggle.innerHTML = "&#128172;";
    }
  });

  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  });

  sendBtn.addEventListener("click", send);

  function addMessage(role, text) {
    var div = document.createElement("div");
    div.className = "sb-msg " + role;
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
    return div;
  }

  function send() {
    var text = input.value.trim();
    if (!text) return;

    addMessage("user", text);
    input.value = "";
    sendBtn.disabled = true;

    var typing = addMessage("bot", "Typing...");
    typing.classList.add("typing");

    fetch(API_URL + "/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        widgetId: widgetId,
        visitorId: visitorId,
        message: text,
        conversationId: conversationId,
      }),
    })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        messages.removeChild(typing);
        if (data.conversationId) conversationId = data.conversationId;
        addMessage("bot", data.message || "Sorry, I couldn't process that.");
        sendBtn.disabled = false;
      })
      .catch(function () {
        messages.removeChild(typing);
        addMessage("bot", "Sorry, something went wrong. Please try again.");
        sendBtn.disabled = false;
      });
  }
})();
