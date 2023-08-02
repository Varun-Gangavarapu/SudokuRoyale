export function showOrHide(candidate) {
  if (candidate.parentNode.parentNode.classList.contains("tile-selected")) {
    if (candidate.classList.contains("hidden")) {
      candidate.classList.remove("hidden");
    } else {
      candidate.classList.add("hidden");
    }
  }
}
    