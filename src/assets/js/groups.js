// Groups Alpine.js Components
// Chứa logic tìm kiếm cho trang groups

document.addEventListener('alpine:init', () => {

    // ===========================================
    // SEARCH COMPONENT
    // ===========================================
    Alpine.data('searchComponent', () => ({
        searchKeyword: '',
        isLoading: false,

        init() {
            // Lấy keyword từ URL ngay lập tức để tránh flash
            this.searchKeyword = this.getUrlKeyword();

            // Khởi tạo Lucide icons
            this.$nextTick(() => {
                lucide.createIcons();
            });
        },

        getUrlKeyword() {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get('keyword') || '';
        },

        handleSearch() {
            if (this.isLoading) return;

            const keyword = this.searchKeyword.trim();

            // Lấy URL hiện tại và thêm param keyword
            const currentUrl = new URL(window.location.href);

            if (keyword) {
                currentUrl.searchParams.set('keyword', keyword);
            } else {
                currentUrl.searchParams.delete('keyword');
            }

            // Chuyển hướng đến URL mới
            window.location.href = currentUrl.toString();
        },

        handleKeyPress(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                this.handleSearch();
            }
        }
    }));
});
