import type { AnyRouter } from "@tanstack/react-router";

// The home page's first-load timeline, in ms. Everything plays inside the logo's spin
// and the last item lands as it settles, so the page reads as one gesture.
const timeline = {
  items: 300,
  itemFor: 450,
  spinFor: 1000,
  wordStep: 60,
  words: 60,
  wordFor: 500,
};

/**
 * Marks `<html>` with `data-navigated` once the reader moves to another page. The entrance
 * styles turn off under it, so the entrance plays on the first document load only, and no
 * render after hydration ever changes them mid-animation.
 */
function markNavigations(router: AnyRouter) {
  router.subscribe("onBeforeNavigate", ({ fromLocation, pathChanged }) => {
    if (fromLocation && pathChanged) {
      document.documentElement.dataset.navigated = "";
    }
  });
}

export { markNavigations, timeline };
