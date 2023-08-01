export function showOrHide(candidate) {
  if (candidate.classList.contains("hidden")) {
    candidate.classList.remove("hidden");
  } else {
    candidate.classList.add("hidden");
  }
}
