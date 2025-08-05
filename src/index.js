/**
 * Check if user is returning from a subpage or visiting for the first time
 * @returns {boolean} - true if first visit, false if returning
 */
function isFirstVisit() {
    // Check if this is a navigation back from a subpage
    const referrer = document.referrer;
    const currentDomain = window.location.origin;
    
    // If there's a referrer from the same domain, it's likely a return visit
    if (referrer && referrer.startsWith(currentDomain)) {
        return false;
    }
    
    // Check session storage for visit tracking
    const hasVisited = sessionStorage.getItem('hasVisitedMain');
    if (hasVisited) {
        return false;
    }
    
    // Mark as visited for this session
    sessionStorage.setItem('hasVisitedMain', 'true');
    return true;
}

/**
 * Initialize the page - with or without animation based on visit status
 */
function initializePage() {
    if (isFirstVisit()) {
        // First visit - play full animation
        simulateTyping('cat-command');
    } else {
        // Return visit - show everything immediately
        showAllContentImmediately();
    }
}

/**
 * Show all content immediately without animation (for return visits)
 */
function showAllContentImmediately() {
    // Show the first command without typing
    const catCommand = document.getElementById('cat-command');
    catCommand.textContent = '$ cat introduction.html';
    catCommand.classList.remove('typing-effect');
    
    // Show welcome section immediately
    document.getElementById('welcome-section').classList.add('visible');
    
    // Show second command line immediately
    document.getElementById('new-command-line').style.display = 'flex';
    document.getElementById('new-command-line').style.visibility = 'visible';
    
    // Show the typed space and ls command
    const typedSpace = document.getElementById('typed-space');
    typedSpace.innerHTML = '&nbsp;ls pages';
    typedSpace.classList.remove('typing-effect');
    
    // Show pages list immediately
    document.getElementById('pages-list').style.display = 'block';
    document.getElementById('pages-list').style.visibility = 'visible';
    document.getElementById('pages-list').classList.add('visible');
    
    // Show final command line immediately
    document.getElementById('final-command-line').style.display = 'flex';
    document.getElementById('final-command-line').style.visibility = 'visible';
    
    // Show final cursor with space and blinking
    const finalCursor = document.getElementById('final-cursor');
    finalCursor.innerHTML = '&nbsp;';
    // Keep the typing-effect class for the blinking cursor
}

/**
 * Universal typing effect function
 * @param {string} elementId - ID of the element to type into
 * @param {string} text - Text to type
 * @param {Object} options - Configuration options
 * @param {number} options.speed - Typing speed in milliseconds (default: 100)
 * @param {boolean} options.removeCursor - Whether to remove typing effect after completion (default: false)
 * @param {string} options.showElementId - ID of element to display after typing (optional)
 * @param {number} options.showDelay - Delay before showing element in milliseconds (default: 0)
 * @param {Function} options.onComplete - Callback function to execute after typing is complete
 */
function typeText(elementId, text, options = {}) {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error(`Element with ID '${elementId}' not found`);
        return;
    }

    // Default options
    const config = {
        speed: 100,
        removeCursor: false,
        showElementId: null,
        showDelay: 0,
        onComplete: null,
        ...options
    };

    let index = 0;
    element.textContent = ''; // Clear existing content

    const typingInterval = setInterval(() => {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
        } else {
            clearInterval(typingInterval);
            
            // Remove cursor if requested
            if (config.removeCursor) {
                element.classList.remove("typing-effect");
            }
            
            // Show element if specified
            if (config.showElementId) {
                setTimeout(() => {
                    const elementToShow = document.getElementById(config.showElementId);
                    if (elementToShow) {
                        elementToShow.style.display = 'block';
                        elementToShow.style.visibility = 'visible';
                        // Add visible class if it exists (for CSS transitions)
                        elementToShow.classList.add('visible');
                    } else {
                        console.error(`Element with ID '${config.showElementId}' not found`);
                    }
                }, config.showDelay);
            }
            
            // Execute callback if provided
            if (config.onComplete && typeof config.onComplete === 'function') {
                config.onComplete();
            }
        }
    }, config.speed);
}

/**
 * Type HTML content (useful for &nbsp; and other HTML entities)
 * @param {string} elementId - ID of the element to type into
 * @param {string} htmlContent - HTML content to type
 * @param {Object} options - Configuration options (same as typeText)
 * @param {number} options.speed - Typing speed in milliseconds (default: 100)
 * @param {boolean} options.removeCursor - Whether to remove typing effect after completion (default: false)
 * @param {string} options.showElementId - ID of element to display after typing (optional)
 * @param {number} options.showDelay - Delay before showing element in milliseconds (default: 0)
 * @param {Function} options.onComplete - Callback function to execute after typing is complete
 */
function typeHTML(elementId, htmlContent, options = {}) {
    const element = document.getElementById(elementId);
    if (!element) {
        console.error(`Element with ID '${elementId}' not found`);
        return;
    }

    const config = {
        speed: 100,
        removeCursor: false,
        showElementId: null,
        showDelay: 0,
        onComplete: null,
        ...options
    };

    element.innerHTML = ''; // Clear existing content
    
    // For HTML content, we'll add it all at once after a delay to simulate typing
    setTimeout(() => {
        element.innerHTML = htmlContent;
        
        if (config.removeCursor) {
            element.classList.remove("typing-effect");
        }
        
        // Show element if specified
        if (config.showElementId) {
            setTimeout(() => {
                const elementToShow = document.getElementById(config.showElementId);
                if (elementToShow) {
                    elementToShow.style.display = 'block';
                    elementToShow.style.visibility = 'visible';
                    // Add visible class if it exists (for CSS transitions)
                    elementToShow.classList.add('visible');
                } else {
                    console.error(`Element with ID '${config.showElementId}' not found`);
                }
            }, config.showDelay);
        }
        
        if (config.onComplete && typeof config.onComplete === 'function') {
            config.onComplete();
        }
    }, config.speed);
}

// Legacy function for backward compatibility
function simulateTyping(elementId) {
    typeText(elementId, "$ cat introduction.html", {
        speed: 100,
        removeCursor: true,
        showElementId: "welcome-section",
        showDelay: 0,
        onComplete: () => {
            // Show new command line after 1 second
            setTimeout(() => {
                document.getElementById("new-command-line").style.display = 'flex';
                document.getElementById("new-command-line").style.visibility = 'visible';
                
                // Type a space in the new command prompt
                typeHTML("typed-space", "&nbsp;", {
                    speed: 100,
                    removeCursor: false,
                    onComplete: () => {
                        // After typing space, wait a moment then type the ls command
                        setTimeout(() => {
                            typeText("typed-space", "ls pages", {
                                speed: 100,
                                removeCursor: true,
                                showElementId: "pages-list",
                                showDelay: 300,
                                onComplete: () => {
                                    // Show final command line after pages list is displayed
                                    setTimeout(() => {
                                        document.getElementById("final-command-line").style.display = 'flex';
                                        document.getElementById("final-command-line").style.visibility = 'visible';
                                        
                                        // Type a non-breaking space with blinking cursor
                                        typeHTML("final-cursor", "&nbsp;", {
                                            speed: 100,
                                            removeCursor: false // Keep the blinking cursor
                                        });
                                    }, 500);
                                }
                            });
                        }, 800);
                    }
                });
            }, 1000);
        }
    });
}

// Legacy function for backward compatibility
function typeSpace() {
    typeHTML("typed-space", "&nbsp;", {
        speed: 100,
        removeCursor: false
    });
}
