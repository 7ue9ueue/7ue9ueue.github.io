(function () {
  "use strict";

  var STORAGE_KEY = "aiyiyi.story.protagonistName.v1";
  var GENDER_STORAGE_KEY = "aiyiyi.story.protagonistGender.v1";
  var DEFAULT_NAME = "你的名字";
  var AIYIYI_NAMES = ["艾一一", "Aiyiyi", "i11"];
  var RESERVED_NAMES = [
    "我", "主角", "narrator",
    "节制", "节制大人",
    "三三", "零零三三", "0033", "ec0033", "脑内冠军",
    "普通少女", "陌生女子", "连夏", "LX05",
    "骑士少女", "卓安", "维罗妮卡", "Veronica", "Estoc",
    "安大师", "？？？"
  ];

  function canonicalize(value) {
    return String(value || "")
      .normalize("NFKC")
      .trim()
      .replace(/\s+/gu, "")
      .toLocaleLowerCase();
  }

  var reserved = new Set(RESERVED_NAMES.map(canonicalize));
  var aiyiyiNames = new Set(AIYIYI_NAMES.map(canonicalize));

  function normalizeDisplayName(value) {
    return String(value || "").normalize("NFKC").trim();
  }

  function validateName(value) {
    var name = normalizeDisplayName(value);
    var length = Array.from(name).length;

    if (!name) return {ok: false, message: "请先写下主角的名字。"};
    if (length > 12) return {ok: false, message: "名字最多可以写 12 个字。"};
    if (/\s/u.test(name)) return {ok: false, message: "名字中不能包含空格。"};
    if (!/^[\p{L}\p{M}\p{N}·・•'’\-]+$/u.test(name)) {
      return {ok: false, message: "请只使用中文、字母、数字、间隔点、撇号或连字符。"};
    }
    if (aiyiyiNames.has(canonicalize(name))) {
      return {ok: false, kind: "record", message: "未找到对应的姓名记录。"};
    }
    if (reserved.has(canonicalize(name))) {
      return {ok: false, kind: "occupied", message: "此姓名已被占用。"};
    }
    return {ok: true, name: name};
  }

  function readStoredName() {
    try {
      return window.localStorage.getItem(STORAGE_KEY) || "";
    } catch (error) {
      return "";
    }
  }

  function writeStoredName(name) {
    try {
      window.localStorage.setItem(STORAGE_KEY, name);
      return true;
    } catch (error) {
      return false;
    }
  }

  function removeStoredName() {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      // Storage can be unavailable in hardened private browsing modes.
    }
  }

  function readStoredGender() {
    try {
      var gender = window.localStorage.getItem(GENDER_STORAGE_KEY) || "";
      return gender === "female" || gender === "male" ? gender : "";
    } catch (error) {
      return "";
    }
  }

  function writeStoredGender(gender) {
    try {
      if (gender === "female" || gender === "male") {
        window.localStorage.setItem(GENDER_STORAGE_KEY, gender);
      } else {
        window.localStorage.removeItem(GENDER_STORAGE_KEY);
      }
    } catch (error) {
      // Gender is optional and does not affect the current chapters.
    }
  }

  function getNextChapter() {
    var requested = new URLSearchParams(window.location.search).get("next");
    var allowed = ["/chapters/chapter-0.html", "/chapters/chapter-1.html"];
    return allowed.indexOf(requested) >= 0 ? requested : "/chapters/chapter-0.html";
  }

  function updatePreview(preview, value) {
    var candidate = normalizeDisplayName(value);
    preview.textContent = candidate || DEFAULT_NAME;
  }

  function initializeNameGate(gate) {
    var form = gate.querySelector("[data-story-name-form]");
    var input = form.querySelector("input[name='protagonist-name']");
    var preview = form.querySelector("[data-story-name-preview]");
    var errorBox = form.querySelector("[data-story-name-error]") || document.getElementById("story-name-error");
    var submitLabel = form.querySelector("[data-story-submit-label]");
    var submitNote = form.querySelector("[data-story-submit-note]");
    var chapterIndex = document.querySelector("[data-story-chapter-index]");
    var indexName = chapterIndex && chapterIndex.querySelector("[data-story-index-name]");
    var params = new URLSearchParams(window.location.search);
    var entryMode = params.has("next") ? "return" : params.get("edit") === "1" ? "edit" : "default";
    var stored = validateName(readStoredName());
    var storedGender = readStoredGender();

    function clearError() {
      input.removeAttribute("aria-invalid");
      errorBox.classList.remove("is-record-error");
      errorBox.textContent = "";
    }

    function showError(result) {
      input.setAttribute("aria-invalid", "true");
      errorBox.classList.toggle("is-record-error", result.kind === "record");
      errorBox.textContent = result.message;
      input.focus();
    }

    if (stored.ok && entryMode === "default" && chapterIndex) {
      gate.hidden = true;
      chapterIndex.hidden = false;
      indexName.textContent = stored.name;
    } else if (stored.ok) {
      input.value = stored.name;
      updatePreview(preview, stored.name);
      if (entryMode === "edit") {
        submitLabel.textContent = "保存修改";
        submitNote.textContent = "返回章节目录";
      } else {
        submitLabel.textContent = "继续阅读";
        submitNote.textContent = "返回当前章节";
      }
    }
    if (storedGender) {
      var storedGenderInput = form.querySelector("input[name='protagonist-gender'][value='" + storedGender + "']");
      if (storedGenderInput) storedGenderInput.checked = true;
    }

    input.addEventListener("input", function () {
      clearError();
      updatePreview(preview, input.value);
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var result = validateName(input.value);

      if (!result.ok) {
        showError(result);
        return;
      }

      if (!writeStoredName(result.name)) {
        showError({message: "浏览器未允许保存姓名，请关闭隐私限制后再试。"});
        return;
      }

      var selectedGender = form.querySelector("input[name='protagonist-gender']:checked");
      writeStoredGender(selectedGender ? selectedGender.value : "");
      window.location.assign(entryMode === "edit" ? "/chapters/" : getNextChapter());
    });
  }

  function replaceNarratorLabels(root, name) {
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    var nodes = [];
    var node;

    while ((node = walker.nextNode())) {
      if (node.nodeValue.indexOf("我｜") >= 0) nodes.push(node);
    }

    nodes.forEach(function (textNode) {
      var parts = textNode.nodeValue.split("我｜");
      var fragment = document.createDocumentFragment();

      parts.forEach(function (part, index) {
        if (index > 0) {
          var label = document.createElement("span");
          label.className = "story-protagonist-label";
          label.textContent = name;
          fragment.appendChild(label);
          fragment.appendChild(document.createTextNode("｜"));
        }
        fragment.appendChild(document.createTextNode(part));
      });

      textNode.parentNode.replaceChild(fragment, textNode);
    });
  }

  function initializeChapter(chapter) {
    var stored = validateName(readStoredName());

    if (!stored.ok) {
      removeStoredName();
      var returnPath = window.location.pathname;
      window.location.replace("/chapters/?next=" + encodeURIComponent(returnPath));
      return;
    }

    document.querySelectorAll("[data-story-current-name]").forEach(function (element) {
      element.textContent = stored.name;
    });
    replaceNarratorLabels(chapter, stored.name);
  }

  function initializeMagicBackdrop(backdrop) {
    var moteField = backdrop.querySelector("[data-story-motes]");
    var cursorLayer = document.querySelector("[data-story-magic-cursor]");
    var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    var finePointer = window.matchMedia("(pointer: fine)");
    var moteColors = ["#d9c4ff", "#8ed7ff", "#ffe0a0", "#f7fbff"];
    var moteCount = window.innerWidth <= 600 ? 14 : 26;
    var pointerFrame = 0;
    var latestPointerX = 0;
    var latestPointerY = 0;
    var clickTimer = 0;

    if (moteField && !reducedMotion.matches) {
      for (var i = 0; i < moteCount; i += 1) {
        var mote = document.createElement("i");
        var x = (i * 37 + 11) % 97;
        var y = (i * 61 + 7) % 101;
        var size = 1 + (i % 4) * 0.65;
        var duration = 8 + (i % 7) * 1.4;
        var delay = -((i * 1.37) % duration);
        var sway = ((i % 2 === 0 ? 1 : -1) * (18 + (i % 5) * 7));

        mote.className = "story-mote";
        mote.style.setProperty("--story-mote-left", x + "%");
        mote.style.setProperty("--story-mote-top", y + "%");
        mote.style.setProperty("--story-mote-size", size + "px");
        mote.style.setProperty("--story-mote-duration", duration + "s");
        mote.style.setProperty("--story-mote-delay", delay + "s");
        mote.style.setProperty("--story-mote-sway", sway + "px");
        mote.style.setProperty("--story-mote-color", moteColors[i % moteColors.length]);
        moteField.appendChild(mote);
      }
    }

    function renderPointer() {
      var x = (latestPointerX / window.innerWidth - 0.5) * 16;
      var y = (latestPointerY / window.innerHeight - 0.5) * 12;

      backdrop.style.setProperty("--story-shift-x", x.toFixed(2) + "px");
      backdrop.style.setProperty("--story-shift-y", y.toFixed(2) + "px");
      backdrop.style.setProperty("--story-shift-x-reverse", (-x * 0.72).toFixed(2) + "px");
      backdrop.style.setProperty("--story-shift-y-reverse", (-y * 0.72).toFixed(2) + "px");

      if (cursorLayer) {
        cursorLayer.style.setProperty("--story-cursor-x", latestPointerX + "px");
        cursorLayer.style.setProperty("--story-cursor-y", latestPointerY + "px");
        cursorLayer.classList.add("is-visible");
      }

      pointerFrame = 0;
    }

    function updateParallax(event) {
      if (pointerFrame || reducedMotion.matches || !finePointer.matches) return;
      latestPointerX = event.clientX;
      latestPointerY = event.clientY;
      pointerFrame = window.requestAnimationFrame(renderPointer);
    }

    if (!reducedMotion.matches && finePointer.matches) {
      window.addEventListener("pointermove", updateParallax, {passive: true});
      window.addEventListener("pointerover", function (event) {
        if (!cursorLayer) return;
        var target = event.target instanceof Element ? event.target : null;
        cursorLayer.classList.toggle("is-over-control", Boolean(target && target.closest("a, button, input, label, select, textarea")));
      }, {passive: true});
      window.addEventListener("pointerdown", function () {
        if (!cursorLayer) return;
        window.clearTimeout(clickTimer);
        cursorLayer.classList.add("is-clicking");
        clickTimer = window.setTimeout(function () {
          cursorLayer.classList.remove("is-clicking");
        }, 520);
      }, {passive: true});
    }

    document.addEventListener("visibilitychange", function () {
      backdrop.classList.toggle("is-paused", document.hidden);
    });
  }

  var nameGate = document.querySelector("[data-story-name-gate]");
  var chapter = document.querySelector("[data-story-chapter]");
  var magicBackdrop = document.querySelector("[data-story-magic]");

  if (magicBackdrop) initializeMagicBackdrop(magicBackdrop);
  if (nameGate) initializeNameGate(nameGate);
  if (chapter) initializeChapter(chapter);
})();
