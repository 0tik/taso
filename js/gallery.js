const galleries = {
    1: {
        title: "Ghost Town",
        description: "This project focuses on a small, fading village in my country. Many villages are at risk of disappearing, often without recognition. The village I selected is located in the mountains of Georgia, home to only five families. These families live with a limited existence, lacking access to basic amenities such as schools, hospitals, or restaurants. They only have a small supermarket with basic essential needs. The migration of the younger generation for cities and better life, has left behind elderly residents deeply rooted in their homes. As I walked through the nearly demolished streets I felt that in the past these abandoned houses once were vibrant. Capturing the loneliness of this place is challenging yet vital, as it tells the story of a community fading from existence. Despite the desolation, life still exists. The remaining villagers have adapted and share treasured memories of the past, finding ways to connect with the land. I listened to their stories, discovering beauty in aged doors, peeling paint, and nature reclaiming spaces. Through my lens with these coloured pictures I wanted to show the beauty of these empty spaces and the life of those who remain. This project represents many places that go unheard, not just in Georgia but worldwide.",
        imageCount: 20
    },
    2: {
        title: "Have You Seen the Mind of an Artist?",
        description: "\"Have You Seen the Mind of an Artist?\" is a visual exploration of what it feels like to have a mind that never stops searching for new ideas. Through a series of tree photographs, this project reflects the endless branching of thoughts.\n" +
            "This series is a personal journey, an invitation to step inside the evolving mind of an artist’s where chaos and clarity coexist.\n",
        imageCount: 4
    },
    3: {
        title: "Ivry-sur-Seine",
        description: "Ivry-Sur-Seine neighbourhood project features a bold, geometric style of Brutalist architecture, which reminds me of Soviet-era designs. It takes inspiration from older architectural styles and uses strong concrete buildings with practical layouts that are both useful and visually interesting. The project gives for me the area a fresh, modern look while still honouring its industrial past. The design creates a comfortable and welcoming atmosphere, with a focus on simple beauty that feels familiar to my roots. ",
        imageCount: 11
    },
    4: {
        title: "Portrait of Bede",
        description: "",
        imageCount: 5
    },
    5: {
        title: "Portrait of Eijin",
        description: "",
        imageCount: 5
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

        const previewKeys = galleryKeys.slice(0, 5); // Show first 4 galleries

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

    const galleryButtonsContainer = document.getElementById('galleryButtons');

    if (galleryButtonsContainer) {
        function renderGalleryButtons(selectedKey) {
            galleryButtonsContainer.innerHTML = '';

            Object.entries(galleries).forEach(([key, gallery]) => {
                const btn = document.createElement('a');
                btn.textContent = gallery.title;
                btn.href = `#${key}`;
                if (key === selectedKey) {
                    btn.classList.add('selected');
                }
                galleryButtonsContainer.appendChild(btn);
            });
        }

        // Initial button render
        const currentHash = window.location.hash.substring(1);
        const initialKey = galleries[currentHash] ? currentHash : Object.keys(galleries)[0];
        renderGalleryButtons(initialKey);

        // Update buttons on hash change
        window.addEventListener('hashchange', () => {
            const newHash = window.location.hash.substring(1);
            const newKey = galleries[newHash] ? newHash : Object.keys(galleries)[0];
            renderGalleryButtons(newKey);
        });
    }



}); 