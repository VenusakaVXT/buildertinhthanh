document.addEventListener('alpine:init', () => {
  Alpine.data('searchServiceComponent', () => ({
    keyword: '',
    priceMin: '',
    priceMax: '',

    // Rating slider properties
    minRating: 0,
    ratingMax: 5,
    isRatingDragging: false,
    ratingDragStartX: 0,
    ratingSliderWidth: 0,
    ratingSliderElement: null,

    init() {
      // Initialize rating slider element reference
      this.$nextTick(() => {
        this.ratingSliderElement = this.$refs.ratingSlider;
        if (this.ratingSliderElement) {
          this.ratingSliderWidth = this.ratingSliderElement.offsetWidth;
        }
      });
    },

    // Clear input
    clearKeyword() {
      this.keyword = '';
    },

    validatePrice() {
      this.priceError = '';

      if (this.priceMin && this.priceMax) {
        const min = parseInt(this.priceMin);
        const max = parseInt(this.priceMax);

        if (!isNaN(min) && !isNaN(max) && min >= max) {
          this.priceError = 'Giá trị tối thiểu phải nhỏ hơn giá trị tối đa';
          return false;
        }
      }

      return true;
    },

    // Rating slider methods
    getRatingPercentage() {
      return (this.minRating / this.ratingMax) * 100;
    },

    getRatingDisplayValue() {
      return this.minRating > 0 ? `${this.minRating} sao` : '0 sao';
    },

    startRatingDrag(event) {
      event.preventDefault();
      this.isRatingDragging = true;
      this.ratingDragStartX = event.type === 'mousedown' ? event.clientX : event.touches[0].clientX;

      // Add global event listeners
      document.addEventListener('mousemove', this.onRatingDrag.bind(this));
      document.addEventListener('mouseup', this.endRatingDrag.bind(this));
      document.addEventListener('touchmove', this.onRatingDrag.bind(this));
      document.addEventListener('touchend', this.endRatingDrag.bind(this));
    },

    onRatingDrag(event) {
      if (!this.isRatingDragging) return;

      event.preventDefault();
      const currentX = event.type === 'mousemove' ? event.clientX : event.touches[0].clientX;

      // Calculate new percentage based on drag distance
      const sliderRect = this.ratingSliderElement.getBoundingClientRect();
      const relativeX = currentX - sliderRect.left;
      const percentage = Math.max(0, Math.min(100, (relativeX / sliderRect.width) * 100));

      // Update rating value
      this.minRating = Math.round((percentage / 100) * this.ratingMax * 10) / 10; // Round to 1 decimal place

      // Update drag start position for smooth continuous dragging
      this.ratingDragStartX = currentX;
    },

    endRatingDrag() {
      this.isRatingDragging = false;

      // Remove global event listeners
      document.removeEventListener('mousemove', this.onRatingDrag.bind(this));
      document.removeEventListener('mouseup', this.endRatingDrag.bind(this));
      document.removeEventListener('touchmove', this.onRatingDrag.bind(this));
      document.removeEventListener('touchend', this.endRatingDrag.bind(this));
    },

    // Handle rating slider track click
    onRatingSliderClick(event) {
      if (this.isRatingDragging) return;

      const sliderRect = this.ratingSliderElement.getBoundingClientRect();
      const clickX = event.clientX - sliderRect.left;
      const percentage = Math.max(0, Math.min(100, (clickX / sliderRect.width) * 100));

      this.minRating = Math.round((percentage / 100) * this.ratingMax * 10) / 10; // Round to 1 decimal place
    },

    // Clear rating filter
    removeRating() {
      this.minRating = 0;
    }

  }));
});