const galleries = {
    1: {
        title: "Ghost Town",
        description: "Capturing the magic and emotion of your special day.",
        imageCount: 20
    },
    2: {
        title: "Portraits",
        description: "Revealing personality and character through the lens.",
        imageCount: 8
    },
    3: {
        title: "Events",
        description: "აღწერა",
        imageCount: 3
    },
    4: {
        title: "Landscapes",
        description: "Exploring the beauty of the natural and built environment.",
        imageCount: 4
    },
    5: {
        title: "Landscapes",
        description: "Exploring the beauty of the natural and built environment.",
        imageCount: 4
    }
};

// Function to load gallery content
function loadGallery(galleryKey) {
    const lightgalleryContainer = document.getElementById('lightgallery');
    const galleryHeader = document.querySelector('.gallery-page-header h1');
    const galleryDescription = document.querySelector('.gallery-page-header p');
    const loader = document.querySelector('.loader');

    // --- Show loader, hide gallery initially ---
    if(loader) loader.style.display = 'flex';
    if(lightgalleryContainer) lightgalleryContainer.classList.remove('loaded');



    // Clear previous gallery items and destroy previous lightGallery instance if exists
    if (lightgalleryContainer) {
        lightgalleryContainer.innerHTML = ''; // Clear old images
        // Check if lightGallery instance exists and destroy it
        // Note: lightGallery might attach data/instance differently; check its API if this doesn't work
        // This is a common pattern, but might need adjustment based on the library version.
        const existingInstance = lightgalleryContainer.lgData?.lightGallery;
        if (existingInstance) {
             try {
                existingInstance.destroy();
            } catch (e) {
                console.warn("Could not destroy previous lightGallery instance:", e);
            }       
        }
        lightgalleryContainer.lgData = null; // Clear potential reference
    }

    const galleryData = galleries[galleryKey];

    if (galleryData && lightgalleryContainer && galleryHeader && galleryDescription) {
        // Update header and description
        document.title = `${galleryData.title} Gallery - Anastasia Abulade Photography`; // Update page title
        galleryHeader.textContent = galleryData.title;
        galleryDescription.textContent = galleryData.description;

        // Populate gallery
        const galleryPath = `gallery/${galleryKey}/`;
        for (let i = 1; i <= galleryData.imageCount; i++) {
            const fullImagePath = `${galleryPath}${i}.jpg`;
            const thumbImagePath = `${galleryPath}${i}_thumb.jpg`; // Assume _thumb convention

            const link = document.createElement('a');
            link.href = fullImagePath; // Link to the full image for lightbox
            link.dataset.subHtml = `${galleryData.title} - Image ${i}`;

            const image = document.createElement('img');
            image.alt = `${galleryData.title} Image ${i}`;
            image.src = thumbImagePath; // Display the thumbnail in the grid

            link.appendChild(image);
            lightgalleryContainer.appendChild(link);
        }

        // Initialize lightGallery *after* populating the container
        try {
            console.log("Initializing lightGallery for container:", lightgalleryContainer);
            // Re-enable plugins in initialization:
             lightGallery(lightgalleryContainer, {
                 plugins: [lgZoom, lgThumbnail],
                 selector: 'a',
                 thumbnail: true, // Enable thumbnails in the lightbox UI
                 download: false,
                 speed: 500,
             });
            // Simplest initialization first (commented out):
            // lightGallery(lightgalleryContainer, {
            //     selector: 'a', // Still need to tell it which elements trigger the lightbox
            //     download: false,
            //     speed: 500
            // });
            console.log("lightGallery initialization called (with plugins).");
        } catch (error) {
            console.error("Error initializing lightGallery:", error);
        }

        // --- Hide loader, show gallery ---
        if(loader) loader.style.display = 'none';
        if(lightgalleryContainer) lightgalleryContainer.classList.add('loaded');

    } else {
        // Handle case where galleryKey is invalid or elements are missing
        console.error('Gallery data/elements not found for key:', galleryKey);
        if (galleryHeader) galleryHeader.textContent = "Gallery Not Found";
        if (galleryDescription) galleryDescription.textContent = "The requested gallery could not be loaded. Please check the URL or select a gallery from the homepage.";
        document.title = "Gallery Not Found - Anastasia Abulade Photography";
        // Hide loader in error case too
        if(loader) loader.style.display = 'none';
    }
}

// Initial Load and Hash Change Listener
document.addEventListener('DOMContentLoaded', () => {
    const galleryKeys = Object.keys(galleries);
    const defaultGalleryKey = galleryKeys.length > 0 ? galleryKeys[0] : null; // Default to first gallery

    function handleHashChange() {
        const hash = window.location.hash.substring(1);
        const galleryKey = galleries[hash] ? hash : defaultGalleryKey;
        if (galleryKey) {
            loadGallery(galleryKey);
        } else {
             // Handle case with no galleries defined
            console.error("No galleries defined in js/gallery.js");
             const galleryHeader = document.querySelector('.gallery-page-header h1');
             const galleryDescription = document.querySelector('.gallery-page-header p');
             if (galleryHeader) galleryHeader.textContent = "Error";
             if (galleryDescription) galleryDescription.textContent = "No galleries have been configured.";
        }
    }

    // Load gallery based on initial hash
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);

    // Populate homepage gallery previews (if on homepage)
    const galleryPreviewContainer = document.querySelector('.gallery-grid-preview');
    if (galleryPreviewContainer) {
        galleryPreviewContainer.innerHTML = ''; // Clear static placeholders

        const previewKeys = galleryKeys.slice(0, 4); // Show first 4 galleries

        previewKeys.forEach(key => {
            const galleryData = galleries[key];
            const galleryPath = `gallery/${key}/`;
            const previewImagePath = `${galleryPath}1_thumb.jpg`;

            const link = document.createElement('a');
            link.href = `gallery.html#${key}`; // Updated link format
            link.className = 'gallery-item-preview';

            const image = document.createElement('img');
            image.src = previewImagePath;
            image.alt = `${galleryData.title} Gallery Preview`;

            const heading = document.createElement('h3');
            heading.textContent = galleryData.title;

            link.appendChild(image);
            link.appendChild(heading);
            galleryPreviewContainer.appendChild(link);
        });
    }
}); 