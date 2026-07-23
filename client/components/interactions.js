const { debouncedUpdate, onCreate, onUpdate, v } = require("valyrian.js");

function closeExpansionOnEscape(event) {
  const details = event.target.closest("details");
  if (event.key !== "Escape" || details?.open !== true) {
    return;
  }
  details.open = false;
  details.querySelector("summary")?.focus();
}

function CopyButton({ labels }) {
  return v(
    "button",
    {
      class: "text-xs",
      "data-copy": "true",
      onclick: async (event) => {
        const block = event.target.closest(".code-block");
        const code = block?.querySelector("code")?.textContent;
        const status = block?.querySelector("[data-copy-status]");
        if (typeof code !== "string" || status === null) {
          return;
        }
        try {
          await navigator.clipboard.writeText(code);
          status.textContent = labels.copySuccess;
        } catch {
          status.textContent = labels.copyError;
        }
      },
      type: "button",
    },
    labels.copy,
  );
}

function TocLifecycle({ browser }, children) {
  onCreate(() => {
    const document = browser.document;
    const headings = [
      ...document.querySelectorAll(
        ".markdown h2[id], .markdown h3[id], .structured-document h2[id]",
      ),
    ];
    if (headings.length === 0) {
      return;
    }
    const updateToc = () => {
      let active = headings[0];
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top > browser.innerHeight * 0.3) {
          break;
        }
        active = heading;
      }
      for (const link of document.querySelectorAll("[data-toc-link]")) {
        if (link.getAttribute("href") === `#${active.id}`) {
          link.setAttribute("aria-current", "location");
        } else {
          link.removeAttribute("aria-current");
        }
      }
    };
    updateToc();
    browser.addEventListener("scroll", updateToc, { passive: true });
    document.body.addEventListener("scroll", updateToc, { passive: true });
    return () => {
      browser.removeEventListener("scroll", updateToc);
      document.body.removeEventListener("scroll", updateToc);
    };
  });
  return children[0];
}

function UpdateNotice({ labels, pwa }) {
  const subscribe = () => {
    if (pwa === null) {
      return;
    }
    const refresh = () => debouncedUpdate(0);
    const unsubscribe = [
      pwa.manager.on("registered", refresh),
      pwa.manager.on("updateavailable", refresh),
      pwa.manager.on("updated", refresh),
    ];
    return () => {
      for (const stop of unsubscribe) {
        stop();
      }
    };
  };
  onCreate(subscribe);
  onUpdate(subscribe);

  return v(
    "aside",
    {
      "aria-label": labels.updateTitle,
      class: "pwa-update",
      "data-notification": "bottom center",
      "data-pwa-update": true,
      hidden: pwa?.updateAvailable !== true,
      role: "region",
    },
    v("p", { "aria-live": "polite", role: "status" }, labels.updateMessage),
    v(
      "button",
      {
        "data-pwa-apply": true,
        onclick: () => {
          if (pwa?.updateAvailable !== true) {
            return;
          }
          pwa.applyUpdate();
        },
        type: "button",
      },
      labels.updateAction,
    ),
    v(
      "button",
      {
        "data-pwa-cancel": true,
        onclick: () => {
          if (pwa?.updateAvailable === true) {
            pwa.dismissUpdate();
          }
        },
        type: "button",
      },
      labels.updateCancel,
    ),
  );
}

module.exports = {
  closeExpansionOnEscape,
  CopyButton,
  TocLifecycle,
  UpdateNotice,
};
