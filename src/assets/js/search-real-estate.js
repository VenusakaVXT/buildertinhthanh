document.addEventListener('alpine:init', () => {
  Alpine.data('searchRealEstateComponent', () => ({
    keyword: '',
    priceMin: '',
    priceMax: '',

    // Area slider properties
    areaMin: 0,
    areaMax: 500,
    isDragging: false,
    dragStartX: 0,
    sliderWidth: 0,
    sliderElement: null,

    init() {
      this.handleSelectLocation();
      // Initialize slider element reference
      this.$nextTick(() => {
        this.sliderElement = this.$refs.areaSlider;
        if (this.sliderElement) {
          this.sliderWidth = this.sliderElement.offsetWidth;
        }
      });
    },

    // Clear input
    clearKeyword() {
      this.keyword = '';
    },

    handleSelectLocation() {
      const provinceSelect = document.getElementById('province');
      const districtSelect = document.getElementById('district');

      if (provinceSelect && districtSelect) {
        provinceSelect.addEventListener('change', function () {
          const selectedProvince = this.value;

          // Reset district select
          districtSelect.selectedIndex = 0;

          if (selectedProvince) {
            // Enable district select
            districtSelect.disabled = false;

            // Show/hide options based on selected province
            const options = districtSelect.querySelectorAll('option[data-province]');
            options.forEach(option => {
              if (option.dataset.province === selectedProvince) {
                option.style.display = 'block';
              } else {
                option.style.display = 'none';
              }
            });
          } else {
            // Disable district select
            districtSelect.disabled = true;

            // Hide all district options
            const options = districtSelect.querySelectorAll('option[data-province]');
            options.forEach(option => {
              option.style.display = 'none';
            });
          }
        });
      }
    },

    validatePrice() {
      this.priceError = '';

      if (this.priceMin && this.priceMax) {
        const min = parseFloat(this.priceMin);
        const max = parseFloat(this.priceMax);

        if (!isNaN(min) && !isNaN(max) && min >= max) {
          this.priceError = 'Giá trị tối thiểu phải nhỏ hơn giá trị tối đa';
          return false;
        }
      }

      return true;
    },

    // Area slider methods
    getAreaPercentage() {
      return (this.areaMin / this.areaMax) * 100;
    },

    getAreaDisplayValue() {
      return this.areaMin > 0 ? `${this.areaMin} m²` : '0 m²';
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

      // Update area value
      this.areaMin = Math.round((percentage / 100) * this.areaMax);

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

      this.areaMin = Math.round((percentage / 100) * this.areaMax);
    },

    // Clear area filter
    removeArea() {
      this.areaMin = 0;
    }
  }));
});