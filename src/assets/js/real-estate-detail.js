// Real Estate Detail Alpine.js Component
// Xử lý logic cho trang chi tiết bất động sản

document.addEventListener('alpine:init', () => {
  // ===========================================
  // REAL ESTATE DETAIL COMPONENT
  // ===========================================
  Alpine.data('realEstateDetailComponent', () => ({
    isLoading: false,
    errors: {},

    init() {
      // Khởi tạo jModal cho các modal
      this.$nextTick(() => {
        if (window.jModal) {
          window.jModal.init('#scheduleVisitModal');
          window.jModal.init('#sendContactModal');
        }

        // Khởi tạo progress bar
        this.updateProgressBar();
      });
    },

    // Xử lý click nút "Đặt lịch xem nhà"
    handleScheduleVisit() {
      this.openScheduleModal();
    },

    // Mở modal đặt lịch xem nhà
    openScheduleModal() {
      if (window.jModal) {
        window.jModal.open('scheduleVisitModal');
      } else {
        // Fallback nếu jModal không có
        const modal = document.getElementById('scheduleVisitModal');
        if (modal) {
          modal.classList.remove('hidden');
        }
      }
    },

    // Đóng modal đặt lịch xem nhà
    closeScheduleModal() {
      if (window.jModal) {
        window.jModal.close('scheduleVisitModal');
      } else {
        const modal = document.getElementById('scheduleVisitModal');
        if (modal) {
          modal.classList.add('hidden');
        }
      }
    },

    // Xử lý click nút "Gửi thông tin liên hệ"
    handleSendContact() {
      this.openContactModal();
    },

    // Mở modal gửi thông tin liên hệ
    openContactModal() {
      if (window.jModal) {
        window.jModal.open('sendContactModal');
      } else {
        // Fallback nếu jModal không có
        const modal = document.getElementById('sendContactModal');
        if (modal) {
          modal.classList.remove('hidden');
        }
      }
    },

    // Đóng modal gửi thông tin liên hệ
    closeContactModal() {
      if (window.jModal) {
        window.jModal.close('sendContactModal');
      } else {
        const modal = document.getElementById('sendContactModal');
        if (modal) {
          modal.classList.add('hidden');
        }
      }
    },

    // Xử lý submit form đặt lịch xem nhà
    async handleScheduleSubmit(event) {
      event.preventDefault();
      this.isLoading = true;
      this.errors = {};

      try {
        // Lấy dữ liệu form
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());

        // Validation
        if (!data.fullName?.trim()) {
          this.errors.fullName = 'Vui lòng nhập họ và tên';
        }
        if (!data.phone?.trim()) {
          this.errors.phone = 'Vui lòng nhập số điện thoại';
        }
        if (!data.visitDate?.trim()) {
          this.errors.visitDate = 'Vui lòng chọn ngày xem';
        }
        if (!data.visitTime?.trim()) {
          this.errors.visitTime = 'Vui lòng chọn giờ xem';
        }

        // Validation ngày xem
        if (data.visitDate?.trim()) {
          const selectedDate = new Date(data.visitDate);
          const today = new Date();
          today.setHours(0, 0, 0, 0); // Reset time to start of day

          if (selectedDate < today) {
            this.errors.visitDate = 'Ngày xem không được nhỏ hơn ngày hôm nay';
          }
        }

        // Validation giờ xem
        if (data.visitTime?.trim() && data.visitDate?.trim()) {
          const selectedDate = new Date(data.visitDate);
          const selectedTime = data.visitTime;
          const [hours, minutes] = selectedTime.split(':').map(Number);

          // Tạo datetime từ ngày và giờ đã chọn
          const selectedDateTime = new Date(selectedDate);
          selectedDateTime.setHours(hours, minutes, 0, 0);

          const now = new Date();
          const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000); // 1 tiếng từ bây giờ

          if (selectedDateTime < now) {
            this.errors.visitTime = 'Giờ xem không được là giờ quá khứ';
          } else if (selectedDateTime < oneHourFromNow) {
            this.errors.visitTime = 'Vui lòng đặt lịch trước ít nhất 1 tiếng';
          }
        }

        if (Object.keys(this.errors).length > 0) {
          this.isLoading = false;
          return;
        }

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Thành công
        if (window.fastNotice) {
          window.fastNotice.show('Đặt lịch xem nhà thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.', 'success');
        } else {
          alert('Đặt lịch xem nhà thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.');
        }

        // Đóng modal và reset form
        this.closeScheduleModal();
        event.target.reset();

      } catch (error) {
        if (window.fastNotice) {
          window.fastNotice.show('Có lỗi xảy ra. Vui lòng thử lại.', 'error');
        } else {
          alert('Có lỗi xảy ra. Vui lòng thử lại.');
        }
      } finally {
        this.isLoading = false;
      }
    },

    // Xử lý submit form gửi thông tin liên hệ
    async handleContactSubmit(event) {
      event.preventDefault();
      this.isLoading = true;
      this.errors = {};

      try {
        // Lấy dữ liệu form
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());

        // Validation
        if (!data.fullName?.trim()) {
          this.errors.fullName = 'Vui lòng nhập họ và tên';
        }
        if (!data.phone?.trim()) {
          this.errors.phone = 'Vui lòng nhập số điện thoại';
        }

        if (Object.keys(this.errors).length > 0) {
          this.isLoading = false;
          return;
        }

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Thành công
        if (window.fastNotice) {
          window.fastNotice.show('Gửi thông tin liên hệ thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.', 'success');
        } else {
          alert('Gửi thông tin liên hệ thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.');
        }

        // Đóng modal và reset form
        this.closeContactModal();
        event.target.reset();

      } catch (error) {
        if (window.fastNotice) {
          window.fastNotice.show('Có lỗi xảy ra. Vui lòng thử lại.', 'error');
        } else {
          alert('Có lỗi xảy ra. Vui lòng thử lại.');
        }
      } finally {
        this.isLoading = false;
      }
    },

    // Xử lý chia sẻ bất động sản
    async handleShare() {
      try {
        // Lấy thông tin từ DOM
        const realEstateTitle = document.querySelector('.real-estate-title')?.textContent?.trim() || 'Bất động sản';
        const currentUrl = window.location.href;

        // Tạo text chia sẻ
        const shareText = `Xem bất động sản ${realEstateTitle}`;

        // Kiểm tra Web Share API có hỗ trợ không
        if (navigator.share) {
          await navigator.share({
            title: realEstateTitle,
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
        // Fallback cuối cùng: hiển thị URL
        const currentUrl = window.location.href;
        if (window.fastNotice) {
          window.fastNotice.show(`Link chia sẻ: ${currentUrl}`, 'info');
        } else {
          alert(`Link chia sẻ: ${currentUrl}`);
        }
      }
    },

    // Format price
    formatPrice(price) {
      if (price >= 1000000000) {
        return `${(price / 1000000000).toFixed(1)} tỷ`;
      } else if (price >= 1000000) {
        return `${(price / 1000000).toFixed(0)} triệu`;
      }
      return price.toLocaleString();
    },

    // Format area
    formatArea(area) {
      return `${area}m²`;
    },

    // Format date
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    },

    // Xử lý thay đổi tỷ lệ vay từ range slider
    handleLoanRateChange(event) {
      const value = event.target.value;
      const numberInput = document.querySelector('input[name="loanRate"]');
      if (numberInput) {
        numberInput.value = value;
      }
    },

    // Xử lý thay đổi tỷ lệ vay từ number input
    handleLoanRateInput(event) {
      const value = parseInt(event.target.value);
      const rangeInput = document.querySelector('input[type="range"]');
      if (rangeInput && value >= 10 && value <= 90) {
        rangeInput.value = value;
      }
    },

    // Xử lý thay đổi checkbox trong checklist
    handleChecklistChange() {
      this.updateProgressBar();
    },

    // Cập nhật progress bar dựa trên số checkbox được checked
    updateProgressBar() {
      const checkboxes = document.querySelectorAll('.checklist-checkbox');
      const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
      const totalCount = checkboxes.length;
      const percentage = totalCount > 0 ? (checkedCount / totalCount) * 100 : 0;

      // Cập nhật progress bar
      const progressBar = document.querySelector('.progress-bar .bg-blue-500');
      if (progressBar) {
        progressBar.style.width = `${percentage}%`;
      }

      // Cập nhật text tiến độ
      const progressText = document.querySelector('.progress-text');
      if (progressText) {
        progressText.textContent = `${checkedCount}/${totalCount} hoàn thành`;
      }
    },
  }));
});

// Export for use in HTML
window.realEstateDetailComponent = realEstateDetailComponent;