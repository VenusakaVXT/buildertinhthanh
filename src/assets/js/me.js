document.addEventListener('alpine:init', () => {
  Alpine.data('followButton', () => ({
    isFollowing: false,

    toggleFollow() {
      this.isFollowing = !this.isFollowing;
    },

    getButtonText() {
      return this.isFollowing ? 'Đang theo dõi' : 'Theo dõi';
    },

    getButtonIcon() {
      if (this.isFollowing) {
        return `
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            class="lucide lucide-user-check w-4 h-4 mr-2">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <polyline points="16,11 18,13 22,9"></polyline>
          </svg>
        `;
      } else {
        return `
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            class="lucide lucide-user-plus w-4 h-4 mr-2">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <line x1="19" x2="19" y1="8" y2="14"></line>
            <line x1="22" x2="16" y1="11" y2="11"></line>
          </svg>
        `;
      }
    },

    getButtonClasses() {
      const baseClasses = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-10 px-4 py-2";

      if (this.isFollowing) {
        return `${baseClasses} bg-primary text-primary-foreground hover:bg-primary/90`;
      } else {
        return `${baseClasses} bg-white text-gray-700 border border-gray-300 hover:bg-gray-50`;
      }
    }
  }));

  Alpine.data('likeButton', (initialCount = 0, initialLiked = false) => ({
    isLiked: initialLiked,
    count: initialCount,

    toggleLike() {
      this.isLiked = !this.isLiked;
      this.count = this.isLiked ? this.count + 1 : this.count - 1;
    },

    getButtonClasses() {
      const baseClasses = "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent h-9 rounded-md px-3";

      if (this.isLiked) {
        return `${baseClasses} text-red-600 hover:text-red-700 border-red-200`;
      } else {
        return `${baseClasses} text-gray-600 hover:text-red-600`;
      }
    },

    getSvgClasses() {
      const baseClasses = "lucide lucide-heart w-4 h-4 mr-2";
      return this.isLiked ? `${baseClasses} fill-current` : baseClasses;
    }
  }));

  Alpine.data('friendButton', () => ({
    isFriend: false,

    toggleFriend() {
      this.isFriend = !this.isFriend;
    },

    getButtonText() {
      return this.isFriend ? 'Đã kết bạn' : 'Kết bạn';
    },

    getButtonClasses() {
      const baseClasses = "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3 text-xs";

      if (this.isFriend) {
        return `${baseClasses} bg-primary text-primary-foreground hover:bg-primary/90 border-primary`;
      } else {
        return baseClasses;
      }
    }
  }));

  Alpine.data('gallery', () => ({
    isOpen: false,
    images: [],
    currentIndex: 0,
    postTitle: '',

    // mở album chung
    openModal(el, index) {
      this.images = [...this.$refs.albumGrid.querySelectorAll("img")].map(img => ({
        src: img.getAttribute("src"),
        alt: img.getAttribute("alt")
      }))
      this.currentIndex = index
      this.isOpen = true
    },

    // mở gallery riêng trong post
    openPostGallery(el, index) {
      const galleryRoot = el.closest(".post-gallery")
      const post = galleryRoot.closest(".rounded-lg.border")

      // Tìm tiêu đề trong post (có thể là tên người đăng hoặc tiêu đề bài viết)
      const titleElement = post.querySelector("h3.font-semibold")
      this.postTitle = titleElement ? `Ảnh của ${titleElement.textContent.trim()}` : 'Ảnh'

      this.images = [...galleryRoot.querySelectorAll("img")].map(img => ({
        src: img.getAttribute("src"),
        alt: img.getAttribute("alt")
      }))

      this.currentIndex = index
      this.isOpen = true
    },

    closeModal() {
      this.isOpen = false
    },

    next() {
      this.currentIndex = (this.currentIndex + 1) % this.images.length
    },

    prev() {
      this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length
    },

    setIndex(index) {
      this.currentIndex = index
    },

    async handleDownload() {
      if (!this.images || this.images.length === 0) {
        console.warn('No images available to download');
        return;
      }

      const currentImage = this.images[this.currentIndex];
      if (!currentImage || !currentImage.src) {
        console.warn('Current image not found');
        return;
      }

      try {
        console.log('Starting download for:', currentImage.src);

        // Tạo tên file từ URL hoặc tạo tên mặc định
        let filename = 'image.jpg';
        try {
          const url = new URL(currentImage.src);
          const pathname = url.pathname;
          const urlFilename = pathname.split('/').pop() || 'image';

          // Nếu không có extension, thêm .jpg
          const hasExtension = urlFilename.includes('.');
          filename = hasExtension ? urlFilename : `${urlFilename}.jpg`;
        } catch (urlError) {
          console.warn('Error parsing URL, using default filename:', urlError);
        }

        // Thử tải ảnh bằng fetch để xử lý CORS
        try {
          const response = await fetch(currentImage.src);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);

          // Tạo link download
          const link = document.createElement('a');
          link.href = url;
          link.download = filename;
          link.style.display = 'none';

          // Thêm vào DOM, click và xóa
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          // Giải phóng URL object
          window.URL.revokeObjectURL(url);

          console.log(`Successfully downloaded: ${filename}`);
        } catch (fetchError) {
          console.warn('Fetch failed, trying direct download:', fetchError);

          // Fallback: thử tải trực tiếp
          const link = document.createElement('a');
          link.href = currentImage.src;
          link.download = filename;
          link.target = '_blank';
          link.style.display = 'none';

          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          console.log(`Direct download attempted: ${filename}`);
        }
      } catch (error) {
        console.error('Error downloading image:', error);

        // Fallback cuối cùng: mở ảnh trong tab mới
        window.open(currentImage.src, '_blank');
      }
    },
  }))

  Alpine.data('coverModal', () => ({
    openAvatarModal(event) {
      // Lấy ảnh từ thuộc tính src của thẻ img được click
      const imageSrc = event.target.src || event.target.getAttribute('src');

      // Cập nhật ảnh trong modal
      const avatarImg = document.getElementById('avatarImage');
      if (avatarImg) {
        avatarImg.src = imageSrc;
      }

      // Mở modal bằng jModal
      jModal.open('avatarModal');
    },

    openCoverModal(event) {
      // Lấy ảnh từ thuộc tính src của thẻ img được click
      const imageSrc = event.target.src || event.target.getAttribute('src');

      // Cập nhật ảnh trong modal
      const coverImg = document.getElementById('coverImage');
      if (coverImg) {
        coverImg.src = imageSrc;
      }

      // Mở modal bằng jModal
      jModal.open('coverModal');
    },

    // Hàm chung để download ảnh
    async downloadImage(imageUrl, defaultFilename) {
      try {
        let filename = defaultFilename;
        try {
          const url = new URL(imageUrl);
          const pathname = url.pathname;
          const urlFilename = pathname.split('/').pop() || defaultFilename.replace('.jpg', '');

          const hasExtension = urlFilename.includes('.');
          filename = hasExtension ? urlFilename : `${urlFilename}.jpg`;
        } catch (urlError) {
          console.warn('Error parsing URL, using default filename:', urlError);
        }

        try {
          const response = await fetch(imageUrl);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);

          const link = document.createElement('a');
          link.href = url;
          link.download = filename;
          link.style.display = 'none';

          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          window.URL.revokeObjectURL(url);

          console.log(`Successfully downloaded: ${filename}`);
        } catch (fetchError) {
          console.warn('Fetch failed, trying direct download:', fetchError);

          const link = document.createElement('a');
          link.href = imageUrl;
          link.download = filename;
          link.target = '_blank';
          link.style.display = 'none';

          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          console.log(`Direct download attempted: ${filename}`);
        }
      } catch (error) {
        console.error('Error downloading image:', error);
        window.open(imageUrl, '_blank');
      }
    },

    // Download ảnh đại diện
    async downloadAvatar() {
      const avatarImg = document.getElementById('avatarImage');
      if (avatarImg && avatarImg.src) {
        await this.downloadImage(avatarImg.src, 'avatar.jpg');
      }
    },

    // Download ảnh bìa
    async downloadCover() {
      const coverImg = document.getElementById('coverImage');
      if (coverImg && coverImg.src) {
        await this.downloadImage(coverImg.src, 'cover.jpg');
      }
    },
  }))

  // Khởi tạo jModal cho modal ảnh
  document.addEventListener('DOMContentLoaded', function () {
    // Khởi tạo modal ảnh đại diện
    jModal.init('#avatarModal', {
      closeOnBackdrop: true,
      closeOnEscape: true,
      preventScroll: true
    });

    // Khởi tạo modal ảnh bìa
    jModal.init('#coverModal', {
      closeOnBackdrop: true,
      closeOnEscape: true,
      preventScroll: true
    });
  });
});