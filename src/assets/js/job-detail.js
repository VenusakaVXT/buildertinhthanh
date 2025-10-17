// Job Detail Alpine.js Component
// Xử lý logic ứng tuyển việc làm và modal

document.addEventListener('alpine:init', () => {
  // ===========================================
  // JOB DETAIL COMPONENT
  // ===========================================
  Alpine.data('jobDetailComponent', () => ({
    //user: null,
    isLoading: false,
    errors: {},
    isJobSaved: false,

    init() {
      // Yêu cầu user data từ header
      //window.dispatchEvent(new CustomEvent('get-user-data'));

      // Lắng nghe user data từ header
      // window.addEventListener('user-data-ready', (event) => {
      //   this.user = event.detail.user;
      //   console.log('Job Detail received user data:', this.user);
      // });

      // Khởi tạo jModal cho apply modal
      this.$nextTick(() => {
        if (window.jModal) {
          window.jModal.init('#applyJobModal');
        }
      });
    },

    // Xử lý click nút "Ứng tuyển ngay"
    handleApplyClick() {
      this.openApplyModal();
      // if (this.user) {
      //   // User đã đăng nhập -> mở modal ứng tuyển
      //   this.openApplyModal();
      // } else {
      //   // User chưa đăng nhập -> hiển thị alert
      //   this.showLoginAlert();
      // }
    },

    // Mở modal ứng tuyển
    openApplyModal() {
      if (window.jModal) {
        window.jModal.open('applyJobModal');
      } else {
        // Fallback nếu jModal không có
        const modal = document.getElementById('applyJobModal');
        if (modal) {
          modal.classList.remove('hidden');
        }
      }
    },

    // Hiển thị alert yêu cầu đăng nhập
    showLoginAlert() {
      if (window.fastNotice) {
        window.fastNotice.show('Vui lòng đăng nhập để ứng tuyển vị trí này!!!', 'warning', {
          duration: 4000,
          position: 'top-center'
        });
      } else {
        // Fallback nếu FastNotice không có
        alert('Vui lòng đăng nhập để ứng tuyển vị trí này!!!');
      }
    },

    // Xử lý submit form ứng tuyển (chỉ validation, không gửi API)
    handleApplySubmit(event) {
      event.preventDefault();
      this.isLoading = true;
      this.errors = {};

      // Lấy dữ liệu form
      const formData = new FormData(event.target);
      const fullName = formData.get('fullName')?.trim();
      const phone = formData.get('phone')?.trim();
      const email = formData.get('email')?.trim();

      // Validation
      let hasErrors = false;

      if (!fullName) {
        this.errors.fullName = 'Vui lòng nhập họ và tên';
        hasErrors = true;
      } else if (fullName.length < 2) {
        this.errors.fullName = 'Họ và tên phải có ít nhất 2 ký tự';
        hasErrors = true;
      }

      if (!phone) {
        this.errors.phone = 'Vui lòng nhập số điện thoại';
        hasErrors = true;
      } else if (!/^[0-9]{10,11}$/.test(phone.replace(/\s/g, ''))) {
        this.errors.phone = 'Số điện thoại không hợp lệ (10-11 số)';
        hasErrors = true;
      }

      if (!email) {
        this.errors.email = 'Vui lòng nhập email';
        hasErrors = true;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        this.errors.email = 'Email không hợp lệ';
        hasErrors = true;
      }

      if (hasErrors) {
        this.isLoading = false;
        return;
      }

      // Nếu validation thành công, hiển thị thông báo thành công
      setTimeout(() => {
        if (window.fastNotice) {
          window.fastNotice.show('Gửi hồ sơ thành công!', 'success');
        } else {
          alert('Gửi hồ sơ thành công!');
        }

        // Đóng modal và reset form
        this.closeApplyModal();
        event.target.reset();
        this.isLoading = false;
      }, 1000);
    },

    // Đóng modal ứng tuyển
    closeApplyModal() {
      if (window.jModal) {
        window.jModal.close('applyJobModal');
      } else {
        const modal = document.getElementById('applyJobModal');
        if (modal) {
          modal.classList.add('hidden');
        }
      }
    },

    // Xử lý lưu việc làm (toggle trạng thái)
    handleSaveJob() {
      // Check user login
      // if (!this.user) {
      //   this.showLoginAlert();
      // }

      // Toggle trạng thái lưu việc
      this.isJobSaved = !this.isJobSaved;

      // Hiển thị thông báo
      if (this.isJobSaved) {
        if (window.fastNotice) {
          window.fastNotice.show('Đã lưu việc làm thành công!', 'success');
        } else {
          alert('Đã lưu việc làm thành công!');
        }
      } else {
        if (window.fastNotice) {
          window.fastNotice.show('Đã bỏ lưu việc làm!', 'info');
        } else {
          alert('Đã bỏ lưu việc làm!');
        }
      }
    },

    // Xử lý chia sẻ việc làm
    async handleShare() {
      try {
        // Lấy thông tin từ DOM
        const jobTitle = document.querySelector('.job-title')?.textContent?.trim() || 'Việc làm';
        const jobCompany = document.querySelector('.job-company')?.textContent?.trim() || 'Công ty';
        const currentUrl = window.location.href;

        // Tạo text chia sẻ
        const shareText = `${jobTitle} tại ${jobCompany}`;

        // Kiểm tra Web Share API có hỗ trợ không
        if (navigator.share) {
          await navigator.share({
            title: jobTitle,
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

    // Format salary
    formatSalary(min, max) {
      if (min && max) {
        return `${min.toLocaleString()} - ${max.toLocaleString()} VNĐ`;
      } else if (min) {
        return `Từ ${min.toLocaleString()} VNĐ`;
      } else if (max) {
        return `Đến ${max.toLocaleString()} VNĐ`;
      }
      return 'Thỏa thuận';
    },

    // Format date
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
  }));
});

// Export for use in HTML
window.jobDetailComponent = jobDetailComponent;