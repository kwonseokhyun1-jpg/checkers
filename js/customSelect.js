/** Themed dropdown that replaces native <select> menus (especially on iOS). */

const OPEN_SELECTS = new Set();

function closeAllExcept(keep) {
  for (const api of OPEN_SELECTS) {
    if (api !== keep) api.close();
  }
}

/**
 * @param {HTMLSelectElement | null | undefined} selectEl
 * @returns {{ close: () => void, rebuild: () => void, isOpen: () => boolean } | null}
 */
export function enhanceSelect(selectEl) {
  if (!selectEl || selectEl.dataset.customSelectEnhanced) {
    return selectEl?._customSelectApi ?? null;
  }
  selectEl.dataset.customSelectEnhanced = "1";

  const wrapper = document.createElement("div");
  wrapper.className = "custom-select";

  const trigger = document.createElement("button");
  trigger.type = "button";
  trigger.className = "custom-select__trigger select-input";
  trigger.setAttribute("aria-haspopup", "listbox");
  trigger.setAttribute("aria-expanded", "false");

  const chevron = document.createElement("span");
  chevron.className = "custom-select__chevron";
  chevron.setAttribute("aria-hidden", "true");
  chevron.textContent = "▾";

  const label = document.createElement("span");
  label.className = "custom-select__label";

  const list = document.createElement("div");
  list.className = "custom-select__list hidden";
  list.setAttribute("role", "listbox");

  const selectId = selectEl.id;
  if (selectId) {
    trigger.id = selectId;
    selectEl.removeAttribute("id");
  }

  const labelledBy = selectEl.getAttribute("aria-label")
    ? null
    : document.querySelector(`label[for="${selectId}"]`)?.id;
  if (labelledBy) {
    trigger.setAttribute("aria-labelledby", labelledBy);
  } else if (selectEl.getAttribute("aria-label")) {
    trigger.setAttribute("aria-label", selectEl.getAttribute("aria-label"));
  }

  selectEl.classList.add("custom-select__native");
  selectEl.tabIndex = -1;
  selectEl.setAttribute("aria-hidden", "true");

  const parent = selectEl.parentNode;
  parent.insertBefore(wrapper, selectEl);
  wrapper.appendChild(selectEl);
  wrapper.appendChild(trigger);
  trigger.appendChild(label);
  trigger.appendChild(chevron);
  wrapper.appendChild(list);

  let open = false;
  let activeIndex = -1;

  function options() {
    return [...selectEl.options];
  }

  function selectedOption() {
    return selectEl.options[selectEl.selectedIndex] ?? null;
  }

  function syncTrigger() {
    const selected = selectedOption();
    label.textContent = selected?.textContent?.trim() || "Select…";
    trigger.disabled = selectEl.disabled;
    wrapper.classList.toggle("custom-select--disabled", selectEl.disabled);
    list.querySelectorAll(".custom-select__option").forEach((el) => {
      const isSelected = el.dataset.value === selectEl.value;
      el.classList.toggle("custom-select__option--selected", isSelected);
      el.setAttribute("aria-selected", isSelected ? "true" : "false");
    });
  }

  function patchProperty(name) {
    const desc = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, name);
    if (!desc?.set || !desc?.get) return;
    Object.defineProperty(selectEl, name, {
      configurable: true,
      enumerable: desc.enumerable,
      get() {
        return desc.get.call(this);
      },
      set(v) {
        desc.set.call(this, v);
        syncTrigger();
      },
    });
  }

  patchProperty("value");
  patchProperty("selectedIndex");
  patchProperty("disabled");

  function rebuild() {
    list.innerHTML = "";
    for (const opt of options()) {
      const item = document.createElement("button");
      item.type = "button";
      item.className = "custom-select__option";
      item.setAttribute("role", "option");
      item.dataset.value = opt.value;
      item.textContent = opt.textContent?.trim() || opt.value;
      item.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (selectEl.disabled) return;
        selectEl.value = opt.value;
        selectEl.dispatchEvent(new Event("change", { bubbles: true }));
        syncTrigger();
        close();
      });
      list.appendChild(item);
    }
    syncTrigger();
  }

  function setActiveIndex(index) {
    const items = [...list.querySelectorAll(".custom-select__option")];
    if (!items.length) return;
    activeIndex = Math.max(0, Math.min(index, items.length - 1));
    items.forEach((el, i) => {
      el.classList.toggle("custom-select__option--active", i === activeIndex);
    });
    items[activeIndex]?.scrollIntoView({ block: "nearest" });
  }

  function openList() {
    if (open || selectEl.disabled) return;
    closeAllExcept(api);
    open = true;
    OPEN_SELECTS.add(api);
    list.classList.remove("hidden");
    wrapper.classList.add("custom-select--open");
    trigger.setAttribute("aria-expanded", "true");
    const selectedIndex = Math.max(0, selectEl.selectedIndex);
    setActiveIndex(selectedIndex);
    document.addEventListener("click", onDocPointer);
    document.addEventListener("keydown", onDocKey);
  }

  function close() {
    if (!open) return;
    open = false;
    OPEN_SELECTS.delete(api);
    list.classList.add("hidden");
    wrapper.classList.remove("custom-select--open");
    trigger.setAttribute("aria-expanded", "false");
    activeIndex = -1;
    list.querySelectorAll(".custom-select__option--active").forEach((el) => {
      el.classList.remove("custom-select__option--active");
    });
    document.removeEventListener("click", onDocPointer);
    document.removeEventListener("keydown", onDocKey);
  }

  function isOpen() {
    return open;
  }

  const api = { close, rebuild, isOpen };
  selectEl._customSelectApi = api;

  trigger.addEventListener("click", (e) => {
    e.stopPropagation();
    if (selectEl.disabled) return;
    if (open) close();
    else openList();
  });

  trigger.addEventListener("keydown", (e) => {
    if (selectEl.disabled) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!open) openList();
      if (e.key === "ArrowDown") setActiveIndex(activeIndex + 1);
      if (e.key === "ArrowUp") setActiveIndex(activeIndex <= 0 ? 0 : activeIndex - 1);
      if ((e.key === "Enter" || e.key === " ") && activeIndex >= 0) {
        const items = [...list.querySelectorAll(".custom-select__option")];
        items[activeIndex]?.click();
      }
    }
    if (e.key === "Escape") close();
  });

  const onDocPointer = (e) => {
    if (!wrapper.isConnected) {
      close();
      return;
    }
    if (!wrapper.contains(e.target)) close();
  };

  const onDocKey = (e) => {
    if (e.key === "Escape") close();
  };

  const observer = new MutationObserver(() => {
    rebuild();
  });
  observer.observe(selectEl, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["disabled", "value", "selected"],
  });

  selectEl.addEventListener("change", syncTrigger);

  const origRemove = selectEl.remove.bind(selectEl);
  selectEl.remove = function removeWithCleanup() {
    close();
    observer.disconnect();
    origRemove();
    if (wrapper.isConnected) wrapper.remove();
  };

  rebuild();
  return api;
}

/** Native `<select>` whether or not it was wrapped by enhanceSelect (id may live on the trigger). */
export function resolveNativeSelect(idOrEl) {
  if (!idOrEl) return null;
  const el = typeof idOrEl === "string" ? document.getElementById(idOrEl) : idOrEl;
  if (!el) return null;
  if (el.tagName === "SELECT") return el;
  const wrapper = el.closest(".custom-select");
  return wrapper?.querySelector("select.custom-select__native") ?? null;
}

/** Enhance every themed select on the page. */
export function enhanceAllSelectInputs(root = document) {
  root
    .querySelectorAll(
      "select.select-input:not([data-custom-select-enhanced]):not([data-no-custom-select])",
    )
    .forEach((el) => {
      enhanceSelect(el);
    });
}
