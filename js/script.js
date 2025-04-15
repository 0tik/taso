document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const body = document.body; // Get the body element

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent click from bubbling to the document
            mainNav.classList.toggle('active');
            menuToggle.classList.toggle('active');
            body.classList.toggle('no-scroll'); // Toggle body scroll lock
        });
    }

    // Close menu if clicking *outside* of it (only if it's active)
    document.addEventListener('click', (event) => {
        if (mainNav.classList.contains('active')) {
            const isClickInsideNav = mainNav.contains(event.target);
            // Don't check for isClickOnToggle here, let the toggle handle its own clicks

            if (!isClickInsideNav) {
                mainNav.classList.remove('active');
                menuToggle.classList.remove('active');
                body.classList.remove('no-scroll'); // Remove body scroll lock
            }
        }
    });

     // Optional: Prevent clicks inside the nav from closing it (useful if nav has interactive elements)
     if (mainNav) {
         mainNav.addEventListener('click', (event) => {
             event.stopPropagation();
         });
     }

}); 