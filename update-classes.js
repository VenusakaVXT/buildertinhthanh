const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'blocks', 'sections', 'search', 'real-estate', 'list.html');

let content = fs.readFileSync(filePath, 'utf8');

// Thay thế các class cho grid view
const gridReplacements = [
    {
        old: /class="rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer"/g,
        new: 'class="grid-card bg-card text-card-foreground group"'
    },
    {
        old: /class="w-full h-32 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"/g,
        new: 'class="grid-card__image"'
    },
    {
        old: /class="absolute top-2 sm:top-3 left-2 sm:left-3 flex flex-col gap-1 sm:gap-2"/g,
        new: 'class="grid-card__badges-top-left"'
    },
    {
        old: /class="inline-flex items-center rounded-full border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent text-white text-xs px-1 py-0"/g,
        new: 'class="grid-card__badge-type"'
    },
    {
        old: /class="inline-flex items-center rounded-full border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent text-white text-xs px-1 py-0"/g,
        new: 'class="grid-card__badge-featured"'
    },
    {
        old: /class="absolute top-2 sm:top-3 right-2 sm:right-3"/g,
        new: 'class="grid-card__badge-status"'
    },
    {
        old: /class="inline-flex items-center rounded-full border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent text-gray-700 text-xs px-1 py-0"/g,
        new: 'class="grid-card__badge-status-item"'
    },
    {
        old: /class="absolute bottom-2 sm:bottom-3 left-2 sm:left-3"/g,
        new: 'class="grid-card__badge-hot"'
    },
    {
        old: /class="inline-flex items-center rounded-full border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent text-white animate-pulse text-xs px-1 py-0"/g,
        new: 'class="grid-card__badge-hot-item"'
    },
    {
        old: /class="absolute bottom-2 sm:bottom-3 right-2 sm:right-3"/g,
        new: 'class="grid-card__badge-verified"'
    },
    {
        old: /class="inline-flex items-center rounded-full border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent text-white text-xs px-1 py-0"/g,
        new: 'class="grid-card__badge-verified-item"'
    },
    {
        old: /class="p-2 sm:p-4"/g,
        new: 'class="grid-card__content"'
    },
    {
        old: /class="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors text-sm sm:text-base"/g,
        new: 'class="grid-card__title"'
    },
    {
        old: /class="mb-3"/g,
        new: 'class="grid-card__pricing"'
    },
    {
        old: /class="text-lg sm:text-xl font-bold text-red-600"/g,
        new: 'class="grid-card__price"'
    },
    {
        old: /class="text-xs sm:text-sm text-gray-500"/g,
        new: 'class="grid-card__price-per-unit"'
    },
    {
        old: /class="flex items-center text-gray-600 mb-3"/g,
        new: 'class="grid-card__location"'
    },
    {
        old: /class="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0"/g,
        new: 'class="grid-card__location-icon"'
    },
    {
        old: /class="text-xs sm:text-sm line-clamp-1"/g,
        new: 'class="grid-card__location-text"'
    },
    {
        old: /class="grid grid-cols-3 gap-1 sm:gap-2 mb-3 text-xs sm:text-sm"/g,
        new: 'class="grid-card__specs"'
    },
    {
        old: /class="flex items-center text-gray-600"/g,
        new: 'class="grid-card__spec-item"'
    },
    {
        old: /class="w-3 h-3 sm:w-4 sm:h-4 mr-1"/g,
        new: 'class="grid-card__spec-icon"'
    },
    {
        old: /class="mb-3"/g,
        new: 'class="grid-card__amenities"'
    },
    {
        old: /class="flex flex-wrap gap-1"/g,
        new: 'class="grid-card__amenities-container"'
    },
    {
        old: /class="inline-flex items-center rounded-full border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground text-xs px-1 py-0"/g,
        new: 'class="grid-card__amenity"'
    },
    {
        old: /class="text-xs sm:text-sm text-gray-700 mb-4 line-clamp-2"/g,
        new: 'class="grid-card__description"'
    },
    {
        old: /class="flex items-center justify-between pt-3 border-t"/g,
        new: 'class="grid-card__footer"'
    },
    {
        old: /class="flex items-center text-gray-500 text-xs sm:text-sm"/g,
        new: 'class="grid-card__stats"'
    },
    {
        old: /class="flex items-center"/g,
        new: 'class="grid-card__stat-item"'
    },
    {
        old: /class="w-3 h-3 sm:w-4 sm:h-4 mr-1"/g,
        new: 'class="grid-card__stat-icon"'
    },
    {
        old: /class="w-3 h-3 sm:w-4 sm:h-4 ml-2 sm:ml-3 mr-1"/g,
        new: 'class="grid-card__stat-separator"'
    },
    {
        old: /class="mt-3 p-2 sm:p-3 bg-gray-50 rounded-lg"/g,
        new: 'class="grid-card__contact"'
    },
    {
        old: /class="flex items-center justify-between"/g,
        new: 'class="grid-card__contact-content"'
    },
    {
        old: /class="flex flex-col"/g,
        new: 'class="grid-card__contact-info"'
    },
    {
        old: /class="font-medium text-gray-900 text-xs sm:text-sm"/g,
        new: 'class="grid-card__contact-name"'
    },
    {
        old: /class="text-blue-600 hover:text-blue-800 text-xs sm:text-sm flex items-center"/g,
        new: 'class="grid-card__contact-phone"'
    },
    {
        old: /class="w-3 h-3 mr-1"/g,
        new: 'class="grid-card__contact-phone-icon"'
    },
    {
        old: /class="flex gap-1 sm:gap-2"/g,
        new: 'class="grid-card__actions"'
    },
    {
        old: /class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-xs px-3 py-1 h-8"/g,
        new: 'class="grid-card__btn-contact"'
    },
    {
        old: /class="sm:hidden"/g,
        new: 'class="grid-card__btn-contact-text-mobile"'
    },
    {
        old: /class="hidden sm:inline"/g,
        new: 'class="grid-card__btn-contact-text-desktop"'
    }
];

// Thay thế các class cho list view
const listReplacements = [
    {
        old: /class="rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer"/g,
        new: 'class="list-card bg-card text-card-foreground group"'
    },
    {
        old: /class="w-full h-32 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"/g,
        new: 'class="list-card__image"'
    },
    {
        old: /class="absolute top-2 sm:top-3 left-2 sm:left-3 flex flex-col gap-1 sm:gap-2"/g,
        new: 'class="list-card__badges-top-left"'
    },
    {
        old: /class="inline-flex items-center rounded-full border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent text-white text-xs px-1 py-0"/g,
        new: 'class="list-card__badge-type"'
    },
    {
        old: /class="inline-flex items-center rounded-full border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent text-white text-xs px-1 py-0"/g,
        new: 'class="list-card__badge-featured"'
    },
    {
        old: /class="absolute top-2 sm:top-3 right-2 sm:right-3"/g,
        new: 'class="list-card__badge-status"'
    },
    {
        old: /class="inline-flex items-center rounded-full border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent text-gray-700 text-xs px-1 py-0"/g,
        new: 'class="list-card__badge-status-item"'
    },
    {
        old: /class="absolute bottom-2 sm:bottom-3 left-2 sm:left-3"/g,
        new: 'class="list-card__badge-hot"'
    },
    {
        old: /class="inline-flex items-center rounded-full border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent text-white animate-pulse text-xs px-1 py-0"/g,
        new: 'class="list-card__badge-hot-item"'
    },
    {
        old: /class="absolute bottom-2 sm:bottom-3 right-2 sm:right-3"/g,
        new: 'class="list-card__badge-verified"'
    },
    {
        old: /class="inline-flex items-center rounded-full border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent text-white text-xs px-1 py-0"/g,
        new: 'class="list-card__badge-verified-item"'
    },
    {
        old: /class="p-2 sm:p-4"/g,
        new: 'class="list-card__content"'
    },
    {
        old: /class="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors text-sm sm:text-base"/g,
        new: 'class="list-card__title"'
    },
    {
        old: /class="mb-3"/g,
        new: 'class="list-card__pricing"'
    },
    {
        old: /class="text-lg sm:text-xl font-bold text-red-600"/g,
        new: 'class="list-card__price"'
    },
    {
        old: /class="text-xs sm:text-sm text-gray-500"/g,
        new: 'class="list-card__price-per-unit"'
    },
    {
        old: /class="flex items-center text-gray-600 mb-3"/g,
        new: 'class="list-card__location"'
    },
    {
        old: /class="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0"/g,
        new: 'class="list-card__location-icon"'
    },
    {
        old: /class="text-xs sm:text-sm line-clamp-1"/g,
        new: 'class="list-card__location-text"'
    },
    {
        old: /class="grid grid-cols-3 gap-1 sm:gap-2 mb-3 text-xs sm:text-sm"/g,
        new: 'class="list-card__specs"'
    },
    {
        old: /class="flex items-center text-gray-600"/g,
        new: 'class="list-card__spec-item"'
    },
    {
        old: /class="w-3 h-3 sm:w-4 sm:h-4 mr-1"/g,
        new: 'class="list-card__spec-icon"'
    },
    {
        old: /class="mb-3"/g,
        new: 'class="list-card__amenities"'
    },
    {
        old: /class="flex flex-wrap gap-1"/g,
        new: 'class="list-card__amenities-container"'
    },
    {
        old: /class="inline-flex items-center rounded-full border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground text-xs px-1 py-0"/g,
        new: 'class="list-card__amenity"'
    },
    {
        old: /class="text-xs sm:text-sm text-gray-700 mb-4 line-clamp-2"/g,
        new: 'class="list-card__description"'
    },
    {
        old: /class="flex items-center justify-between pt-3 border-t"/g,
        new: 'class="list-card__footer"'
    },
    {
        old: /class="flex items-center text-gray-500 text-xs sm:text-sm"/g,
        new: 'class="list-card__stats"'
    },
    {
        old: /class="flex items-center"/g,
        new: 'class="list-card__stat-item"'
    },
    {
        old: /class="w-3 h-3 sm:w-4 sm:h-4 mr-1"/g,
        new: 'class="list-card__stat-icon"'
    },
    {
        old: /class="w-3 h-3 sm:w-4 sm:h-4 ml-2 sm:ml-3 mr-1"/g,
        new: 'class="list-card__stat-separator"'
    },
    {
        old: /class="mt-3 p-2 sm:p-3 bg-gray-50 rounded-lg"/g,
        new: 'class="list-card__contact"'
    },
    {
        old: /class="flex items-center justify-between"/g,
        new: 'class="list-card__contact-content"'
    },
    {
        old: /class="flex flex-col"/g,
        new: 'class="list-card__contact-info"'
    },
    {
        old: /class="font-medium text-gray-900 text-xs sm:text-sm"/g,
        new: 'class="list-card__contact-name"'
    },
    {
        old: /class="text-blue-600 hover:text-blue-800 text-xs sm:text-sm flex items-center"/g,
        new: 'class="list-card__contact-phone"'
    },
    {
        old: /class="w-3 h-3 mr-1"/g,
        new: 'class="list-card__contact-phone-icon"'
    },
    {
        old: /class="flex gap-1 sm:gap-2"/g,
        new: 'class="list-card__actions"'
    },
    {
        old: /class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-xs px-3 py-1 h-8"/g,
        new: 'class="list-card__btn-contact"'
    },
    {
        old: /class="sm:hidden"/g,
        new: 'class="list-card__btn-contact-text-mobile"'
    },
    {
        old: /class="hidden sm:inline"/g,
        new: 'class="list-card__btn-contact-text-desktop"'
    }
];

// Áp dụng các thay thế
gridReplacements.forEach(r => {
    content = content.replace(r.old, r.new);
});

listReplacements.forEach(r => {
    content = content.replace(r.old, r.new);
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('HTML file updated successfully with new class structure!');








