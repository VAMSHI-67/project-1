import { siteConfig } from "../data/site";

const isMobileDevice = () => {
  if (typeof navigator === "undefined") return false;

  return /Android|iPhone|iPad|iPod|Mobile|Opera Mini|IEMobile/i.test(navigator.userAgent);
};

const buildQuery = (text?: string) => {
  const params = new URLSearchParams({ phone: siteConfig.contact.phoneRaw });
  if (text) {
    params.set("text", text);
  }
  return params.toString();
};

export const getWhatsAppHref = (text?: string) =>
  `https://api.whatsapp.com/send?${buildQuery(text)}`;

export const openWhatsAppConversation = (text?: string) => {
  const query = buildQuery(text);
  const mobileSchemeUrl = `whatsapp://send?${query}`;
  const desktopWebUrl = `https://web.whatsapp.com/send?${query}`;
  const fallbackUrl = `https://api.whatsapp.com/send?${query}`;

  if (typeof window === "undefined") {
    return;
  }

  if (isMobileDevice()) {
    let appOpened = false;
    const handleVisibility = () => {
      if (document.visibilityState === "hidden") {
        appOpened = true;
      }
    };

    document.addEventListener("visibilitychange", handleVisibility, { once: true });
    window.location.href = mobileSchemeUrl;

    window.setTimeout(() => {
      document.removeEventListener("visibilitychange", handleVisibility);
      if (!appOpened) {
        window.location.assign(fallbackUrl);
      }
    }, 900);
    return;
  }

  const popup = window.open(desktopWebUrl, "_blank", "noopener,noreferrer");
  if (!popup) {
    window.location.assign(fallbackUrl);
  }
};
