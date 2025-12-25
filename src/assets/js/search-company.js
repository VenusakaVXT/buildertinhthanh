document.addEventListener('alpine:init', () => {
  Alpine.data('searchCompanyComponent', () => ({
    keyword: '',
    employeesMin: '',
    employeesMax: '',
    employeesError: '',
    revenueMin: '',
    revenueMax: '',
    revenueError: '',
    establishmentYear: '',
    establishmentYearError: '',

    // Rating slider properties
    minRating: 0,
    ratingMax: 5,
    isRatingDragging: false,
    ratingDragStartX: 0,
    ratingSliderWidth: 0,
    ratingSliderElement: null,

    // Applied filters
    appliedFilters: [],

    init() {
      this.handleSelectLocation();
      this.handleSelectIndustry();

      // Initialize rating slider element reference (for both mobile and desktop)
      this.$nextTick(() => {
        // Try desktop slider first, then mobile
        this.ratingSliderElement = this.$refs.ratingSlider || this.$refs.ratingSliderMobile;
        if (this.ratingSliderElement) {
          this.ratingSliderWidth = this.ratingSliderElement.offsetWidth;
        }
      });
    },

    // Clear input
    clearKeyword() {
      this.keyword = '';
    },

    handleSelectLocation() {
      // Handle both mobile and desktop selects
      const provinceSelects = [
        document.getElementById('province'),
        document.getElementById('province-mobile'),
        document.getElementById('province-desktop')
      ].filter(el => el !== null);
      
      const districtSelects = [
        document.getElementById('district'),
        document.getElementById('district-mobile'),
        document.getElementById('district-desktop')
      ].filter(el => el !== null);

      provinceSelects.forEach(provinceSelect => {
        provinceSelect.addEventListener('change', function () {
          const selectedProvince = this.value;
          const provinceId = this.id;
          
          // Find corresponding district select (mobile/desktop)
          let districtSelect = null;
          if (provinceId.includes('mobile')) {
            districtSelect = document.getElementById('district-mobile');
          } else if (provinceId.includes('desktop')) {
            districtSelect = document.getElementById('district-desktop');
          } else {
            districtSelect = document.getElementById('district');
          }

          if (districtSelect) {
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
          }
        });
      });
    },

    handleSelectIndustry() {
      // Handle both mobile and desktop industry selects
      const industrySelects = [
        document.querySelector('select[class*="select-white"]:not(#province):not(#district):not(#province-mobile):not(#district-mobile):not(#province-desktop):not(#district-desktop):not(#subIndustry):not(#subIndustry-mobile):not(#subIndustry-desktop)'),
        document.getElementById('industry-desktop')
      ].filter(el => el !== null);
      
      industrySelects.forEach(industrySelect => {
        industrySelect.addEventListener('change', function () {
          const selectedIndustry = this.value;
          const industryId = this.id;
          
          // Find corresponding sub-industry select (mobile/desktop)
          let subIndustrySelect = null;
          if (industryId && industryId.includes('desktop')) {
            subIndustrySelect = document.getElementById('subIndustry-desktop');
          } else {
            // Try to find mobile or default
            subIndustrySelect = document.getElementById('subIndustry-mobile') || document.getElementById('subIndustry');
          }

          if (subIndustrySelect) {
            // Reset sub-industry select
            subIndustrySelect.selectedIndex = 0;

            if (selectedIndustry) {
              // Enable sub-industry select
              subIndustrySelect.disabled = false;

              // Show/hide options based on selected industry
              const options = subIndustrySelect.querySelectorAll('option[data-industry]');
              options.forEach(option => {
                if (option.dataset.industry === selectedIndustry) {
                  option.style.display = 'block';
                } else {
                  option.style.display = 'none';
                }
              });
            } else {
              // Disable sub-industry select
              subIndustrySelect.disabled = true;

              // Hide all sub-industry options
              const options = subIndustrySelect.querySelectorAll('option[data-industry]');
              options.forEach(option => {
                option.style.display = 'none';
              });
            }
          }
        });
      });
    },

    validateEmployees() {
      this.employeesError = '';

      if (this.employeesMin && this.employeesMax) {
        const min = parseInt(this.employeesMin);
        const max = parseInt(this.employeesMax);

        if (!isNaN(min) && !isNaN(max) && min >= max) {
          this.employeesError = 'Giá trị tối thiểu phải nhỏ hơn giá trị tối đa';
          return false;
        }
      }

      return true;
    },

    validateRevenue() {
      this.revenueError = '';

      if (this.revenueMin && this.revenueMax) {
        const min = parseInt(this.revenueMin);
        const max = parseInt(this.revenueMax);

        if (!isNaN(min) && !isNaN(max) && min >= max) {
          this.revenueError = 'Giá trị tối thiểu phải nhỏ hơn giá trị tối đa';
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
    },

    // Check if there are active filters
    hasActiveFilters() {
      return this.appliedFilters && this.appliedFilters.length > 0 || this.employeesMin || this.employeesMax || this.revenueMin || this.revenueMax || this.establishmentYear || this.minRating > 0;
    },

    // Clear all filters
    clearAllFilters() {
      this.employeesMin = '';
      this.employeesMax = '';
      this.employeesError = '';
      this.revenueMin = '';
      this.revenueMax = '';
      this.revenueError = '';
      this.establishmentYear = '';
      this.establishmentYearError = '';
      this.minRating = 0;
      this.appliedFilters = [];
      // Reset all checkboxes
      const checkboxes = document.querySelectorAll('input[type="checkbox"]');
      checkboxes.forEach(checkbox => {
        checkbox.checked = false;
      });
      // Reset all selects
      const selects = document.querySelectorAll('select');
      selects.forEach(select => {
        select.selectedIndex = 0;
      });
    },

    // Update establishment year
    updateEstablishmentYear() {
      // This method can be implemented to update URL parameters
      // For now, it's a placeholder
      if (this.establishmentYear) {
        const year = parseInt(this.establishmentYear);
        const currentYear = new Date().getFullYear();
        if (year > currentYear) {
          this.establishmentYearError = 'Năm thành lập không được lớn hơn năm hiện tại';
        } else if (year < 1900) {
          this.establishmentYearError = 'Năm thành lập không hợp lệ';
        } else {
          this.establishmentYearError = '';
        }
      } else {
        this.establishmentYearError = '';
      }
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