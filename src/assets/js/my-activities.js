// Alpine.js logic for tab switching functionality
document.addEventListener('alpine:init', () => {
  // Alpine.js logic for review toggle functionality
  Alpine.data('reviewToggle', () => ({
    showReview: false,

    toggleReview() {
      this.showReview = !this.showReview;
    },

    getButtonText() {
      return this.showReview ? 'Ẩn đánh giá' : 'Xem đánh giá';
    },

    getButtonClasses() {
      const baseClasses = "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-9 rounded-md px-3";
      const primaryClasses = "bg-primary text-primary-foreground hover:bg-primary/90 btn-primary";
      return `${baseClasses} ${primaryClasses}`;
    },

    getChevronClasses() {
      const baseClasses = "lucide h-4 w-4 mr-2";
      return baseClasses;
    },

    getChevronIcon() {
      return this.showReview ? 'lucide-chevron-up' : 'lucide-chevron-down';
    },

    getReviewClasses() {
      return "mt-2 animate-in slide-in-from-top-2 duration-300";
    }
  }));
});