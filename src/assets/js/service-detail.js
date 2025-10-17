// Service Detail Alpine.js Component
// Xử lý logic cho trang chi tiết dịch vụ

document.addEventListener('alpine:init', () => {
  // ===========================================
  // SERVICE DETAIL COMPONENT
  // ===========================================
  Alpine.data('serviceDetailComponent', () => ({
    isLoading: false,
    errors: {},

    // FAQ toggle
    openFaqItems: [],

    init() {
      // Khởi tạo jModal cho modal liên hệ
      this.$nextTick(() => {
        if (window.jModal) {
          window.jModal.init('#contactModal');
        }
      });
    },

    // Xử lý click nút "Liên hệ ngay"
    handleContactClick() {
      this.openContactModal();
    },

    // Mở modal liên hệ
    openContactModal() {
      if (window.jModal) {
        window.jModal.open('contactModal');
      } else {
        // Fallback nếu jModal không có
        const modal = document.getElementById('contactModal');
        if (modal) {
          modal.classList.remove('hidden');
        }
      }
    },

    // Đóng modal liên hệ
    closeContactModal() {
      if (window.jModal) {
        window.jModal.close('contactModal');
      } else {
        const modal = document.getElementById('contactModal');
        if (modal) {
          modal.classList.add('hidden');
        }
      }
    },

    // Xử lý submit form liên hệ
    async handleContactSubmit(event) {
      event.preventDefault();
      this.isLoading = true;
      this.errors = {};

      try {
        // Lấy dữ liệu form
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());

        // Validation
        if (!data.name?.trim()) {
          this.errors.name = 'Vui lòng nhập họ và tên';
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
          window.fastNotice.show('Gửi tin nhắn thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.', 'success');
        } else {
          alert('Gửi tin nhắn thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.');
        }

        // Đóng modal và reset form
        this.closeContactModal();
        event.target.reset();

      } catch (error) {
        console.error('Contact submit error:', error);

        if (window.fastNotice) {
          window.fastNotice.show('Có lỗi xảy ra. Vui lòng thử lại.', 'error');
        } else {
          alert('Có lỗi xảy ra. Vui lòng thử lại.');
        }
      } finally {
        this.isLoading = false;
      }
    },

    // Xử lý chia sẻ dịch vụ
    async handleShare() {
      try {
        // Lấy thông tin từ DOM
        const serviceTitle = document.querySelector('.service-title')?.textContent?.trim() || 'Dịch vụ';
        const currentUrl = window.location.href;

        // Tạo text chia sẻ
        const shareText = `${serviceTitle} | Dịch vụ thành viên`;

        // Kiểm tra Web Share API có hỗ trợ không
        if (navigator.share) {
          await navigator.share({
            title: serviceTitle,
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

    // FAQ toggle methods
    toggleFaqItem(index) {
      if (this.openFaqItems.includes(index)) {
        this.openFaqItems = this.openFaqItems.filter(item => item !== index);
      } else {
        this.openFaqItems.push(index);
      }
    },

    isFaqItemOpen(index) {
      return this.openFaqItems.includes(index);
    },

    getFaqItemClasses(index) {
      const baseClasses = 'transition-all duration-300 ease-in-out';
      const openClasses = this.isFaqItemOpen(index)
        ? 'grid grid-rows-[1fr] opacity-100'
        : 'hidden';
      return baseClasses + ' ' + openClasses;
    },

    getFaqButtonClasses(index) {
      const baseClasses = 'w-full flex items-center justify-between p-4 text-left hover:bg-gray-50';
      return baseClasses;
    },

    getFaqIconClasses(index) {
      const baseClasses = 'lucide lucide-chevron-down w-5 h-5 transition-transform duration-300';
      const openClasses = this.isFaqItemOpen(index) ? 'rotate-180' : '';
      return baseClasses + ' ' + openClasses;
    },

  }));
});

// Export for use in HTML
window.serviceDetailComponent = serviceDetailComponent;