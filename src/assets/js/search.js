document.addEventListener('alpine:init', () => {
  Alpine.data('searchComponent', () => ({
    userLatitude: null,
    userLongitude: null,
    isGettingLocation: false,
    isLocationRequested: false,
    activeTab: 'all', // Default tab

    init() {
      setTimeout(() => {
        this.requestUserLocation();
      }, 1000);

      // Initialize tab content and filters
      this.updateTabContent();
      this.updateFilters();
    },

    // Hàm yêu cầu lấy tọa độ của người dùng
    requestUserLocation() {
      if (navigator.geolocation) {
        // Hiển thị thông báo yêu cầu quyền truy cập vị trí
        if (window.fastNotice) {
          window.fastNotice.show('Đang yêu cầu quyền truy cập vị trí để cung cấp dịch vụ tốt hơn...', 'info');
        }

        this.isGettingLocation = true;

        navigator.geolocation.getCurrentPosition(
          (position) => {
            // Thành công lấy được tọa độ
            this.userLatitude = position.coords.latitude;
            this.userLongitude = position.coords.longitude;

            // Lưu tọa độ vào localStorage để sử dụng sau này
            localStorage.setItem('userLatitude', this.userLatitude);
            localStorage.setItem('userLongitude', this.userLongitude);

            if (window.fastNotice) {
              window.fastNotice.show('Đã lấy được vị trí của bạn!', 'success');
            }

            this.isGettingLocation = false;
          },
          (error) => {
            // Xử lý lỗi
            let errorMessage = 'Không thể lấy vị trí của bạn. ';

            switch (error.code) {
              case error.PERMISSION_DENIED:
                errorMessage += 'Bạn đã từ chối yêu cầu truy cập vị trí.';
                break;
              case error.POSITION_UNAVAILABLE:
                errorMessage += 'Thông tin vị trí không khả dụng.';
                break;
              case error.TIMEOUT:
                errorMessage += 'Yêu cầu lấy vị trí hết thời gian chờ.';
                break;
              default:
                errorMessage += 'Đã xảy ra lỗi không xác định.';
                break;
            }

            if (window.fastNotice) {
              window.fastNotice.show(errorMessage, 'error');
            }
            this.isGettingLocation = false;
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000 // 5 phút
          }
        );
      } else {
        console.error('Trình duyệt không hỗ trợ Geolocation API');
        if (window.fastNotice) {
          window.fastNotice.show('Trình duyệt của bạn không hỗ trợ định vị GPS', 'warning');
        }
      }
    },

    // Tab switching functionality
    switchTab(tabName) {
      this.activeTab = tabName;
      this.updateTabContent();
      this.updateFilters();
    },

    updateTabContent() {
      // Tab configuration mapping
      const tabConfig = {
        'all': {
          results: ['job-results', 'real-estate-results', 'service-results', 'company-results', 'news-results', 'location-results'],
          sort: ['common-sort']
        },
        'jobs': {
          results: ['job-results'],
          sort: ['job-sort']
        },
        'estates': {
          results: ['real-estate-results'],
          sort: ['real-estate-sort']
        },
        'services': {
          results: ['service-results'],
          sort: ['service-sort']
        },
        'companies': {
          results: ['company-results'],
          sort: ['company-sort']
        },
        'news': {
          results: ['news-results'],
          sort: ['news-sort']
        },
        'locations': {
          results: ['location-results'],
          sort: ['location-sort']
        }
      };

      // Hide all result sections
      const allResults = ['job-results', 'real-estate-results', 'service-results', 'company-results', 'news-results', 'location-results'];
      allResults.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.style.display = 'none';
      });

      // Hide all sort sections
      const allSorts = ['common-sort', 'job-sort', 'real-estate-sort', 'service-sort', 'company-sort', 'news-sort', 'location-sort'];
      allSorts.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.classList.add('hidden');
      });

      // Show appropriate content based on active tab
      const config = tabConfig[this.activeTab];
      if (config) {
        // Show result sections
        config.results.forEach(id => {
          const element = document.getElementById(id);
          if (element) element.style.display = 'block';
        });

        // Show sort sections
        config.sort.forEach(id => {
          const element = document.getElementById(id);
          if (element) element.classList.remove('hidden');
        });
      }
    },

    updateFilters() {
      // Filter configuration mapping
      const filterConfig = {
        'all': ['common-filter'],
        'jobs': ['common-filter', 'job-filter'],
        'estates': ['common-filter', 'real-estate-filter'],
        'services': ['common-filter', 'service-filter'],
        'companies': ['common-filter', 'company-filter'],
        'news': ['common-filter', 'news-filter'],
        'locations': ['common-filter', 'location-filter']
      };

      // Hide all filter sections
      const allFilters = ['common-filter', 'job-filter', 'real-estate-filter', 'service-filter', 'company-filter', 'news-filter', 'location-filter'];
      allFilters.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.classList.add('hidden');
      });

      // Show appropriate filters based on active tab
      const filtersToShow = filterConfig[this.activeTab] || ['common-filter'];
      filtersToShow.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.classList.remove('hidden');
      });
    },

    // Hàm xóa tất cả bộ lọc
    clearAllFilters() {
      // Reset tất cả select elements về option đầu tiên
      const allSelects = document.querySelectorAll('select');
      allSelects.forEach(select => {
        select.selectedIndex = 0;
      });

      // Reset tất cả input elements
      const allInputs = document.querySelectorAll('input');
      allInputs.forEach(input => {
        if (input.type === 'text' || input.type === 'number' || input.type === 'email' || input.type === 'tel') {
          input.value = '';
        } else if (input.type === 'checkbox' || input.type === 'radio') {
          input.checked = false;
        }
      });
    },

  }));
});