(function () {
  "use strict";

  /* ---------------- Ano no rodapé ---------------- */
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ---------------- Menu mobile ---------------- */
  var navToggle = document.getElementById("navToggle");
  var navMenu = document.getElementById("navMenu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      var isOpen = navMenu.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      navToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
    });

    navMenu.querySelectorAll(".nav-link").forEach(function (link) {
      link.addEventListener("click", function () {
        navMenu.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Abrir menu");
      });
    });
  }

  /* ---------------- Destaque do link ativo na navegação ---------------- */
  var navLinks = document.querySelectorAll(".nav-link[href^='#']");
  var sections = [];
  navLinks.forEach(function (link) {
    var id = link.getAttribute("href").slice(1);
    var section = document.getElementById(id);
    if (section) {
      sections.push({ link: link, section: section });
    }
  });

  if (sections.length && "IntersectionObserver" in window) {
    var navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var match = sections.find(function (item) {
            return item.section === entry.target;
          });
          if (match && entry.isIntersecting) {
            navLinks.forEach(function (l) {
              l.classList.remove("is-active");
            });
            match.link.classList.add("is-active");
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );

    sections.forEach(function (item) {
      navObserver.observe(item.section);
    });
  }

  /* ---------------- Animação suave ao rolar (reveal on scroll) ---------------- */
  var revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ---------------- Copiar e-mail com feedback visual ---------------- */
  var copyBtn = document.getElementById("copyEmailBtn");
  var copyLabel = document.getElementById("copyEmailLabel");
  var emailText = document.getElementById("emailText");

  if (copyBtn && emailText) {
    copyBtn.addEventListener("click", function () {
      var email = emailText.textContent.trim();
      var restoreLabel = "Copiar e-mail";

      function showCopied() {
        copyLabel.textContent = "E-mail copiado!";
        copyBtn.classList.add("is-copied");
        setTimeout(function () {
          copyLabel.textContent = restoreLabel;
          copyBtn.classList.remove("is-copied");
        }, 2200);
      }

      function showError() {
        copyLabel.textContent = "Não foi possível copiar";
        setTimeout(function () {
          copyLabel.textContent = restoreLabel;
        }, 2200);
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(showCopied, showError);
      } else {
        var tempInput = document.createElement("textarea");
        tempInput.value = email;
        tempInput.setAttribute("readonly", "");
        tempInput.style.position = "absolute";
        tempInput.style.left = "-9999px";
        document.body.appendChild(tempInput);
        tempInput.select();
        try {
          document.execCommand("copy");
          showCopied();
        } catch (err) {
          showError();
        }
        document.body.removeChild(tempInput);
      }
    });
  }

  /* ---------------- Formulário de contato com validação ---------------- */
  var form = document.getElementById("contactForm");

  if (form) {
    var nameInput = document.getElementById("name");
    var emailInput = document.getElementById("email");
    var messageInput = document.getElementById("message");

    var nameError = document.getElementById("nameError");
    var emailError = document.getElementById("emailError");
    var messageError = document.getElementById("messageError");
    var formSuccess = document.getElementById("formSuccess");

    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function setFieldError(input, errorEl, message) {
      input.closest(".form-row").classList.toggle("has-error", Boolean(message));
      errorEl.textContent = message || "";
    }

    function validateField(input, errorEl) {
      var value = input.value.trim();

      if (!value) {
        setFieldError(input, errorEl, "Este campo é obrigatório.");
        return false;
      }

      if (input === emailInput && !emailPattern.test(value)) {
        setFieldError(input, errorEl, "Informe um e-mail válido.");
        return false;
      }

      setFieldError(input, errorEl, "");
      return true;
    }

    [
      [nameInput, nameError],
      [emailInput, emailError],
      [messageInput, messageError]
    ].forEach(function (pair) {
      pair[0].addEventListener("blur", function () {
        validateField(pair[0], pair[1]);
      });
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      formSuccess.textContent = "";

      var isNameValid = validateField(nameInput, nameError);
      var isEmailValid = validateField(emailInput, emailError);
      var isMessageValid = validateField(messageInput, messageError);

      if (!isNameValid || !isEmailValid || !isMessageValid) {
        return;
      }

      var subject = encodeURIComponent("Contato via site — " + nameInput.value.trim());
      var body = encodeURIComponent(
        nameInput.value.trim() +
          " (" + emailInput.value.trim() + ") escreveu:\n\n" +
          messageInput.value.trim()
      );

      window.location.href = "mailto:marauje@hotmail.com?subject=" + subject + "&body=" + body;

      formSuccess.textContent = "Seu cliente de e-mail será aberto para concluir o envio.";
      form.reset();
    });
  }
})();
