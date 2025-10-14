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
});