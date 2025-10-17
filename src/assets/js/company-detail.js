document.addEventListener("alpine:init", () => {
    Alpine.data("tabNavigation", () => ({
        activeTab: "overview",

        scrollToSection(sectionId) {
            this.activeTab = sectionId;
            // Update global state if it exists
            if (window.tabNavigation) {
                window.tabNavigation.activeTab = sectionId;
            }
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        },

        isActive(sectionId) {
            return this.activeTab === sectionId;
        }
    }));

    // Follow button
    Alpine.data("followButton", () => ({
        isFollowing: false, // Default state: not following

        // Method to toggle follow state
        toggleFollow() {
            this.isFollowing = !this.isFollowing;
        },

        // Method to get button text based on state
        getButtonText() {
            return this.isFollowing ? "Đang theo dõi" : "Theo dõi";
        },

        // Method to get button icon based on state
        getButtonIcon() {
            if (this.isFollowing) {
                // Following state: user-check icon
                return `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              class="lucide lucide-user-check w-3 h-3 sm:w-4 sm:h-4 mr-1">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <polyline points="16,11 18,13 22,9"></polyline>
            </svg>
          `;
            } else {
                // Not following state: user-plus icon
                return `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              class="lucide lucide-user-plus w-3 h-3 sm:w-4 sm:h-4 mr-1">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <line x1="19" x2="19" y1="8" y2="14"></line>
              <line x1="22" x2="16" y1="11" y2="11"></line>
            </svg>
          `;
            }
        },

        // Method to get button classes based on state
        getButtonClasses() {
            const baseClasses = "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-9 rounded-md px-3 text-xs sm:text-sm";

            if (this.isFollowing) {
                // Following state: blue background, white text
                return `${baseClasses} bg-primary text-primary-foreground hover:bg-primary/90`;
            } else {
                // Not following state: white background, dark text
                return `${baseClasses} border border-input bg-background hover:bg-accent hover:text-accent-foreground`;
            }
        },
    }));

    // Cover component
    Alpine.data("shareButton", () => ({
        // Xử lý chia sẻ doanh nghiệp
        async handleShare() {
            try {
                const currentUrl = window.location.href;

                // Kiểm tra Web Share API có hỗ trợ không
                if (navigator.share) {
                    await navigator.share({
                        title: "Chi tiết Doanh nghiệp",
                        text: "Chi tiết Doanh nghiệp",
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
    }));

    // Alpine.js component for services list toggle
    Alpine.data("servicesToggle", () => ({
        showAll: false,

        toggleServices() {
            this.showAll = !this.showAll;
        },

        getButtonText() {
            return this.showAll ? "Thu gọn" : "Xem tất cả dịch vụ";
        },

        getButtonIcon() {
            return this.showAll ? "chevron-up" : "chevron-down";
        }
    }));

    // Alpine.js component for jobs list toggle
    Alpine.data("jobsToggle", () => ({
        showAll: false,

        toggleJobs() {
            this.showAll = !this.showAll;
        },

        getButtonText() {
            return this.showAll ? "Thu gọn" : "Xem tất cả việc làm";
        },

        getButtonIcon() {
            return this.showAll ? "chevron-up" : "chevron-down";
        }
    }));

    // Alpine.js component for news list toggle
    Alpine.data("newsToggle", () => ({
        showAll: false,

        toggleNews() {
            this.showAll = !this.showAll;
        },

        getButtonText() {
            return this.showAll ? "Thu gọn" : "Xem tất cả tin tức";
        },

        getButtonIcon() {
            return this.showAll ? "chevron-up" : "chevron-down";
        }
    }));

    // Alpine.js component for employee benefits toggle
    Alpine.data("benefitsToggle", () => ({
        salaryOpen: false,
        insuranceOpen: false,
        otherOpen: false,
        trainingOpen: false,

        toggleSalary() {
            this.salaryOpen = !this.salaryOpen;
        },

        toggleInsurance() {
            this.insuranceOpen = !this.insuranceOpen;
        },

        toggleOther() {
            this.otherOpen = !this.otherOpen;
        },

        toggleTraining() {
            this.trainingOpen = !this.trainingOpen;
        }
    }));
});