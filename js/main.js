(() => {
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector("#main-navigation");
  const navigationLinks = navigation.querySelectorAll("a");

  function closeMenu() {
    navigation.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Открыть меню");
  }

  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";

    menuButton.setAttribute("aria-expanded", String(!isOpen));
    menuButton.setAttribute(
      "aria-label",
      isOpen ? "Открыть меню" : "Закрыть меню"
    );
    navigation.classList.toggle("is-open", !isOpen);
  });

  navigationLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
      menuButton.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) {
      closeMenu();
    }
    updateActiveNavLink();
  });

  document.querySelector("#current-year").textContent =
    new Date().getFullYear();

  /* --- Плавное появление секций при прокрутке --- */
  const revealSections = document.querySelectorAll(".section, .closing");

  function revealOnScroll() {
    if (!("IntersectionObserver" in window)) {
      // Фолбэк: если observer недоступен — показываем всё сразу
      revealSections.forEach((section) => section.classList.add("is-visible"));
      return;
    }

    revealSections.forEach((section) => section.classList.add("reveal"));

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0, rootMargin: "0px 0px -80px 0px" }
    );

    revealSections.forEach((section) => observer.observe(section));
  }

  revealOnScroll();

  /* --- Подсветка активного пункта меню (scroll-spy) --- */
  const menuAnchors = Array.from(
    navigation.querySelectorAll('a[href^="#"]')
  );
  const trackedSections = menuAnchors
    .map((link) => ({
      link,
      section: document.getElementById(link.getAttribute("href").slice(1)),
    }))
    .filter((entry) => entry.section);

  // Высота шапки + запас, чтобы заголовок секции не прятался под неё
  const ACTIVE_HEADER_OFFSET = 120;

  function updateActiveNavLink() {
    const scrollPosition = window.scrollY;
    let currentSectionId = "";

    for (const { section } of trackedSections) {
      if (scrollPosition >= section.offsetTop - ACTIVE_HEADER_OFFSET) {
        currentSectionId = section.id;
      } else {
        break;
      }
    }

    menuAnchors.forEach((link) => {
      const isActive =
        currentSectionId && link.getAttribute("href") === `#${currentSectionId}`;
      link.classList.toggle("is-active", Boolean(isActive));
    });
  }

  let scrollFrameRequested = false;

  function onScroll() {
    if (scrollFrameRequested) return;
    scrollFrameRequested = true;
    window.requestAnimationFrame(() => {
      updateActiveNavLink();
      scrollFrameRequested = false;
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  updateActiveNavLink();
})();
