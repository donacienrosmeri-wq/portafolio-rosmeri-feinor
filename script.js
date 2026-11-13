

document.addEventListener("DOMContentLoaded", () => {

  const body = document.body;

  const backToTop = document.getElementById("backToTop");



  // 1. Año automático en el pie de página

  document.getElementById("currentYear").textContent = new Date().getFullYear();



  // 2. Modo oscuro / claro (empieza en negro)

  const themeToggle = document.getElementById("themeToggle");

  const themeIcon = document.getElementById("themeIcon");

  const SUN = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4" fill="currentColor"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>';

  const MOON = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor"/></svg>';

  const readTheme = () => { try { return localStorage.getItem("rosmeri-tema"); } catch { return null; } };

  const saveTheme = (t) => { try { localStorage.setItem("rosmeri-tema", t); } catch { /* sin almacenamiento */ } };



  function setTheme(theme) {

    const isDark = theme === "dark";

    body.classList.toggle("dark", isDark);

    themeIcon.innerHTML = isDark ? SUN : MOON;

    themeToggle.setAttribute("aria-label", isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro");

    themeToggle.setAttribute("title", isDark ? "Modo claro" : "Modo oscuro");

    saveTheme(theme);

  }



  setTheme(readTheme() || "dark");

  themeToggle.addEventListener("click", () => setTheme(body.classList.contains("dark") ? "light" : "dark"));



  // 3. Cierra el menú móvil al elegir una sección

  const links = document.querySelectorAll(".navbar-nav .nav-link");

  links.forEach((link) => {

    link.addEventListener("click", () => {

      const menu = document.getElementById("menuPrincipal");

      if (menu.classList.contains("show")) bootstrap.Collapse.getOrCreateInstance(menu).hide();

    });

  });



  // 4. Resalta en el menú la sección que se está viendo

  const sections = [...links].map((l) => document.querySelector(l.getAttribute("href"))).filter(Boolean);

  const setActive = () => {

    const y = window.scrollY + 140;

    let current = null;

    sections.forEach((s) => { if (s.offsetTop <= y) current = s.id; });

    links.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === "#" + current));

  };



  // 5. Botón "volver arriba"

  window.addEventListener("scroll", () => {

    backToTop.classList.toggle("visible", window.scrollY > 350);

    setActive();

  }, { passive: true });

  backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  setActive();



  // 6. Aparición suave de tarjetas al desplazarse

  const targets = document.querySelectorAll(".profile-card, .skill-card, .quote-strip, .internship-panel, .timeline-item, .contact-box");

  if ("IntersectionObserver" in window) {

    const io = new IntersectionObserver((entries) => {

      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in-view"); io.unobserve(e.target); } });

    }, { threshold: 0.12 });

    targets.forEach((el) => { el.classList.add("reveal"); io.observe(el); });

  }



  // 7. Formulario de contacto: envía el mensaje a tu correo (FormSubmit)

  const form = document.getElementById("contactForm");

  const statusEl = document.getElementById("formStatus");

  const sendBtn = document.getElementById("cfEnviar");



  const showStatus = (text, type) => {

    statusEl.className = "form-status" + (type ? " " + type : "");

    statusEl.textContent = text;

  };



  if (form) {

    form.addEventListener("submit", async (e) => {

      e.preventDefault();

      if (!form.checkValidity()) { form.reportValidity(); return; }



      sendBtn.disabled = true;

      showStatus("Enviando…", "");



      try {

        const res = await fetch(form.dataset.endpoint, {

          method: "POST",

          headers: { "Content-Type": "application/json", "Accept": "application/json" },

          body: JSON.stringify(Object.fromEntries(new FormData(form)))

        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok || String(data.success) === "false") throw new Error("envio-fallido");



        form.reset();

        showStatus("¡Mensaje enviado! Gracias por escribirme, te responderé pronto.", "ok");

      } catch {

        showStatus("No se pudo enviar. Inténtalo de nuevo o escríbeme por Instagram o WhatsApp.", "error");

      } finally {

        sendBtn.disabled = false;

      }

    });

  }

});
