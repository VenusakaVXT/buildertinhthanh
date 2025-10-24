/**
 * jLike - Simple Like/Unlike Manager
 * Version: 1.0.0
 * Handles like/unlike functionality with counter updates
 */

class jLikeManager {
  constructor() {
    this.likes = new Map(); // Map<buttonId, {isLiked: boolean, count: number}>
    this.setupGlobalListeners();
  }

  /**
   * Initialize like buttons
   * @param {string} selector - Like button selector (e.g., '.like-button')
   * @param {object} options - Options
   */
  init(selector, options = {}) {
    const elements = document.querySelectorAll(selector);
    if (elements.length === 0) {
      return this;
    }

    elements.forEach((element, index) => {
      const likeId = element.id || `${selector.replace('.', '')}_${index}`;

      if (!this.likes.has(likeId)) {
        // Get initial state
        const isInitiallyLiked = element.classList.contains('active');
        const countElement = this.findCountElement(element);
        const initialCount = countElement ? parseInt(countElement.textContent) || 0 : 0;

        this.likes.set(likeId, {
          id: likeId,
          element,
          countElement,
          isLiked: isInitiallyLiked,
          count: initialCount,
          options: {
            onLike: null,
            onUnlike: null,
            ...options
          },
          isInitialized: true
        });

        // Ensure icon state matches button state on initialization
        const iconElement = element.querySelector('i[data-lucide]');
        if (iconElement) {
          if (isInitiallyLiked) {
            iconElement.classList.add('fill-current');
          } else {
            iconElement.classList.remove('fill-current');
          }
        } else {
          console.warn(`jLike: No icon with data-lucide found in button ${likeId}`);
        }

        this.setupLikeButton(likeId);
        this.updateLikeUI(likeId); // Initialize UI state
      }
    });

    return this;
  }

  /**
   * Setup like button event listener
   */
  setupLikeButton(likeId) {
    const like = this.likes.get(likeId);
    if (!like) return;

    const { element } = like;

    element.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggleLike(likeId);
    }, { passive: false });
  }

  /**
   * Toggle like state
   */
  toggleLike(likeId) {
    const like = this.likes.get(likeId);
    if (!like) return;

    const { element, countElement, options } = like;
    const isCurrentlyLiked = like.isLiked;

    if (isCurrentlyLiked) {
      // Unlike: Remove active class and fill-current
      this.unlike(likeId);
    } else {
      // Like: Add active class and fill-current
      this.like(likeId);
    }
  }

  /**
   * Like action
   */
  like(likeId) {
    const like = this.likes.get(likeId);
    if (!like) return;

    const { element, countElement, options } = like;

    // Update state
    like.isLiked = true;
    like.count += 1;

    // Update UI
    this.updateLikeUI(likeId);

    // Call onLike callback
    if (options.onLike) {
      options.onLike(like);
    }
  }

  /**
   * Unlike action
   */
  unlike(likeId) {
    const like = this.likes.get(likeId);
    if (!like) return;

    const { element, countElement, options } = like;

    // Update state
    like.isLiked = false;
    like.count = Math.max(0, like.count - 1); // Prevent negative count

    // Update UI
    this.updateLikeUI(likeId);

    // Call onUnlike callback
    if (options.onUnlike) {
      options.onUnlike(like);
    }
  }

  /**
   * Update like button UI
   */
  updateLikeUI(likeId) {
    const like = this.likes.get(likeId);
    if (!like) return;

    const { element, countElement, isLiked, count } = like;
    const iconElement = element.querySelector('i[data-lucide]');

    // Update button active state
    if (isLiked) {
      element.classList.add('active');
    } else {
      element.classList.remove('active');
    }

    // Update icon fill state - CRITICAL: sync with button state
    if (iconElement) {
      if (isLiked) {
        iconElement.classList.add('fill-current');
      } else {
        iconElement.classList.remove('fill-current');
      }
    } else {
      console.warn(`jLike: No icon with data-lucide found in button ${likeId}`);
    }

    // Update count
    if (countElement) {
      countElement.textContent = count;
    }
  }

  /**
   * Find count element within button
   */
  findCountElement(button) {
    // Look for common count element patterns
    const countSelectors = [
      '.count',
      '.like-count',
      '.number',
      'span:not(.sr-only)',
      '[data-count]'
    ];

    for (const selector of countSelectors) {
      const element = button.querySelector(selector);
      if (element && !isNaN(parseInt(element.textContent))) {
        return element;
      }
    }

    // If no specific count element found, look for any text content that's a number
    const textNodes = Array.from(button.childNodes).filter(node =>
      node.nodeType === Node.TEXT_NODE &&
      node.textContent.trim() &&
      !isNaN(parseInt(node.textContent.trim()))
    );

    if (textNodes.length > 0) {
      // Create a span wrapper for the count
      const span = document.createElement('span');
      span.className = 'like-count';
      span.textContent = textNodes[0].textContent.trim();
      textNodes[0].replaceWith(span);
      return span;
    }

    return null;
  }

  /**
   * Get like state
   */
  getLikeState(likeId) {
    const like = this.likes.get(likeId);
    return like ? { isLiked: like.isLiked, count: like.count } : null;
  }

  /**
   * Set like state programmatically
   */
  setLikeState(likeId, isLiked, count = null) {
    const like = this.likes.get(likeId);
    if (!like) return;

    like.isLiked = isLiked;
    if (count !== null) {
      like.count = count;
    }

    this.updateLikeUI(likeId);
  }

  /**
   * Setup global event listeners
   */
  setupGlobalListeners() {
    // Auto-initialize like buttons on DOM ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.autoInit();
      });
    } else {
      this.autoInit();
    }
  }

  /**
   * Auto-initialize all like buttons
   */
  autoInit() {
    // Find all elements with like-button class
    const likeElements = document.querySelectorAll('.like-button');
    likeElements.forEach((element, index) => {
      if (!element.id) {
        element.id = `like_${index}`;
      }
    });

    // Initialize all like buttons
    this.init('.like-button');

    // Force sync all button states after initialization
    this.forceSyncAllStates();
  }

  /**
   * Force sync all like button states
   */
  forceSyncAllStates() {
    this.likes.forEach((like, likeId) => {
      const { element } = like;
      const iconElement = element.querySelector('i[data-lucide]');
      const hasActiveClass = element.classList.contains('active');
      const hasFillCurrent = iconElement && iconElement.classList.contains('fill-current');

      // Sync icon state with button state
      if (iconElement) {
        if (hasActiveClass && !hasFillCurrent) {
          iconElement.classList.add('fill-current');
        } else if (!hasActiveClass && hasFillCurrent) {
          iconElement.classList.remove('fill-current');
        }
      }
    });
  }

  /**
   * Destroy like instance
   */
  destroy(likeId) {
    const like = this.likes.get(likeId);
    if (!like) return;

    this.likes.delete(likeId);
    return this;
  }

  /**
   * Destroy all likes
   */
  destroyAll() {
    this.likes.clear();
    return this;
  }

  /**
   * Verify and fix all like button states
   */
  verifyAndFixStates() {
    this.likes.forEach((like, likeId) => {
      const { element } = like;
      const iconElement = element.querySelector('i[data-lucide]');
      const hasActiveClass = element.classList.contains('active');
      const hasFillCurrent = iconElement && iconElement.classList.contains('fill-current');

      // Fix inconsistencies
      if (iconElement) {
        if (hasActiveClass && !hasFillCurrent) {
          iconElement.classList.add('fill-current');
        } else if (!hasActiveClass && hasFillCurrent) {
          iconElement.classList.remove('fill-current');
        } else {
          console.log(`jLike: ${likeId} - state is correct`);
        }
      }
    });
  }
}

// Create global instance
window.jLike = new jLikeManager();

// Export for modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = jLikeManager;
}
