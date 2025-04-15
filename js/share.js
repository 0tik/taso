document.addEventListener('DOMContentLoaded', () => {
    const shareContainers = document.querySelectorAll('.share-container');

    shareContainers.forEach(container => {
        const shareButton = container.querySelector('.share-button');
        const shareOptions = container.querySelector('.share-options');
        const copyLinkButton = container.querySelector('.copy-link');
        const facebookLink = container.querySelector('.facebook');
        const pinterestLink = container.querySelector('.pinterest');
        const twitterLink = container.querySelector('.twitter');

        // Toggle Popover
        shareButton.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent click from bubbling up to document
            const isActive = container.classList.toggle('active');
            shareButton.setAttribute('aria-expanded', isActive);
        });

        // Close popover if clicked outside
        document.addEventListener('click', (event) => {
            if (!container.contains(event.target)) {
                container.classList.remove('active');
                shareButton.setAttribute('aria-expanded', 'false');
            }
        });

        // Prevent clicks inside options from closing it
        shareOptions.addEventListener('click', (event) => {
            event.stopPropagation();
        });

        // --- Share Link Logic --- 
        const pageUrl = window.location.href;
        const pageTitle = document.title;
        // Attempt to find a primary image (you might need a more specific selector)
        const mainImage = document.querySelector('main img') || document.querySelector('.image-slider img') || ''; // Basic fallback
        const imageUrl = mainImage ? mainImage.src : '';

        // Facebook
        if (facebookLink) {
            facebookLink.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`;
            facebookLink.target = '_blank'; // Open in new tab
        }

        // Pinterest (requires URL and image URL)
        if (pinterestLink) {
             if (imageUrl) {
                 pinterestLink.href = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(pageUrl)}&media=${encodeURIComponent(imageUrl)}&description=${encodeURIComponent(pageTitle)}`;
             } else {
                 // Fallback if no image found - might not work well on Pinterest
                 pinterestLink.href = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(pageUrl)}&description=${encodeURIComponent(pageTitle)}`;
             }
             pinterestLink.target = '_blank';
        }

        // Twitter (X)
        if (twitterLink) {
            twitterLink.href = `https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(pageTitle)}`;
            twitterLink.target = '_blank';
        }

        // Copy Link
        if (copyLinkButton) {
            copyLinkButton.addEventListener('click', async () => {
                try {
                    await navigator.clipboard.writeText(pageUrl);
                    // Provide feedback
                    const originalText = copyLinkButton.innerHTML;
                    copyLinkButton.innerHTML = originalText.replace("Copy Link", "Copied!");
                    copyLinkButton.disabled = true;
                    setTimeout(() => {
                        copyLinkButton.innerHTML = originalText;
                        copyLinkButton.disabled = false;
                        // Optionally close popover after copy
                        // container.classList.remove('active');
                        // shareButton.setAttribute('aria-expanded', 'false');
                    }, 1500);
                } catch (err) {
                    console.error('Failed to copy text: ', err);
                    // Maybe show an error message to the user
                }
            });
        }
    });
}); 