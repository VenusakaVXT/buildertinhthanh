document.addEventListener('DOMContentLoaded', function () {
    function initSlider(selector, config) {
        var nodes = document.querySelectorAll(selector);
        if (!nodes || nodes.length === 0) return;
        nodes.forEach(function (node) {
            try {
                new BlazeSlider(node, config);
            } catch (e) {
                console.error('BlazeSlider init failed for', selector, e);
            }
        });
    }

    var commonAll = {
        enableAutoplay: false,
        stopAutoplayOnInteraction: true,
        enablePagination: true,
        draggable: true,
        loop: true,
        transitionDuration: 300,
        transitionTimingFunction: 'ease',
        slideGap: '16px',
        slidesToShow: 1,
        slidesToScroll: 1
    };

    // 6-per-view on very large desktop
    initSlider('.bslider-6', {
        all: commonAll,
        '(min-width: 500px) and (max-width: 768px)': { slidesToShow: 2, slidesToScroll: 2 },
        '(min-width: 768px) and (max-width: 1023px)': { slidesToShow: 3, slidesToScroll: 3 },
        '(min-width: 1023px) and (max-width: 1360px)': { slidesToShow: 4, slidesToScroll: 4 },
        '(min-width: 1360px) and (max-width: 1590px)': { slidesToShow: 5, slidesToScroll: 5 },
        '(min-width: 1590px)': { slidesToShow: 6, slidesToScroll: 6 }
    });

    // 5-per-view on desktop
    initSlider('.bslider-5', {
        all: commonAll,
        '(min-width: 500px) and (max-width: 768px)': { slidesToShow: 2, slidesToScroll: 2 },
        '(min-width: 768px) and (max-width: 1023px)': { slidesToShow: 3, slidesToScroll: 3 },
        '(min-width: 1023px) and (max-width: 1360px)': { slidesToShow: 4, slidesToScroll: 4 },
        '(min-width: 1360px)': { slidesToShow: 5, slidesToScroll: 5 }
    });

    // 4-per-view on desktop
    initSlider('.bslider-4', {
        all: commonAll,
        '(min-width: 500px) and (max-width: 768px)': { slidesToShow: 2, slidesToScroll: 2 },
        '(min-width: 768px) and (max-width: 1023px)': { slidesToShow: 3, slidesToScroll: 3 },
        '(min-width: 1023px)': { slidesToShow: 4, slidesToScroll: 4 }
    });

    // 3-per-view on desktop
    initSlider('.bslider-3', {
        all: commonAll,
        '(min-width: 600px) and (max-width: 1023px)': { slidesToShow: 2, slidesToScroll: 2 },
        '(min-width: 1023px)': { slidesToShow: 3, slidesToScroll: 3 }
    });

    // Image carousel slider - 1 image per slide
    initSlider('.bslider-image', {
        all: {
            enableAutoplay: false,
            stopAutoplayOnInteraction: true,
            enablePagination: false, // Disable default pagination
            draggable: true,
            loop: true,
            transitionDuration: 500,
            transitionTimingFunction: 'ease-in-out',
            slideGap: '0px',
            slidesToShow: 1,
            slidesToScroll: 1
        }
    });

    // Setup image pagination for bslider-image
    setupImagePagination('.bslider-image');

    // Also setup after a longer delay to ensure BlazeSlider is fully initialized
    setTimeout(function () {
        setupImagePagination('.bslider-image');
    }, 1000);
});

// Setup image pagination functionality
function setupImagePagination(selector) {
    const sliders = document.querySelectorAll(selector);

    sliders.forEach(function (slider) {
        const paginationContainer = slider.querySelector('.blaze-pagination-image');
        if (!paginationContainer) return;

        const paginationItems = paginationContainer.querySelectorAll('.blaze-pagination-item');
        if (paginationItems.length === 0) return;

        // Wait for BlazeSlider to initialize
        setTimeout(function () {
            // Get BlazeSlider instance
            let blazeInstance = slider.blazeSlider;

            if (!blazeInstance) {
                console.warn('BlazeSlider instance not found for', selector);
                return;
            }

            // Update active pagination item
            function updateActivePagination(stateIndex) {
                // For bslider-image (1 slide per view), stateIndex equals slide index
                paginationItems.forEach(function (item, index) {
                    if (index === stateIndex) {
                        item.classList.add('active');
                        item.classList.add('ring-1', 'ring-blue-500');
                    } else {
                        item.classList.remove('active');
                        item.classList.remove('ring-1', 'ring-blue-500');
                    }
                });
            }

            // Listen for slide changes using onSlide callback (backup for other navigation methods)
            blazeInstance.onSlide(function (stateIndex, firstSlideIndex, lastSlideIndex) {
                updateActivePagination(stateIndex);
            });

            // Setup click handlers for prev/next buttons to update immediately
            const prevBtn = slider.querySelector('.blaze-prev');
            const nextBtn = slider.querySelector('.blaze-next');

            if (prevBtn) {
                const originalPrevHandler = prevBtn.onclick;
                prevBtn.onclick = function () {
                    // BlazeSlider's isTransitioning prevents rapid clicks, so we can safely proceed
                    // Call original handler first (stateIndex is updated synchronously inside)
                    if (originalPrevHandler) originalPrevHandler();
                    // Read the updated stateIndex immediately after handler runs
                    // stateIndex is updated synchronously in super.prev() before isTransitioning is set
                    updateActivePagination(blazeInstance.stateIndex);
                };
            }

            if (nextBtn) {
                const originalNextHandler = nextBtn.onclick;
                nextBtn.onclick = function () {
                    // BlazeSlider's isTransitioning prevents rapid clicks, so we can safely proceed
                    // Call original handler first (stateIndex is updated synchronously inside)
                    if (originalNextHandler) originalNextHandler();
                    // Read the updated stateIndex immediately after handler runs
                    // stateIndex is updated synchronously in super.next() before isTransitioning is set
                    updateActivePagination(blazeInstance.stateIndex);
                };
            }

            // Setup click handlers for pagination items
            paginationItems.forEach(function (item, index) {
                item.addEventListener('click', function (e) {
                    e.preventDefault();
                    try {
                        const currentStateIndex = blazeInstance.stateIndex;

                        if (index === currentStateIndex) return; // Already on this slide

                        // Update active state immediately (no delay)
                        updateActivePagination(index);

                        // Then change the slide
                        const diff = Math.abs(index - currentStateIndex);
                        if (index > currentStateIndex) {
                            blazeInstance.next(diff);
                        } else {
                            blazeInstance.prev(diff);
                        }
                    } catch (error) {
                        console.error('Error changing slide:', error);
                    }
                });
            });

            // Initial update
            updateActivePagination(blazeInstance.stateIndex);
        }, 200);
    });
}