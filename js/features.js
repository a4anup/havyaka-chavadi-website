// Static feature discovery only. Search stays in memory; preferences stay on device.
(async () => {
  const root = document.documentElement;
  const get = (key) => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  };
  const set = (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch {
      /* Optional preference storage. */
    }
  };
  const media = matchMedia("(prefers-color-scheme: dark)");
  let language = get("hc-language") === "en" ? "en" : "kn";
  let theme = get("hc-theme");
  if (!["light", "dark", "auto"].includes(theme)) theme = "auto";
  const toggle = (selector, dataKey, value) => {
    const box = document.querySelector(selector);
    box.querySelectorAll("button").forEach((button, index) => {
      const selected = button.dataset[dataKey] === value;
      button.setAttribute("aria-checked", String(selected));
      button.tabIndex = selected ? 0 : -1;
      if (selected) box.style.setProperty("--i", index);
    });
  };
  for (const selector of ["#langToggle", "#themeToggle"]) {
    document.querySelector(selector).addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key))
        return;
      const buttons = [
        ...event.currentTarget.querySelectorAll("button:not(:disabled)"),
      ];
      const index = buttons.indexOf(event.target);
      if (index < 0) return;
      event.preventDefault();
      const next =
        event.key === "Home"
          ? 0
          : event.key === "End"
            ? buttons.length - 1
            : (index + (event.key === "ArrowRight" ? 1 : -1) + buttons.length) %
              buttons.length;
      buttons[next].focus();
      buttons[next].click();
    });
  }
  const applyTheme = () => {
    root.dataset.theme =
      theme === "auto" ? (media.matches ? "dark" : "light") : theme;
    toggle("#themeToggle", "themeValue", theme);
  };
  document.querySelector("#themeToggle").addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    theme = button.dataset.themeValue;
    set("hc-theme", theme);
    applyTheme();
  });
  media.addEventListener("change", applyTheme);
  applyTheme();

  const search = document.querySelector("#feature-search");
  const cards = [...document.querySelectorAll("[data-roadmap-feature]")];
  const filters = [...document.querySelectorAll("[data-roadmap-filter]")];
  const requestedGroup = new URLSearchParams(location.search).get("group");
  let group = filters.some(
    (button) => button.dataset.roadmapFilter === requestedGroup,
  )
    ? requestedGroup
    : "all";
  let messages;
  try {
    const response = await fetch("../config/locales.json", {
      cache: "no-cache",
    });
    if (!response.ok) throw Error("Locale fetch failed");
    messages = await response.json();
  } catch {
    // The fully rendered Kannada HTML and native detail disclosures still work.
    language = "kn";
    root.lang = language;
    document.querySelector("#feature-tools").hidden = true;
    document.querySelectorAll("#langToggle button").forEach((button) => {
      button.disabled = true;
    });
    return;
  }
  const filter = () => {
    const query = search.value.trim().toLocaleLowerCase();
    let count = 0;
    for (const card of cards) {
      const match =
        (group === "all" || card.dataset.group === group) &&
        card.textContent.toLocaleLowerCase().includes(query);
      card.hidden = !match;
      if (match) count++;
    }
    filters.forEach((button) =>
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.roadmapFilter === group),
      ),
    );
    document.querySelector("#feature-count").textContent = messages[
      language
    ].roadmapCount.replace("{count}", String(count));
    document.querySelector("#feature-empty").hidden = count > 0;
    document.querySelector("#feature-clear").hidden = !search.value;
  };
  const applyLanguage = () => {
    const dictionary = messages[language];
    root.lang = language;
    document.title = `${dictionary.roadmapPageTitle} | ${dictionary.brandName}`;
    document.querySelector('meta[name="description"]').content =
      dictionary.roadmapPageDescription;
    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const value = dictionary[element.dataset.i18n];
      if (value !== undefined) element.textContent = value;
    });
    for (const [attribute, dataKey] of [
      ["aria-label", "i18nAria"],
      ["placeholder", "i18nPlaceholder"],
    ]) {
      document
        .querySelectorAll(
          `[data-${dataKey === "i18nAria" ? "i18n-aria" : "i18n-placeholder"}]`,
        )
        .forEach((element) => {
          const value = dictionary[element.dataset[dataKey]];
          if (value !== undefined) element.setAttribute(attribute, value);
        });
    }
    document.querySelectorAll("[data-feature-more]").forEach((element) => {
      const name = dictionary[`roadmap_feature_${element.dataset.featureMore}`];
      element.setAttribute(
        "aria-label",
        dictionary.roadmapMoreAbout.replace("{name}", name),
      );
    });
    toggle("#langToggle", "lang", language);
    filter();
  };
  document.querySelector("#langToggle").addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    language = button.dataset.lang;
    set("hc-language", language);
    applyLanguage();
  });
  search.addEventListener("input", filter);
  document.querySelector("#feature-clear").addEventListener("click", () => {
    search.value = "";
    filter();
    search.focus();
  });
  filters.forEach((button) =>
    button.addEventListener("click", () => {
      group = button.dataset.roadmapFilter;
      filter();
    }),
  );
  document.querySelector("#feature-reset").addEventListener("click", () => {
    search.value = "";
    group = "all";
    filter();
    search.focus();
  });
  const openAnchor = () => {
    const target = document.getElementById(location.hash.slice(1));
    if (!target?.matches("[data-roadmap-feature]")) return;
    group = "all";
    search.value = "";
    filter();
    target.querySelector("details").open = true;
    target.scrollIntoView({
      block: "start",
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  };
  addEventListener("hashchange", openAnchor);
  applyLanguage();
  if (location.hash) openAnchor();
})();
