/** iOS keeps window scroll when body overflow is hidden — pin body during fullscreen overlays. */

let lockCount = 0;
/** @type {number} */
let lockedScrollY = 0;

export function lockBodyScroll() {
  if (lockCount === 0) {
    lockedScrollY = window.scrollY || document.documentElement.scrollTop || 0;
    document.body.style.position = "fixed";
    document.body.style.top = `-${lockedScrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
    document.documentElement.style.overflow = "hidden";
  }
  lockCount += 1;
}

export function unlockBodyScroll() {
  if (lockCount === 0) return;
  lockCount -= 1;
  if (lockCount > 0) return;

  const restoreY = lockedScrollY;
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.left = "";
  document.body.style.right = "";
  document.body.style.width = "";
  document.documentElement.style.overflow = "";
  window.scrollTo(0, restoreY);
}
