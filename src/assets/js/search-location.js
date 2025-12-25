document.addEventListener('alpine:init', () => {
  Alpine.data('searchLocationComponent', () => ({
    keyword: '',

    // Rating slider properties
    minRating: 0,
    ratingMax: 5,
    isRatingDragging: false,
    ratingDragStartX: 0,
    ratingSliderWidth: 0,
    ratingSliderElement: null,

    // Geolocation properties
    currentLat: null,
    currentLng: null,
    isGettingLocation: false,
    manualLat: '',
    manualLng: '',
    isManualLocation: false,
    showLocationDisplay: false,


    init() {
      // Initialize rating slider element reference
      this.$nextTick(() => {
        this.ratingSliderElement = this.$refs.ratingSlider;
        if (this.ratingSliderElement) {
          this.ratingSliderWidth = this.ratingSliderElement.offsetWidth;
        }
      });

      // Initialize from URL params
      const urlParams = new URLSearchParams(window.location.search);

      // Initialize location from URL params
      const latParam = urlParams.get('lat');
      const lngParam = urlParams.get('lng');
      this.currentLat = latParam ? parseFloat(latParam) : null;
      this.currentLng = lngParam ? parseFloat(lngParam) : null;

      // Initialize manual coordinates from URL params
      this.manualLat = latParam || '';
      this.manualLng = lngParam || '';

      // Show location display only if we have coordinates from URL (meaning user just set location)
      this.showLocationDisplay = this.currentLat !== null && this.currentLng !== null;

      // If we have coordinates, show the display after a small delay to prevent flash
      if (this.showLocationDisplay) {
        this.$nextTick(() => {
          const element = document.querySelector('[x-show="showLocationDisplay"]');
          if (element) {
            element.style.display = 'block';
          }
        });
      }

    },

    clearKeyword() {
      this.keyword = '';
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

    // Geolocation functions
    getCurrentLocation() {
      if (!navigator.geolocation) {
        alert('Trình duyệt của bạn không hỗ trợ định vị địa lý.');
        return;
      }

      // Don't override manual coordinates
      if (this.isManualLocation) {
        alert('Tọa độ thủ công đang được sử dụng. Vui lòng xóa tọa độ thủ công trước khi sử dụng vị trí hiện tại.');
        return;
      }

      this.isGettingLocation = true;

      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.currentLat = position.coords.latitude;
          this.currentLng = position.coords.longitude;
          this.isManualLocation = false;
          this.updateLocationInURL();
          this.isGettingLocation = false;
          console.log('Vị trí hiện tại:', this.currentLat, this.currentLng);
        },
        (error) => {
          this.isGettingLocation = false;
          let errorMessage = 'Không thể lấy vị trí hiện tại.';

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Bạn đã từ chối quyền truy cập vị trí.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Thông tin vị trí không khả dụng.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Yêu cầu lấy vị trí đã hết thời gian chờ.';
              break;
          }

          alert(errorMessage);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    },

    getCurrentLocationAndRedirect() {
      if (!navigator.geolocation) {
        alert('Trình duyệt của bạn không hỗ trợ định vị địa lý.');
        return;
      }

      this.isGettingLocation = true;

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          // Set location data before redirect
          this.currentLat = lat;
          this.currentLng = lng;
          this.showLocationDisplay = true;

          // Show the display immediately
          this.$nextTick(() => {
            const element = document.querySelector('[x-show="showLocationDisplay"]');
            if (element) {
              element.style.display = 'block';
            }
          });

          // Redirect to current page with lat and lng params
          const url = new URL(window.location);
          url.searchParams.set('lat', lat.toString());
          url.searchParams.set('lng', lng.toString());

          this.isGettingLocation = false;
          window.location.href = url.toString();
        },
        (error) => {
          this.isGettingLocation = false;
          let errorMessage = 'Không thể lấy vị trí hiện tại.';

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Bạn đã từ chối quyền truy cập vị trí.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Thông tin vị trí không khả dụng.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Yêu cầu lấy vị trí đã hết thời gian chờ.';
              break;
          }

          alert(errorMessage);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    },

    updateLocationInURL() {
      const url = new URL(window.location);
      if (this.currentLat !== null && this.currentLng !== null) {
        url.searchParams.set('lat', this.currentLat.toString());
        url.searchParams.set('lng', this.currentLng.toString());

        // Update manual coordinates display if using manual location
        if (this.isManualLocation) {
          this.manualLat = this.currentLat.toString();
          this.manualLng = this.currentLng.toString();
        }
      } else {
        url.searchParams.delete('lat');
        url.searchParams.delete('lng');
        this.manualLat = '';
        this.manualLng = '';
        this.isManualLocation = false;
      }
      window.history.pushState({}, '', url);
    },

    clearLocation() {
      this.currentLat = null;
      this.currentLng = null;
      this.manualLat = '';
      this.manualLng = '';
      this.isManualLocation = false;
      this.updateLocationInURL();
    },

    clearLocationAndRedirect() {
      // Redirect to current page without lat and lng params
      const url = new URL(window.location);
      url.searchParams.delete('lat');
      url.searchParams.delete('lng');
      window.location.href = url.toString();
    },

    // Manual coordinates functions
    setManualLocation() {
      const lat = parseFloat(this.manualLat);
      const lng = parseFloat(this.manualLng);

      // Validate coordinates
      if (isNaN(lat) || isNaN(lng)) {
        alert('Vui lòng nhập tọa độ hợp lệ.');
        return;
      }

      if (lat < -90 || lat > 90) {
        alert('Vĩ độ phải nằm trong khoảng -90 đến 90.');
        return;
      }

      if (lng < -180 || lng > 180) {
        alert('Kinh độ phải nằm trong khoảng -180 đến 180.');
        return;
      }

      // Set manual coordinates with priority
      this.currentLat = lat;
      this.currentLng = lng;
      this.isManualLocation = true;
      this.showLocationDisplay = true;

      // Show the display immediately
      this.$nextTick(() => {
        const element = document.querySelector('[x-show="showLocationDisplay"]');
        if (element) {
          element.style.display = 'block';
        }
      });

      // Redirect to current page with lat and lng params
      const url = new URL(window.location);
      url.searchParams.set('lat', lat.toString());
      url.searchParams.set('lng', lng.toString());
      window.location.href = url.toString();
    },


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