(function () {
  'use strict';
  var root = document.documentElement;
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Internet Explorer: no effects, no splash. The page is a plain document with a direct download link. */
  if (document.documentMode || navigator.userAgent.indexOf('Trident') !== -1) {
    root.className += ' ie';
    document.addEventListener('DOMContentLoaded', function () {
      var splash = document.getElementById('intro');
      if (splash && splash.parentNode) { splash.parentNode.removeChild(splash); }
      var osLabel = document.getElementById('os-text');
      if (osLabel) { osLabel.textContent = 'Windows 10 or 11 (64-bit)'; }
    });
    return;
  }

  /* ---------- Intro splash (home page only, once per tab session) ---------- */
  function initIntro() {
    var intro = document.getElementById('intro');
    if (!intro) { return; }
    var seen = false;
    try {
      seen = !!sessionStorage.getItem('whisterIntro');
      sessionStorage.setItem('whisterIntro', '1');
    } catch (e) { /* storage blocked: play the intro anyway */ }
    if (seen || reduceMotion) { intro.remove(); return; }

    root.classList.add('intro-played');
    var title = document.getElementById('intro-title');
    var text = title.textContent;
    title.textContent = '';
    for (var i = 0; i < text.length; i++) {
      var letter = document.createElement('span');
      letter.style.setProperty('--i', i);
      letter.textContent = text.charAt(i);
      title.appendChild(letter);
    }
    for (var s = 0; s < 18; s++) {
      var star = document.createElement('i');
      star.className = 'intro-star';
      star.style.setProperty('--x', Math.round(Math.random() * 100) + '%');
      star.style.setProperty('--y', Math.round(Math.random() * 100) + '%');
      star.style.setProperty('--s', (2 + Math.random() * 3).toFixed(1) + 'px');
      star.style.setProperty('--d', (Math.random() * 3).toFixed(2) + 's');
      intro.appendChild(star);
    }
    root.style.overflow = 'hidden';
    var finished = false;
    function finish() {
      if (finished) { return; }
      finished = true;
      root.style.overflow = '';
      intro.remove();
    }
    intro.addEventListener('click', finish);
    window.addEventListener('keydown', finish, { once: true });
    setTimeout(finish, 4700);
  }

  /* ---------- Scroll reveal ---------- */
  function initReveal() {
    var items = document.querySelectorAll('.reveal-hidden');
    if (!items.length) { return; }
    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('reveal-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------- OS detection and download ---------- */
  var DOWNLOAD_EXE = 'https://github.com/joshhowis2013-ctrl/Whister-BETA-/releases/download/Release/WhisterGUIInstaller.exe';

  function showThanks() {
    var panel = document.getElementById('hero-content-panel');
    if (!panel) { return; }
    panel.style.transition = 'opacity .2s';
    panel.style.opacity = '0';
    setTimeout(function () {
      panel.replaceChildren();
      var wrap = document.createElement('div');
      wrap.className = 'thanks-fade-in';

      var badge = document.createElement('span');
      badge.className = 'done-badge';
      badge.textContent = '\u2713 Download started';
      var h = document.createElement('h1');
      h.textContent = 'Thanks for choosing Whister!';
      h.style.fontSize = 'clamp(32px, 5vw, 48px)';
      var p = document.createElement('p');
      p.textContent = 'Your installer is downloading. Three quick steps and you are browsing.';
      p.style.color = 'var(--muted)';

      var row = document.createElement('div');
      row.className = 'step-row';
      [['Step 1', 'Open the downloaded installer.'],
       ['Step 2', 'Follow the setup, no admin rights needed.'],
       ['Step 3', 'Launch Whister and pick your settings.']].forEach(function (s) {
        var node = document.createElement('div');
        node.className = 'step-node';
        var strong = document.createElement('strong');
        strong.textContent = s[0];
        var text = document.createElement('p');
        text.textContent = s[1];
        node.appendChild(strong);
        node.appendChild(text);
        row.appendChild(node);
      });

      var link = document.createElement('a');
      link.href = 'blog/index.html';
      link.className = 'btn-secondary';
      link.style.marginTop = '24px';
      link.textContent = 'Read the blog \u2192';

      wrap.append(badge, h, p, row, link);
      panel.appendChild(wrap);
      panel.style.opacity = '1';
    }, 200);
  }

  function startDownload(href) {
    var frame = document.querySelector('iframe[name="download-bridge"]');
    if (frame) { frame.src = href; } else { window.location.href = href; }
    showThanks();
  }

  function initDownload() {
    var mainBtn = document.getElementById('main-download-btn');
    var osText = document.getElementById('os-text');
    var platform = ((navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || '').toLowerCase();
    var isWindows = platform.indexOf('win') !== -1;

    if (mainBtn) {
      mainBtn.href = DOWNLOAD_EXE;
      if (isWindows) {
        mainBtn.textContent = 'Download for Windows';
        if (osText) { osText.textContent = 'Windows 10 or 11 (64-bit)'; }
        var card = document.getElementById('card-windows');
        if (card) { card.classList.add('highlighted'); }
      } else if (osText) {
        osText.textContent = 'Whister is Windows-only for now. macOS and Linux are planned.';
      }
      mainBtn.addEventListener('click', function (e) {
        e.preventDefault();
        startDownload(DOWNLOAD_EXE);
      });
    }
    document.querySelectorAll('[data-download]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        startDownload(btn.getAttribute('data-download'));
        var hero = document.getElementById('hero-content-panel');
        if (hero) { hero.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
      });
    });
  }

  /* ---------- Bangs demo ---------- */
  var BANGS = {
    '!yt': 'https://www.youtube.com/results?search_query=',
    '!w': 'https://en.wikipedia.org/w/index.php?search=',
    '!g': 'https://www.google.com/search?q=',
    '!gh': 'https://github.com/search?q=',
    '!r': 'https://www.reddit.com/search/?q='
  };

  function runSearch() {
    var input = document.getElementById('browser-search-input');
    if (!input) { return; }
    var raw = input.value.trim();
    if (!raw) { return; }
    var parts = raw.split(/\s+/);
    var bang = parts[0].toLowerCase();
    var url;
    if (BANGS[bang] && parts.length > 1) {
      url = BANGS[bang] + encodeURIComponent(parts.slice(1).join(' '));
    } else {
      url = 'https://duckduckgo.com/?q=' + encodeURIComponent(raw);
    }
    window.open(url, '_blank', 'noopener');
  }

  function initBangs() {
    var input = document.getElementById('browser-search-input');
    var btn = document.getElementById('browser-search-btn');
    if (btn) { btn.addEventListener('click', runSearch); }
    if (input) {
      input.addEventListener('keydown', function (e) { if (e.key === 'Enter') { runSearch(); } });
    }
    document.querySelectorAll('.legend-pill[data-bang]').forEach(function (pill) {
      pill.addEventListener('click', function () {
        if (!input) { return; }
        input.value = pill.getAttribute('data-bang') + ' ';
        input.focus();
      });
    });
  }

  /* ---------- Typing browser mock-up ---------- */
  function initTyping() {
    var urlEl = document.getElementById('typing-text');
    var phraseEl = document.getElementById('mockup-display-phrase');
    if (!urlEl || !phraseEl) { return; }
    var scenes = [
      { path: 'private', phrase: 'Private by default.' },
      { path: 'yours', phrase: 'Your search, your engine.' },
      { path: 'fast', phrase: 'Built on Chromium.' },
      { path: 'simple', phrase: 'Settings that make sense.' }
    ];
    if (reduceMotion) {
      urlEl.textContent = scenes[0].path;
      phraseEl.textContent = scenes[0].phrase;
      return;
    }
    var index = 0;
    function type(text, i, done) {
      urlEl.textContent = text.slice(0, i);
      if (i < text.length) { setTimeout(function () { type(text, i + 1, done); }, 90); } else { done(); }
    }
    function erase(i, done) {
      urlEl.textContent = urlEl.textContent.slice(0, i);
      if (i > 0) { setTimeout(function () { erase(i - 1, done); }, 45); } else { done(); }
    }
    function cycle() {
      var scene = scenes[index];
      phraseEl.style.opacity = '0';
      type(scene.path, 0, function () {
        phraseEl.textContent = scene.phrase;
        phraseEl.style.transition = 'opacity .5s';
        phraseEl.style.opacity = '1';
        setTimeout(function () {
          erase(scene.path.length, function () {
            index = (index + 1) % scenes.length;
            setTimeout(cycle, 300);
          });
        }, 2200);
      });
    }
    setTimeout(cycle, 600);
  }

  /* ---------- Comparison slider ---------- */
  function initCompare() {
    var wrapper = document.getElementById('sliderWrapper');
    var overlay = document.getElementById('imageOverlay');
    var handle = document.getElementById('sliderHandle');
    if (!wrapper || !overlay || !handle) { return; }
    var dragging = false;
    function move(clientX) {
      var rect = wrapper.getBoundingClientRect();
      var x = Math.max(0, Math.min(rect.width, clientX - rect.left));
      var pct = (x / rect.width) * 100;
      handle.style.left = pct + '%';
      overlay.style.clipPath = 'polygon(0 0, ' + pct + '% 0, ' + pct + '% 100%, 0 100%)';
    }
    wrapper.addEventListener('pointerdown', function (e) { dragging = true; move(e.clientX); });
    window.addEventListener('pointerup', function () { dragging = false; });
    window.addEventListener('pointermove', function (e) { if (dragging) { move(e.clientX); } });
  }

  /* ---------- Stats counter ---------- */
  function initStats() {
    var section = document.getElementById('stats');
    if (!section) { return; }
    var counters = section.querySelectorAll('[data-target]');
    function run() {
      counters.forEach(function (el) {
        var end = parseFloat(el.getAttribute('data-target'));
        var suffix = el.getAttribute('data-suffix') || '';
        if (reduceMotion) { el.textContent = end + suffix; return; }
        var start = null;
        function step(t) {
          if (start === null) { start = t; }
          var p = Math.min((t - start) / 1400, 1);
          el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + suffix;
          if (p < 1) { requestAnimationFrame(step); }
        }
        requestAnimationFrame(step);
      });
    }
    if (!('IntersectionObserver' in window)) { run(); return; }
    var io = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { run(); io.disconnect(); }
    }, { threshold: 0.3 });
    io.observe(section);
  }

  /* ---------- Thank-you page auto download ---------- */
  function initThanksPage() {
    var btn = document.getElementById('manual-trigger-btn');
    var frame = document.querySelector('iframe[name="download-bridge"]');
    if (btn && frame) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        frame.src = btn.href;
      });
      if (document.body.hasAttribute('data-autodownload')) { frame.src = btn.href; }
    }
  }

  root.classList.add('js');
  document.addEventListener('DOMContentLoaded', function () {
    initIntro();
    initReveal();
    initDownload();
    initBangs();
    initTyping();
    initCompare();
    initStats();
    initThanksPage();
  });
})();
