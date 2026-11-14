// A mouse wheel sends only deltaY, which a sideways scroller ignores; React's onWheel is passive.
function relayWheel(row: HTMLDivElement) {
  const onWheel = (event: WheelEvent) => {
    if (event.ctrlKey || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) {
      return;
    }
    const sign = getComputedStyle(row).direction === "rtl" ? -1 : 1;
    const travelled = row.scrollLeft * sign;
    const atEdge =
      event.deltaY > 0
        ? travelled >= row.scrollWidth - row.clientWidth - 1
        : travelled < 1;
    if (atEdge) {
      return;
    }
    event.preventDefault();
    row.scrollBy({ left: event.deltaY * sign });
  };
  row.addEventListener("wheel", onWheel, { passive: false });
  return () => {
    row.removeEventListener("wheel", onWheel);
  };
}

export { relayWheel };
