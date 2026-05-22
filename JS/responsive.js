// Mobile navigation 
(function () {
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  if (!toggle || !links) return;

  const closeMenu = () => {
    links.classList.remove("open");
    toggle.classList.remove("active");
    toggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-open");
  };

  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = links.classList.toggle("open");
    toggle.classList.toggle("active", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("nav-open", isOpen);
  });


  links.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", closeMenu)
  );
  document.addEventListener("click", (e) => {
    if (!links.contains(e.target) && !toggle.contains(e.target)) closeMenu();
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 992) closeMenu();
  });
})();
