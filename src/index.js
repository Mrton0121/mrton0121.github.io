function isFirstVisit() {
    const referrer = document.referrer;
    const currentDomain = window.location.origin;

    if (referrer && referrer.startsWith(currentDomain)) {
        return false;
    }

    const hasVisited = sessionStorage.getItem('hasVisitedMain');
    if (hasVisited) {
        return false;
    }

    sessionStorage.setItem('hasVisitedMain', 'true');
    return true;
}

function initializePage() {
    if (isFirstVisit()) {
        showIntroduction();
        return;
    }

    showAllContentImmediately();
}

function showAllContentImmediately() {
    const catCommand = document.getElementById('cat-command');
    catCommand.textContent = '$ cat introduction.html';
    catCommand.classList.remove('typing-effect');

    document.getElementById('welcome-section').classList.add('visible');
}

function typeText(elementId, text, options = {}) {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error(`Element with ID '${elementId}' not found`);
        return;
    }

    const config = {
        speed: 45,
        removeCursor: false,
        showElementId: null,
        showDelay: 0,
        onComplete: null,
        ...options
    };

    let index = 0;
    element.textContent = '';

    const typingInterval = setInterval(() => {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            return;
        }

        clearInterval(typingInterval);

        if (config.removeCursor) {
            element.classList.remove('typing-effect');
        }

        if (config.showElementId) {
            setTimeout(() => {
                const elementToShow = document.getElementById(config.showElementId);
                if (elementToShow) {
                    elementToShow.classList.add('visible');
                }
            }, config.showDelay);
        }

        if (typeof config.onComplete === 'function') {
            config.onComplete();
        }
    }, config.speed);
}

function showIntroduction() {
    typeText('cat-command', '$ cat introduction.html', {
        removeCursor: true,
        showElementId: 'welcome-section',
        showDelay: 0
    });
}

document.addEventListener('DOMContentLoaded', initializePage);
