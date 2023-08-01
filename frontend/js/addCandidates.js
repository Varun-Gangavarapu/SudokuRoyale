import { showOrHide } from "./eventListeners/candidate.js";

export function addCandidates(tile) {
        // Create the candidates container
        var candidates = document.createElement('div');
        candidates.className = "candidates";
    
        // Create each individual candidate and add it to the candidates container
        for(var i = 1; i <= 9; i++) {
            var candidateDiv = document.createElement('div');
            candidateDiv.className = `candidate${i} hidden`;
            candidateDiv.textContent = i;
            candidates.appendChild(candidateDiv);
            candidateDiv.addEventListener('click', handleCandidateClick)
        }
    
        // Add the candidates container to the provided element
        tile.appendChild(candidates);
}

export function handleCandidateClick(e) {
    showOrHide(e.currentTarget)
}