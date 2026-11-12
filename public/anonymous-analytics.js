/* Anonymous aggregate counters for the standalone product pages. */
(() => {
  const page = window.location.pathname;
  const product = page === "/parking-master/index.html" ? "parking-master"
    : page === "/merge-slime/index.html" ? "merge-slime" : null;
  if (!product) return;
  const send = (event, target) => {
    fetch("/api/analytics", {
      method: "POST", credentials: "omit", referrerPolicy: "no-referrer", keepalive: true,
      headers: { "Content-Type": "application/json" }, body: JSON.stringify({ event, target }),
    }).catch(() => {});
  };
  send("page_view", page);
  // The parking page is a download landing page, not the running native game.
  if (product === "merge-slime") send("product_open", product);
  document.addEventListener("click", event => {
    const link = event.target instanceof Element ? event.target.closest("a[href]") : null;
    if (!link || event.defaultPrevented || event.button > 0) return;
    const url = new URL(link.href, location.origin);
    if (/\.(dmg|apk|exe|msi|zip)$/i.test(url.pathname)) send("download", product);
  });
})();
