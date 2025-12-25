document.addEventListener('alpine:init', () => {
  Alpine.data('searchNewsComponent', () => ({
    keyword: '',

    // Date range variables
    dateFrom: '',
    dateTo: '',
    dateError: '',
    // Error messages
    dateErrors: {
      startDateFuture: 'Ngày bắt đầu không được lớn hơn ngày hiện tại',
      endDateFuture: 'Ngày kết thúc không được lớn hơn ngày hiện tại',
      endBeforeStart: 'Ngày kết thúc không được nhỏ hơn ngày bắt đầu'
    },

    init() {

    },

    clearKeyword() {
      this.keyword = '';
    },

    validateDateRange() {
      // Clear previous error first
      this.dateError = '';

      // Get current date in Vietnam timezone (UTC+7)
      const now = new Date();
      const vietnamOffset = 7 * 60; // Vietnam is UTC+7
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
      const vietnamTime = new Date(utc + (vietnamOffset * 60000));

      // Get today's date in Vietnam timezone
      const today = new Date(vietnamTime.getFullYear(), vietnamTime.getMonth(), vietnamTime.getDate());

      // Get tomorrow's date (24 hours from now)
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Check if dateFrom is provided and valid
      if (this.dateFrom) {
        const fromDate = new Date(this.dateFrom);
        if (fromDate >= tomorrow) {
          this.dateError = this.dateErrors.startDateFuture;
          return false;
        }
      }

      // Check if dateTo is provided and valid
      if (this.dateTo) {
        const toDate = new Date(this.dateTo);
        if (toDate >= tomorrow) {
          this.dateError = this.dateErrors.endDateFuture;
          return false;
        }
      }

      // Check if both dates are provided and dateTo is not before dateFrom
      if (this.dateFrom && this.dateTo) {
        const fromDate = new Date(this.dateFrom);
        const toDate = new Date(this.dateTo);

        if (toDate < fromDate) {
          this.dateError = this.dateErrors.endBeforeStart;
          return false;
        }
      }

      // If all validations pass, clear any existing error
      this.dateError = '';
      return true;
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