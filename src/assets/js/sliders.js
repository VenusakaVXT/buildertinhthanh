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
            // Get BlazeSlider instance - try multiple ways
            let blazeInstance = slider.blazeSlider;

            // If not found, try to get from data attribute or other methods
            if (!blazeInstance) {
                // Try to find the instance by looking for BlazeSlider methods
                if (slider.getCurrentSlide && typeof slider.getCurrentSlide === 'function') {
                    blazeInstance = slider;
                }
            }

            if (!blazeInstance) {
                console.warn('BlazeSlider instance not found for', selector);
                console.log('Slider element:', slider);
                console.log('Slider properties:', Object.keys(slider));
                return;
            }

            console.log('BlazeSlider instance found:', blazeInstance);

            // Update active pagination item
            function updateActivePagination() {
                const currentSlide = blazeInstance.getCurrentSlide();
                console.log('Current slide:', currentSlide);

                paginationItems.forEach(function (item, index) {
                    if (index === currentSlide) {
                        item.classList.add('active');
                        item.classList.add('ring-2', 'ring-blue-500');
                    } else {
                        item.classList.remove('active');
                        item.classList.remove('ring-2', 'ring-blue-500');
                    }
                });
            }

            // Listen for slide changes
            slider.addEventListener('blaze:slide', updateActivePagination);

            // Setup click handlers for pagination items
            paginationItems.forEach(function (item, index) {
                item.addEventListener('click', function (e) {
                    e.preventDefault();
                    console.log('Clicked pagination item:', index);
                    try {
                        // Try different methods to change slide
                        if (blazeInstance.slideTo) {
                            blazeInstance.slideTo(index);
                            console.log('slideTo called successfully');
                        } else if (blazeInstance.goToSlide) {
                            blazeInstance.goToSlide(index);
                            console.log('goToSlide called successfully');
                        } else if (blazeInstance.setSlide) {
                            blazeInstance.setSlide(index);
                            console.log('setSlide called successfully');
                        } else {
                            // Fallback: try to trigger navigation buttons
                            const nextBtn = slider.querySelector('.blaze-next');
                            const prevBtn = slider.querySelector('.blaze-prev');

                            if (index > 0 && nextBtn) {
                                for (let i = 0; i < index; i++) {
                                    nextBtn.click();
                                }
                                console.log('Used next button fallback');
                            }
                        }
                    } catch (error) {
                        console.error('Error calling slide method:', error);
                    }
                });
            });

            // Initial update
            updateActivePagination();
        }, 200);
    });
}