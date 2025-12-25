document.addEventListener('alpine:init', () => {
  Alpine.data('searchJobComponent', () => ({
    keyword: '',
    searchTitle: 'Tìm kiếm việc làm',

    // Salary slider properties
    salaryMin: 0,
    salaryMax: 50,
    isDragging: false,
    dragStartX: 0,
    sliderWidth: 0,
    sliderElement: null,

    init() {
      // Initialize slider element reference (for both mobile and desktop)
      this.$nextTick(() => {
        // Try desktop slider first, then mobile
        this.sliderElement = this.$refs.salarySlider || this.$refs.salarySliderMobile;
        if (this.sliderElement) {
          this.sliderWidth = this.sliderElement.offsetWidth;
        }
      });
    },

    performSearch() {
      if (this.keyword.trim()) {
        this.searchTitle = `Tìm kiếm việc làm "${this.keyword.trim()}"`;
      } else {
        this.searchTitle = 'Tìm kiếm việc làm';
      }
    },

    clearKeyword() {
      this.keyword = '';
      this.searchTitle = 'Tìm kiếm việc làm';
    },

    // Salary slider methods
    getSalaryPercentage() {
      return (this.salaryMin / this.salaryMax) * 100;
    },

    getSalaryDisplayValue() {
      return this.salaryMin > 0 ? `${this.salaryMin} triệu` : '0 triệu';
    },

    startDrag(event) {
      event.preventDefault();
      this.isDragging = true;
      this.dragStartX = event.type === 'mousedown' ? event.clientX : event.touches[0].clientX;

      // Add global event listeners
      document.addEventListener('mousemove', this.onDrag.bind(this));
      document.addEventListener('mouseup', this.endDrag.bind(this));
      document.addEventListener('touchmove', this.onDrag.bind(this));
      document.addEventListener('touchend', this.endDrag.bind(this));
    },

    onDrag(event) {
      if (!this.isDragging) return;

      event.preventDefault();
      const currentX = event.type === 'mousemove' ? event.clientX : event.touches[0].clientX;
      const deltaX = currentX - this.dragStartX;

      // Calculate new percentage based on drag distance
      const sliderRect = this.sliderElement.getBoundingClientRect();
      const relativeX = currentX - sliderRect.left;
      const percentage = Math.max(0, Math.min(100, (relativeX / sliderRect.width) * 100));

      // Update salary value
      this.salaryMin = Math.round((percentage / 100) * this.salaryMax);

      // Update drag start position for smooth continuous dragging
      this.dragStartX = currentX;
    },

    endDrag() {
      this.isDragging = false;

      // Remove global event listeners
      document.removeEventListener('mousemove', this.onDrag.bind(this));
      document.removeEventListener('mouseup', this.endDrag.bind(this));
      document.removeEventListener('touchmove', this.onDrag.bind(this));
      document.removeEventListener('touchend', this.endDrag.bind(this));
    },

    // Handle slider track click
    onSliderClick(event) {
      if (this.isDragging) return;

      const sliderRect = this.sliderElement.getBoundingClientRect();
      const clickX = event.clientX - sliderRect.left;
      const percentage = Math.max(0, Math.min(100, (clickX / sliderRect.width) * 100));

      this.salaryMin = Math.round((percentage / 100) * this.salaryMax);
    },

    // Clear salary filter
    removeSalary() {
      this.salaryMin = 0;
    },

    // Clear all filters
    clearAllFilters() {
      this.salaryMin = 0;
      // Reset all checkboxes
      const checkboxes = document.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach(checkbox => {
        checkbox.checked = false;
      });
    }

  }));

  // Mobile Filter Drawer
  Alpine.data('mobileFilterDrawer', () => ({
    isOpen: false,

    open() {
      this.isOpen = true;
      document.body.style.overflow = 'hidden';
    },

    close() {
      this.isOpen = false;
      document.body.style.overflow = '';
    },

    toggle() {
      if (this.isOpen) {
        this.close();
      } else {
        this.open();
      }
    }
  }));
});