// Theme toggle (persists in localStorage)
(function () {
  var toggle = document.getElementById('themeToggle');
  var mobileToggle = document.getElementById('mobileThemeToggle');
  function setIcons(isDark) {
    if (toggle) toggle.textContent = isDark ? '☀️' : '🌙';
    if (mobileToggle) mobileToggle.textContent = isDark ? '☀️' : '🌙';
  }
  var saved = localStorage.getItem('theme');
  if (saved === 'dark') {
    document.documentElement.classList.add('dark');
    setIcons(true);
  } else {
    setIcons(false);
  }
  function onToggle() {
    var isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    setIcons(isDark);
  }
  if (toggle) toggle.addEventListener('click', onToggle);
  if (mobileToggle) mobileToggle.addEventListener('click', onToggle);
})();

// Smooth scroll for internal anchors
(function () {
  var links = document.querySelectorAll('a[href^="#"]');
  links.forEach(function (link) {
    link.addEventListener('click', function (e) {
      var targetId = link.getAttribute('href').slice(1);
      if (!targetId) return;
      var target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();

// Back to Top button logic
(function () {
  var btn = document.getElementById('backToTop');
  if (!btn) return;
  var toggleVisibility = function () {
    if (window.scrollY > 400) {
      btn.classList.add('show');
    } else {
      btn.classList.remove('show');
    }
  };
  window.addEventListener('scroll', toggleVisibility, { passive: true });
  toggleVisibility();
  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

// Hamburger + mobile menu
(function () {
  var burger = document.getElementById('hamburger');
  var menu = document.getElementById('mobileMenu');
  if (!burger || !menu) return;

  // Функция закрытия меню
  function closeMenu() {
    burger.classList.remove('active');
    menu.classList.remove('active');
    burger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
  }

  // Функция закрытия при навигации
  var closeOnNavigate = function (e) {
    if (e.target.matches('a[href^="#"]')) {
      closeMenu();
    }
  };

  // Обработчик клика по гамбургеру
  burger.addEventListener('click', function () {
    var isActive = burger.classList.toggle('active');
    menu.classList.toggle('active');
    burger.setAttribute('aria-expanded', String(isActive));
    if (isActive) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
  });

  menu.addEventListener('click', closeOnNavigate);

  // Закрытие при клике вне меню
  document.addEventListener('click', function (e) {
    if (!menu.classList.contains('active')) return;
    if (!menu.contains(e.target) && !burger.contains(e.target)) {
      closeMenu();
    }
  });

  // Закрытие по клавише Esc
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu.classList.contains('active')) {
      closeMenu();
    }
  });
})();

// Top scroll progress bar

// Весь блок индикатора прогресса прокрутки
(function () {
  var bar = document.createElement('div');
  bar.setAttribute('aria-hidden', 'true');
  bar.style.position = 'fixed';
  bar.style.top = '0';
  bar.style.left = '0';
  bar.style.height = '3px';
  bar.style.width = '0%';
  bar.style.zIndex = '1002';
  bar.style.transition = 'width .1s linear';
  document.body.appendChild(bar);

  // Функция установки цвета полосы
  function applyBarColor() {
    try {
      var accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
      if (accent) bar.style.background = accent;
    } catch (e) {}
  }
  applyBarColor();

  // Функция обновления прогресса
  function update() {
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    var scrollHeight = (document.documentElement.scrollHeight || document.body.scrollHeight) - window.innerHeight;
    var pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    bar.style.width = pct + '%';
  }

  // Добавление обработчиков событий, обновляй полосу при прокрутке
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();

  // Отслеживание изменения темы, измени цвет по теме
  try {
    var obs = new MutationObserver(function () { applyBarColor(); });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  } catch (e) {}
})();

// (removed) Active nav item on scroll

// Contact form enhancements: validation + toast success

// Найди форму контактов. Если её нет - ничего не делай
(function () {
  var form = document.querySelector('.contact-form');
  if (!form) return;

  // Покажи ошибку под полем: добавь красную рамку к полю и создай сообщение с текстом ошибки
  function showError(input, msg) {
    input.classList.add('input-error');
    var id = input.name + '-error';
    var el = document.getElementById(id);
    if (!el) {
      el = document.createElement('div');
      el.id = id;
      el.className = 'error-text';
      input.insertAdjacentElement('afterend', el);
    }
    el.textContent = msg;
  }

  // Убери ошибку с поля: сними красную рамку и очисти текст ошибки
  function clearError(input) {
    input.classList.remove('input-error');
    var el = document.getElementById(input.name + '-error');
    if (el) el.textContent = '';
  }

  function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function validatePhone(value) {
    return /^[+]?[-()\d\s]{7,20}$/.test(value);
  }

  // Когда пользователь что-то вводит в любое поле, сразу убери ошибку с этого поля
  form.addEventListener('input', function (e) {
    var t = e.target;
    if (!(t && t.name)) return;
    clearError(t);
  }, { passive: true });

  // Когда пытаются отправить форму, останови стандартную отправку и получи все поля
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = form.elements['name'];
    var email = form.elements['email'];
    var phone = form.elements['phone'];
    var message = form.elements['message'];

    // Проверь каждое поле.  Если что-то не так - покажи ошибку и остановись
    var ok = true;
    if (!name.value.trim()) { showError(name, 'Введите имя'); ok = false; }
    if (!validateEmail(email.value.trim())) { showError(email, 'Некорректный email'); ok = false; }
    if (!validatePhone(phone.value.trim())) { showError(phone, 'Некорректный телефон'); ok = false; }
    if (!message.value.trim()) { showError(message, 'Введите сообщение'); ok = false; }

    if (!ok) return;

    // если все поля корректны, очисти форму (имитируя успешную отправку)
    name.value = '';
    email.value = '';
    phone.value = '';
    message.value = '';

    // Покажи красивое уведомление об успехе, которое само исчезнет через 2 секунды
    var toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = 'Спасибо! Сообщение отправлено (демо)';
    document.body.appendChild(toast);
    requestAnimationFrame(function () {
      toast.classList.add('show');
    });
    setTimeout(function () {
      toast.classList.remove('show');
      setTimeout(function () { if (toast && toast.parentNode) toast.parentNode.removeChild(toast); }, 250);
    }, 1800);
  });
})();
