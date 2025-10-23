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
    }));
});
