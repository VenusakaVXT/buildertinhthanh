// News Detail Alpine.js Component
// Xử lý logic cho trang chi tiết tin tức

document.addEventListener('alpine:init', () => {
  // ===========================================
  // NEWS DETAIL COMPONENT
  // ===========================================
  Alpine.data('newsDetailComponent', () => ({
    init() {
      console.log('News detail component initialized');
    },

    // Xử lý chia sẻ Facebook
    shareFacebook() {
      const currentUrl = encodeURIComponent(window.location.href);
      const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`;
      window.open(shareUrl, '_blank', 'width=600,height=400');
    },

    // Xử lý chia sẻ Twitter
    shareTwitter() {
      const currentUrl = encodeURIComponent(window.location.href);
      const title = document.querySelector('news-title')?.textContent?.trim() || 'Tin tức';
      const text = encodeURIComponent(title);
      const shareUrl = `https://twitter.com/intent/tweet?url=${currentUrl}&text=${text}`;
      window.open(shareUrl, '_blank', 'width=600,height=400');
    },

    // Xử lý chia sẻ LinkedIn
    shareLinkedIn() {
      const currentUrl = encodeURIComponent(window.location.href);
      const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${currentUrl}`;
      window.open(shareUrl, '_blank', 'width=600,height=400');
    },

    // Xử lý copy URL
    async copyUrl() {
      try {
        await navigator.clipboard.writeText(window.location.href);

        if (window.fastNotice) {
          window.fastNotice.show('Đã copy link vào clipboard!', 'success');
        } else {
          alert('Đã copy link vào clipboard!');
        }
      } catch (error) {
        console.error('Copy error:', error);

        // Fallback: sử dụng phương pháp cũ
        const textArea = document.createElement('textarea');
        textArea.value = window.location.href;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);

        if (window.fastNotice) {
          window.fastNotice.show('Đã copy link vào clipboard!', 'success');
        } else {
          alert('Đã copy link vào clipboard!');
        }
      }
    }
  }));
});

// Export for use in HTML
window.newsDetailComponent = newsDetailComponent;