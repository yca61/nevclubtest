(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* year */
  var yr = $('#yr'); if (yr) yr.textContent = new Date().getFullYear();

  /* event categories (events-data.js) */
  var cats = window.NEV_CATEGORIES || [], evs = window.NEV_EVENTS || [];
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); };
  var catBox = $('#cats');
  if (catBox) {
    catBox.innerHTML = cats.map(function (c, i) {
      var count = evs.filter(function (e) { return e.category === c.name; }).length;
      return '<article class="cat" role="listitem" data-reveal style="--d:' + (i * .08) + 's' + (c.image ? ';--img:url(' + esc(new URL(c.image, location.href).href) + ')' : '') + '">' +
        '<span class="cat__n">0' + (i + 1) + '</span><h3>' + esc(c.name) + '</h3><p>' + esc(c.note) + '</p>' +
        (count ? '' : '<span class="cat__soon">Yakında</span>') + '</article>';
    }).join('');
  }

  /* value numerals */
  $$('.value').forEach(function (v, i) { v.setAttribute('data-n', '0' + (i + 1)); });

  /* loader + hero intro */
  var hero = $('.hero'), loader = $('.intro');
  function go() { hero.classList.add('go'); }
  if (reduce) { go(); }
  else {
    var started = false;
    var finish = function () {
      if (started) return; started = true;
      loader.classList.add('done');
      setTimeout(go, 450);
      setTimeout(function () { loader.classList.add('gone'); }, 1500);
    };
    window.addEventListener('load', function () { setTimeout(finish, 2600); });
    setTimeout(finish, 3800);
  }

  /* reveal on scroll */
  var targets = $$('[data-reveal], [data-values], .triad, .title, .story__title, .manifesto__h, .story__top');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: .18, rootMargin: '0px 0px -6% 0px' });
    targets.forEach(function (t) { if (!t.closest('.hero')) io.observe(t); });
  } else {
    targets.forEach(function (t) { t.classList.add('in'); });
  }
  /* values: panels follow their container, one after another */
  $$('[data-values]').forEach(function (box) {
    var kids = $$('.value', box);
    var show = function () { kids.forEach(function (k, i) { setTimeout(function () { k.classList.add('in'); }, 250 + i * 250); }); };
    if (box.classList.contains('in')) show();
    new MutationObserver(function () { if (box.classList.contains('in')) show(); })
      .observe(box, { attributes: true, attributeFilter: ['class'] });
  });

  /* header, progress, parallax, active link */
  var header = $('.header'), bar = $('.progress i');
  var par = $$('[data-parallax]'), links = $$('.nav a[href^="#"]:not(.btn)');
  var secs = links.map(function (a) { return $(a.getAttribute('href')); });
  var scrub = reduce ? [] : $$('[data-scrub]'), tl = $$('[data-timeline]');
  if (reduce) { tl.forEach(function (ol) { ol.style.setProperty('--p', 1); $$('li', ol).forEach(function (li) { li.classList.add('on'); }); }); }
  var ticking = false;
  function frame() {
    ticking = false;
    var y = window.scrollY, h = document.documentElement.scrollHeight - innerHeight;
    header.classList.toggle('scrolled', y > 40);
    bar.style.transform = 'scaleX(' + (h > 0 ? y / h : 0) + ')';
    if (!reduce && innerWidth > 700) {
      par.forEach(function (el) {
        var r = el.parentElement.getBoundingClientRect();
        if (r.bottom < -100 || r.top > innerHeight + 100) return;
        var k = parseFloat(el.dataset.parallax) || .1;
        var lim = Math.max(0, (el.offsetHeight - el.parentElement.offsetHeight) / 2 - 1); var dy = (r.top + r.height / 2 - innerHeight / 2) * -k; el.style.transform = 'translate3d(0,' + Math.max(-lim, Math.min(lim, dy)).toFixed(1) + 'px,0)';
      });
    }
    scrub.forEach(function (el) {
      var r = el.getBoundingClientRect(), vh = innerHeight;
      var t = Math.min(1, Math.max(0, (vh * .88 - r.top) / (vh * .38)));
      el.style.opacity = (.22 + .78 * t).toFixed(2);
    });
    tl.forEach(function (ol) {
      var r = ol.getBoundingClientRect(), vh = innerHeight;
      var p = Math.min(1, Math.max(0, (vh * .7 - r.top) / r.height));
      ol.style.setProperty('--p', p.toFixed(3));
      $$('li', ol).forEach(function (li) { li.classList.toggle('on', li.getBoundingClientRect().top < vh * .7); });
    });
    var cur = -1;
    secs.forEach(function (s, i) { if (s && s.getBoundingClientRect().top < innerHeight * .4) cur = i; });
    links.forEach(function (a, i) { a.classList.toggle('active', i === cur && cur > 0); });
  }
  function req() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  addEventListener('scroll', req, { passive: true });
  addEventListener('resize', req);
  frame();

  /* mobile menu */
  var burger = $('#burger'), nav = $('#nav');
  function setMenu(open) {
    nav.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Menüyü kapat' : 'Menüyü aç');
    document.body.style.overflow = open ? 'hidden' : '';
  }
  burger.addEventListener('click', function () { setMenu(!nav.classList.contains('open')); });
  $$('a', nav).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  addEventListener('resize', function () { if (innerWidth > 1100) setMenu(false); });

  /* ===== v2 ===== */
  var fine = window.matchMedia('(hover: hover)').matches;

  /* kelime kelime belirme (data-words) */
  var wordEls = $$('[data-words]').map(function (el) {
    var html = el.innerHTML.replace(/<[^>]+>/g, function (t) { return t; });
    var out = '';
    el.childNodes.forEach(function (n) {
      if (n.nodeType === 3) out += n.textContent.split(/(\s+)/).map(function (w) { return /^\s+$/.test(w) || !w ? w : '<span class="w">' + w + '</span>'; }).join('');
      else out += n.outerHTML;
    });
    el.innerHTML = out;
    return { el: el, ws: $$('.w', el) };
  });

  /* footer dev yazı: harfler */
  var giant = $('.footer__giant');
  if (giant) {
    giant.innerHTML = giant.textContent.split('').map(function (ch, i) { return '<span style="--i:' + i + '">' + ch + '</span>'; }).join('');
    if ('IntersectionObserver' in window && !reduce) {
      new IntersectionObserver(function (es, o) { es.forEach(function (e) { if (e.isIntersecting) { $('.footer').classList.add('in'); o.disconnect(); } }); }, { threshold: .25 }).observe(giant);
    } else { $('.footer').classList.add('in'); }
  }

  /* yan noktalar */
  var navSecs = [['#top', 'Ana Sayfa'], ['#hakkimizda', 'Hakkımızda'], ['#elciler', 'Nev Elçi'], ['#etkinlikler', 'Etkinlikler'], ['#hikayem', 'Benim Hikâyem'], ['#iletisim', 'İletişim']];
  var dotsBox = document.createElement('nav');
  dotsBox.className = 'dots'; dotsBox.setAttribute('aria-label', 'Bölümler');
  dotsBox.innerHTML = navSecs.map(function (s) { return '<a href="' + s[0] + '" data-l="' + s[1] + '" aria-label="' + s[1] + '"></a>'; }).join('');
  document.body.appendChild(dotsBox);
  var dotLinks = $$('a', dotsBox), dotTargets = navSecs.map(function (s) { return $(s[0]); });
  var darkSecs = $$('.hero, .elciler, .manifesto, .footer');

  var totop = $('.totop'), ring = $('.totop__ring'), mq = $('[data-mq]'), expand = $('[data-expand]');
  var lastY = 0, ticking2 = false;
  function onScroll2() {
    ticking2 = false;
    var y = scrollY, vh = innerHeight, h = document.documentElement.scrollHeight - vh;
    /* üst menü: aşağıda gizle, yukarıda göster */
    if (!nav.classList.contains('open')) header.classList.toggle('hide', y > 400 && y > lastY + 4);
    if (y < lastY - 4 || y < 400) header.classList.remove('hide');
    lastY = y;
    /* yukarı çık */
    totop.classList.toggle('show', y > 700);
    ring.style.strokeDashoffset = (132 * (1 - (h > 0 ? y / h : 0))).toFixed(1);
    /* yan noktalar */
    var cur = 0;
    dotTargets.forEach(function (s, i) { if (s && s.getBoundingClientRect().top < vh * .45) cur = i; });
    dotLinks.forEach(function (a, i) { a.classList.toggle('on', i === cur); });
    var mid = vh / 2, dark = darkSecs.some(function (s) { var r = s.getBoundingClientRect(); return r.top < mid && r.bottom > mid; });
    dotsBox.classList.toggle('dark', dark);
    if (reduce) return;
    /* kelime belirme */
    wordEls.forEach(function (o) {
      var r = o.el.getBoundingClientRect();
      var p = Math.min(1, Math.max(0, (vh * .85 - r.top) / (vh * .5)));
      var n = o.ws.length * p;
      o.ws.forEach(function (w, i) { w.style.opacity = i + 1 <= n ? 1 : (i < n ? .2 + .8 * (n - i) : .2); });
    });
    /* slogan şeridi: kaydırmaya bağlı */
    if (mq) { var r2 = mq.parentNode.getBoundingClientRect(); var mp = Math.min(1, Math.max(0, (vh - r2.top) / (vh + r2.height))); mq.style.transform = 'translateX(' + (-mp * Math.max(0, mq.scrollWidth - innerWidth) * .8).toFixed(0) + 'px)'; }
    /* nev elçi: görsel genişliyor */
    if (expand) {
      var r3 = expand.parentNode.getBoundingClientRect();
      var p3 = Math.min(1, Math.max(0, (vh - r3.top) / (vh * .7)));
      var e = (1 - p3) * 7;
      expand.style.setProperty('--ei', e.toFixed(2) + '%');
      expand.style.setProperty('--er', (e * 4).toFixed(1) + 'px');
    }
  }
  function req2() { if (!ticking2) { ticking2 = true; requestAnimationFrame(onScroll2); } }
  addEventListener('scroll', req2, { passive: true });
  addEventListener('resize', req2);
  onScroll2();

  /* hero: imleç ışığı ve kürelerin hafif hareketi */
  if (fine && !reduce) {
    var spot = $('.hero__spot'), orbs = $$('.hero__orbs i');
    hero.addEventListener('mousemove', function (e) {
      var r = hero.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      hero.style.setProperty('--hx', (x * 100).toFixed(1) + '%');
      hero.style.setProperty('--hy', (y * 100).toFixed(1) + '%');
    });
  }

  /* kartlar: imleç ışığı + eğim */
  if (fine && !reduce) {
    $$('.value, .cat').forEach(function (c) {
      if (c.classList.contains('cat') && !$('.glow', c)) { var g = document.createElement('i'); g.className = 'glow'; c.appendChild(g); }
      c.addEventListener('mousemove', function (e) {
        var r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        c.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
        c.style.setProperty('--my', (y * 100).toFixed(1) + '%');
        c.style.setProperty('--ry', ((x - .5) * 7).toFixed(2) + 'deg');
        c.style.setProperty('--rx', ((.5 - y) * 7).toFixed(2) + 'deg');
      });
      c.addEventListener('mouseleave', function () { c.style.setProperty('--rx', '0deg'); c.style.setProperty('--ry', '0deg'); });
    });
  }

  /* "#top" bağlantıları: #top sabit konumlu üst menü olduğu için tarayıcı kaydırmıyor, elle başa dön */
  $$('a[href="#top"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
      try { if (history.replaceState && location.protocol.indexOf('http') === 0) history.replaceState(null, '', location.pathname + location.search); } catch (err) {}
    });
  });

  /* hero slider */
  var slider = $('[data-slider]');
  if (slider) {
    var slides = $$('.hero__slide', slider), dotsEl = $$('.hero__dot'), cnt = $('.hero__count b');
    var cur = 0, timer = null, DUR = 6500;
    hero.style.setProperty('--dur', DUR + 'ms');
    var show = function (n) {
      cur = (n + slides.length) % slides.length;
      slides.forEach(function (s, i) { s.classList.toggle('on', i === cur); });
      dotsEl.forEach(function (d, i) { d.classList.remove('on'); if (i === cur) { void d.offsetWidth; d.classList.add('on'); } });
      if (cnt) cnt.textContent = '0' + (cur + 1);
    };
    var play = function () { clearInterval(timer); if (!reduce) timer = setInterval(function () { show(cur + 1); }, DUR); };
    $('[data-next]').addEventListener('click', function () { show(cur + 1); play(); });
    $('[data-prev]').addEventListener('click', function () { show(cur - 1); play(); });
    dotsEl.forEach(function (d) { d.addEventListener('click', function () { show(+d.dataset.i); play(); }); });
    hero.addEventListener('mouseenter', function () { clearInterval(timer); hero.classList.add('paused'); });
    hero.addEventListener('mouseleave', function () { hero.classList.remove('paused'); show(cur); play(); });
    document.addEventListener('visibilitychange', function () { document.hidden ? clearInterval(timer) : play(); });
    var started = false;
    var begin = function () { if (!started) { started = true; show(0); play(); } };
    if (reduce) { show(0); } else { setTimeout(begin, 3600); }
  }

  /* magnetic buttons */
  if (window.matchMedia('(hover: hover)').matches && !reduce) {
    $$('.btn:not(.nav__cta)').forEach(function (b) {
      b.addEventListener('mousemove', function (e) {
        var r = b.getBoundingClientRect();
        b.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * .12).toFixed(1) + 'px,' + ((e.clientY - r.top - r.height / 2) * .22).toFixed(1) + 'px)';
      });
      b.addEventListener('mouseleave', function () { b.style.transform = ''; });
    });
  }

  /* contact form (Netlify Forms) */
  var form = $('.form');
  if (form) {
    var status = $('.form__status', form), btn = $('button', form);
    var rules = {
      ad: function (v) { return v.trim().length > 1; },
      eposta: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); },
      mesaj: function (v) { return v.trim().length > 4; }
    };
    var check = function (el) { var r = rules[el.name]; if (!r) return true; var ok = r(el.value); el.parentNode.classList.toggle('bad', !ok); return ok; };
    $$('input,textarea', form).forEach(function (el) { el.addEventListener('blur', function () { check(el); }); });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var all = $$('input,textarea', form).map(check);
      if (all.indexOf(false) > -1) { status.className = 'form__status fail'; status.textContent = 'Lütfen işaretli alanları kontrol edin.'; return; }
      btn.disabled = true; status.className = 'form__status'; status.textContent = 'Gönderiliyor…';
      var body = new URLSearchParams(new FormData(form)).toString();
      fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body })
        .then(function (r) { if (!r.ok) throw 0; form.reset(); status.className = 'form__status ok'; status.textContent = 'Mesajınız iletildi. Teşekkür ederiz.'; })
        .catch(function () { status.className = 'form__status fail'; status.textContent = 'Mesaj gönderilemedi. Lütfen daha sonra tekrar deneyin veya sosyal medyadan yazın.'; })
        .then(function () { btn.disabled = false; });
    });
  }
})();
