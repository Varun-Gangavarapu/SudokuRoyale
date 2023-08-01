
export function handleControlClick(e) {
    let temp = e.currentTarget
    if (temp.id == 'numbers-mode') {
        document.getElementById('candidates-mode').classList.remove('active-mode');
        temp.classList.add('active-mode');
    }
    else {
        document.getElementById('numbers-mode').classList.remove('active-mode');
        temp.classList.add('active-mode');
    }
}