// Location Detail Alpine.js Component
// Xử lý logic cho trang chi tiết địa điểm

document.addEventListener('alpine:init', () => {
  // ===========================================
  // LOCATION DETAIL COMPONENT
  // ===========================================
  Alpine.data('locationDetailComponent', () => ({
    // Trạng thái yêu thích
    isFavorite: false,

    init() {
      console.log('Location detail component initialized');

      // Cập nhật text và class cho tất cả các ngày
      this.$nextTick(() => {
        const days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];
        days.forEach(dayName => {
          // Cập nhật text ngày
          const dayElements = document.querySelectorAll(`[data-day="${dayName}"]`);
          dayElements.forEach(element => {
            this.updateDayText(dayName, element);
          });

          // Cập nhật container ngày
          const containerElements = document.querySelectorAll(`[data-day-container="${dayName}"]`);
          containerElements.forEach(element => {
            this.updateDayContainer(dayName, element);
          });

          // Cập nhật text thời gian
          const timeElements = document.querySelectorAll(`[data-time="${dayName}"]`);
          timeElements.forEach(element => {
            this.updateTimeText(dayName, element);
          });
        });
      });
    },

    // Lấy thứ trong tuần theo múi giờ Việt Nam
    getCurrentDayOfWeek() {
      const now = new Date();

      // Sử dụng Intl.DateTimeFormat với timezone Việt Nam
      const formatter = new Intl.DateTimeFormat('vi-VN', {
        timeZone: 'Asia/Ho_Chi_Minh',
        weekday: 'long'
      });

      const dayName = formatter.format(now);

      // Chuyển đổi từ tên tiếng Việt sang format cần thiết
      const dayMap = {
        'Chủ Nhật': 'Chủ nhật',
        'Thứ Hai': 'Thứ 2',
        'Thứ Ba': 'Thứ 3',
        'Thứ Tư': 'Thứ 4',
        'Thứ Năm': 'Thứ 5',
        'Thứ Sáu': 'Thứ 6',
        'Thứ Bảy': 'Thứ 7'
      };

      return dayMap[dayName] || dayName;
    },

    // Kiểm tra xem có phải ngày hôm nay không
    isToday(dayName) {
      return this.getCurrentDayOfWeek() === dayName;
    },


    // Cập nhật text và class cho ngày
    updateDayText(dayName, element) {
      if (this.isToday(dayName)) {
        element.innerHTML = `<span class="font-semibold text-blue-700">${dayName} (Hôm nay)</span>`;
        element.classList.remove('text-gray-600');
      } else {
        element.innerHTML = dayName;
        element.classList.remove('font-semibold', 'text-blue-700');
        element.classList.add('text-gray-600');
      }
    },

    // Cập nhật class cho container ngày
    updateDayContainer(dayName, element) {
      if (this.isToday(dayName)) {
        element.classList.add('bg-blue-50', 'border', 'border-blue-200');
      } else {
        element.classList.remove('bg-blue-50', 'border', 'border-blue-200');
      }
    },

    // Cập nhật class cho thời gian
    updateTimeText(dayName, element) {
      if (this.isToday(dayName)) {
        element.classList.add('font-semibold', 'text-blue-700');
        element.classList.remove('text-gray-900');
      } else {
        element.classList.remove('font-semibold', 'text-blue-700');
        element.classList.add('text-gray-900');
      }
    },

    // Xử lý chia sẻ địa điểm
    async handleShare() {
      try {
        // Lấy thông tin từ DOM
        const locationTitle = document.querySelector('h1')?.textContent?.trim() || 'Địa điểm';
        const currentUrl = window.location.href;

        // Tạo text chia sẻ
        const shareText = `Xem địa điểm ${locationTitle}`;

        // Kiểm tra Web Share API có hỗ trợ không
        if (navigator.share) {
          await navigator.share({
            title: locationTitle,
            text: shareText,
            url: currentUrl
          });
        } else {
          // Fallback: Copy URL vào clipboard
          await navigator.clipboard.writeText(`${shareText}\n${currentUrl}`);

          if (window.fastNotice) {
            window.fastNotice.show('Đã copy link chia sẻ vào clipboard!', 'success');
          } else {
            alert('Đã copy link chia sẻ vào clipboard!');
          }
        }
      } catch (error) {
        console.error('Share error:', error);

        // Fallback cuối cùng: hiển thị URL
        const currentUrl = window.location.href;
        if (window.fastNotice) {
          window.fastNotice.show(`Link chia sẻ: ${currentUrl}`, 'info');
        } else {
          alert(`Link chia sẻ: ${currentUrl}`);
        }
      }
    },

    // Xử lý scroll đến bản đồ
    scrollToMap() {
      // Tìm phần tử bản đồ
      const mapElement = document.querySelector('iframe[title*="Bản đồ"]')?.closest('.bg-white.rounded-2xl.shadow-lg');

      if (mapElement) {
        // Scroll đến phần bản đồ với offset để không bị che bởi header
        const offset = 80; // Khoảng cách từ top
        const elementPosition = mapElement.offsetTop;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      } else {
        // Fallback: scroll đến cuối trang
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: 'smooth'
        });
      }
    },

    // Xử lý toggle yêu thích
    toggleFavorite() {
      this.isFavorite = !this.isFavorite;

      // Hiển thị thông báo
      if (this.isFavorite) {
        if (window.fastNotice) {
          window.fastNotice.show('Đã thêm vào yêu thích!', 'success');
        } else {
          alert('Đã thêm vào yêu thích!');
        }
      } else {
        if (window.fastNotice) {
          window.fastNotice.show('Đã bỏ yêu thích!', 'info');
        } else {
          alert('Đã bỏ yêu thích!');
        }
      }
    },

    // Xử lý scroll đến phần đánh giá
    scrollToReviews() {
      // Tìm phần tử đánh giá
      const reviewsElement = document.getElementById('location-reviews');

      if (reviewsElement) {
        // Scroll đến phần đánh giá với offset để không bị che bởi header
        const offset = 80; // Khoảng cách từ top
        const elementPosition = reviewsElement.offsetTop;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      } else {
        // Fallback: scroll đến cuối trang
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: 'smooth'
        });
      }
    }
  }));
});

// Export for use in HTML
window.locationDetailComponent = locationDetailComponent;