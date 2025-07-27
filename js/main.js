document.querySelectorAll(".lang-switch .lang").forEach((a) => {
  a.addEventListener("click", () => {
    const code = (a.dataset.lang || "").toLowerCase();
    if (code) localStorage.setItem("lang", code);
  });
});

(function () {
  const htmlLang = (document.documentElement.lang || "sk")
    .slice(0, 2)
    .toLowerCase();
  const current = htmlLang === "cz" ? "cs" : htmlLang;
  document.querySelectorAll(".lang-switch .lang").forEach((a) => {
    const code = (a.dataset.lang || "").toLowerCase();
    if (code === current) {
      a.classList.add("active");
      a.setAttribute("aria-current", "page");
    } else {
      a.classList.remove("active");
      a.removeAttribute("aria-current");
    }
  });
})();
