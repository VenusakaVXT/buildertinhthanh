/**
 * jPagination - Simple Pagination Manager
 * Version: 1.0.0
 * Compatible with Alpine.js structure
 */

class jPaginationManager {
  constructor() {
    this.paginations = new Map();
    this.activePages = new Map(); // Map<paginationId, currentPage>

    // Setup listeners
    this.setupGlobalListeners();
  }

  /**
   * Initialize a pagination
   * @param {string} selector - Pagination selector (e.g., '.pagination')
   * @param {object} options - Options
   */
  init(selector, options = {}) {
    const elements = document.querySelectorAll(selector);
    if (elements.length === 0) {
      console.warn(`jPagination: No elements found with selector "${selector}"`);
      return this;
    }

    elements.forEach((element, index) => {
      const paginationId = element.id || `${selector.replace('.', '')}_${index}`;

      if (!this.paginations.has(paginationId)) {
        // Cache pagination elements
        const prevBtn = element.querySelector('.prev-btn');
        const nextBtn = element.querySelector('.next-btn');
        const paginationItems = Array.from(element.querySelectorAll('.pagination-item'));
        const activeItem = element.querySelector('.pagination-item.active');

        // Check if this is a pagination-links (URL routing enabled)
        const isPaginationLinks = element.classList.contains('pagination-links');

        // Get initial active page from URL or active item
        let initialPage = 1;
        if (isPaginationLinks) {
          const urlParams = new URLSearchParams(window.location.search);
          const pageParam = urlParams.get('page');
          const urlPage = pageParam ? parseInt(pageParam) : 1;

          // Validate URL page parameter
          if (urlPage >= 1 && urlPage <= paginationItems.length) {
            initialPage = urlPage;
          } else if (urlPage > paginationItems.length) {
            // If URL page is greater than total pages, redirect to last page
            initialPage = paginationItems.length;
            this.redirectToPage(initialPage);
          } else if (urlPage < 1) {
            // If URL page is less than 1, redirect to page 1
            initialPage = 1;
            this.redirectToPage(initialPage);
          }
        } else {
          initialPage = activeItem ? parseInt(activeItem.textContent) || 1 : 1;
        }

        this.paginations.set(paginationId, {
          id: paginationId,
          element,
          prevBtn,
          nextBtn,
          paginationItems,
          isPaginationLinks,
          options: {
            totalPages: paginationItems.length,
            currentPage: initialPage,
            onPageChange: null,
            ...options
          },
          isInitialized: true
        });

        this.activePages.set(paginationId, initialPage);
        this.setupPagination(paginationId);

        // Initialize UI state
        this.updatePaginationUI(paginationId);
      }
    });

    return this;
  }

  /**
   * Setup pagination listeners
   */
  setupPagination(paginationId) {
    const pagination = this.paginations.get(paginationId);
    if (!pagination) return;

    const { element, prevBtn, nextBtn, paginationItems, options } = pagination;

    // Setup prev button
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        this.goToPrevPage(paginationId);
      }, { passive: true });
    }

    // Setup next button
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.goToNextPage(paginationId);
      }, { passive: true });
    }

    // Setup pagination items
    paginationItems.forEach((item, index) => {
      item.addEventListener('click', () => {
        const pageNumber = parseInt(item.textContent);
        if (!isNaN(pageNumber)) {
          this.goToPage(paginationId, pageNumber);
        }
      }, { passive: true });
    });
  }

  /**
   * Go to previous page
   */
  goToPrevPage(paginationId) {
    const pagination = this.paginations.get(paginationId);
    if (!pagination) return;

    const currentPage = this.activePages.get(paginationId) || 1;
    if (currentPage > 1) {
      this.goToPage(paginationId, currentPage - 1);
    }
  }

  /**
   * Go to next page
   */
  goToNextPage(paginationId) {
    const pagination = this.paginations.get(paginationId);
    if (!pagination) return;

    const currentPage = this.activePages.get(paginationId) || 1;
    const totalPages = pagination.options.totalPages;

    if (currentPage < totalPages) {
      this.goToPage(paginationId, currentPage + 1);
    }
  }

  /**
   * Go to specific page
   */
  goToPage(paginationId, pageNumber) {
    const pagination = this.paginations.get(paginationId);
    if (!pagination) return;

    const { paginationItems, options, isPaginationLinks } = pagination;
    const totalPages = options.totalPages;

    // Validate page number
    if (pageNumber < 1 || pageNumber > totalPages) {
      console.warn(`jPagination: Page ${pageNumber} is out of range (1-${totalPages})`);
      return;
    }

    // Update active page
    this.activePages.set(paginationId, pageNumber);
    options.currentPage = pageNumber;

    // Update UI
    this.updatePaginationUI(paginationId);

    // Handle URL routing for pagination-links
    if (isPaginationLinks) {
      this.updateURL(pageNumber);
    }

    // Call onPageChange callback
    if (options.onPageChange) {
      options.onPageChange(pageNumber, pagination);
    }
  }

  /**
   * Update pagination UI
   */
  updatePaginationUI(paginationId) {
    const pagination = this.paginations.get(paginationId);
    if (!pagination) return;

    const { prevBtn, nextBtn, paginationItems, options } = pagination;
    const currentPage = this.activePages.get(paginationId) || 1;
    const totalPages = options.totalPages;

    // Update pagination items
    paginationItems.forEach((item, index) => {
      const pageNumber = parseInt(item.textContent);
      if (!isNaN(pageNumber)) {
        // Always ensure pagination items have btn class
        if (!item.classList.contains('btn')) {
          item.classList.add('btn');
        }

        if (pageNumber === currentPage) {
          item.classList.add('active');
          item.classList.add('btn-primary');
          item.classList.remove('btn-outline');
        } else {
          item.classList.remove('active');
          item.classList.remove('btn-primary');
          item.classList.add('btn-outline');
        }
      }
    });

    // Update prev button state
    if (prevBtn) {
      // Always ensure prev button has btn class
      if (!prevBtn.classList.contains('btn')) {
        prevBtn.classList.add('btn');
      }
      if (!prevBtn.classList.contains('btn-outline')) {
        prevBtn.classList.add('btn-outline');
      }

      if (currentPage <= 1) {
        prevBtn.disabled = true;
        prevBtn.classList.add('disabled');
      } else {
        prevBtn.disabled = false;
        prevBtn.classList.remove('disabled');
      }
    }

    // Update next button state
    if (nextBtn) {
      // Always ensure next button has btn class
      if (!nextBtn.classList.contains('btn')) {
        nextBtn.classList.add('btn');
      }
      if (!nextBtn.classList.contains('btn-outline')) {
        nextBtn.classList.add('btn-outline');
      }

      if (currentPage >= totalPages) {
        nextBtn.disabled = true;
        nextBtn.classList.add('disabled');
      } else {
        nextBtn.disabled = false;
        nextBtn.classList.remove('disabled');
      }
    }
  }

  /**
   * Get current page
   */
  getCurrentPage(paginationId) {
    return this.activePages.get(paginationId) || 1;
  }

  /**
   * Set total pages
   */
  setTotalPages(paginationId, totalPages) {
    const pagination = this.paginations.get(paginationId);
    if (!pagination) return;

    pagination.options.totalPages = totalPages;
    this.updatePaginationUI(paginationId);
  }

  /**
   * Setup global event listeners
   */
  setupGlobalListeners() {
    // Auto-initialize paginations on DOM ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.autoInit();
      });
    } else {
      this.autoInit();
    }

    // Note: Browser back/forward navigation is handled by page reload
    // No need for popstate listener since we're using page reload
  }


  /**
   * Update URL with page parameter
   */
  updateURL(pageNumber) {
    const url = new URL(window.location);
    if (pageNumber === 1) {
      url.searchParams.delete('page');
    } else {
      url.searchParams.set('page', pageNumber);
    }

    // Reload page with new URL
    window.location.href = url.toString();
  }

  /**
   * Redirect to specific page (for invalid URL parameters)
   */
  redirectToPage(pageNumber) {
    const url = new URL(window.location);
    if (pageNumber === 1) {
      url.searchParams.delete('page');
    } else {
      url.searchParams.set('page', pageNumber);
    }

    // Redirect to valid page
    window.location.href = url.toString();
  }

  /**
   * Auto-initialize all paginations
   */
  autoInit() {
    // Find all elements with pagination class
    const paginationElements = document.querySelectorAll('.pagination');
    paginationElements.forEach((element, index) => {
      if (!element.id) {
        element.id = `pagination_${index}`;
      }
    });

    // Initialize all paginations
    this.init('.pagination');

    console.log(`jPagination: Auto-initialized ${paginationElements.length} pagination(s)`);
  }

  /**
   * Destroy pagination instance
   */
  destroy(paginationId) {
    const pagination = this.paginations.get(paginationId);
    if (!pagination) return;

    this.paginations.delete(paginationId);
    this.activePages.delete(paginationId);
    return this;
  }

  /**
   * Destroy all paginations
   */
  destroyAll() {
    this.paginations.clear();
    this.activePages.clear();
    return this;
  }
}

// Create global instance
window.jPagination = new jPaginationManager();

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = jPaginationManager;
}
