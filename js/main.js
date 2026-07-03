import "./styles.js";
import "./viewportInsets.js";
import "./splash.js";
import { initMobileConfirm } from "./mobileConfirm.js";
import { initInstallPrompt } from "./installPrompt.js";
import "./app.js";

if (import.meta.env.PROD) {
  import("virtual:pwa-register").then(({ registerSW }) => {
    registerSW({ immediate: true });
  });
}

initMobileConfirm();
initInstallPrompt();
