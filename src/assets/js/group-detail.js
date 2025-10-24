// Group Detail Alpine.js Components
document.addEventListener('alpine:init', () => {

    // ===========================================
    // GALLERY COMPONENT FOR POST IMAGES
    // ===========================================
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
            const titleElement = post.querySelector("h3.font-semibold") || post.querySelector(".font-medium")
            this.postTitle = titleElement ? `Ảnh của ${titleElement.textContent.trim()}` : 'Ảnh'

            // Lấy tất cả ảnh từ gallery (bao gồm cả ảnh ẩn)
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
                    console.error('Error parsing URL, using default filename:', urlError);
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
                } catch (fetchError) {
                    // Fallback: thử tải trực tiếp
                    const link = document.createElement('a');
                    link.href = currentImage.src;
                    link.download = filename;
                    link.target = '_blank';
                    link.style.display = 'none';

                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            } catch (error) {
                console.error('Error downloading image:', error);
                // Fallback cuối cùng: mở ảnh trong tab mới
                window.open(currentImage.src, '_blank');
            }
        },
    }));
});
