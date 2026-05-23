const { ipcRenderer } = require('electron');

document.getElementById('btn-minimize').addEventListener('click', () => {
    ipcRenderer.send('window-minimize');
});

document.getElementById('btn-maximize').addEventListener('click', () => {
    ipcRenderer.send('window-maximize');
});

document.getElementById('btn-close').addEventListener('click', () => {
    ipcRenderer.send('window-close');
});

const titleBar = document.getElementById('title-bar');

titleBar.addEventListener('mouseenter', () => {
    titleBar.style.outlineColor = 'var(--txt-4)';
});
titleBar.addEventListener('mouseleave', () => {
    titleBar.style.outlineColor = 'var(--bg-3)';
});