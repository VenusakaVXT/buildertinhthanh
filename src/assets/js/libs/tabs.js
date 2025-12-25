/**
 * TABS.JS - Tab Management System
 * Hệ thống quản lý tab bằng JavaScript thuần
 */

class TabManager {
    constructor() {
        this.tabs = [];
        this.init();
    }

    /**
     * Khởi tạo tất cả tab systems trên trang
     */
    init() {
        // Tìm tất cả các tab containers
        const tabContainers = document.querySelectorAll('.tabs');

        tabContainers.forEach((container, index) => {
            this.initTabContainer(container, index);
        });

        // Kiểm tra overflow cho tabs-menus
        this.checkTabsMenusOverflow();

        // Kiểm tra lại khi resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.checkTabsMenusOverflow();
            }, 100);
        });
    }

    /**
     * Khởi tạo một tab container
     * @param {HTMLElement} container - Tab container element
     * @param {number} index - Index của container
     */
    initTabContainer(container, index) {
        const tabMenus = container.querySelectorAll('.tab-menu');
        const tabContents = container.querySelectorAll('.tab-content');

        if (tabMenus.length === 0 || tabContents.length === 0) {
            console.warn(`Tab container ${index} không có tab-menu hoặc tab-content`);
            return;
        }

        // Lưu thông tin tab system
        const tabSystem = {
            container,
            menus: tabMenus,
            contents: tabContents,
            activeTab: 'all' // Default active tab
        };

        this.tabs.push(tabSystem);

        // Gán event listeners cho các tab menu
        tabMenus.forEach((menu) => {
            const tabName = menu.getAttribute('data-tab');
            if (!tabName) {
                console.warn('Tab menu không có data-tab attribute');
                return;
            }

            menu.addEventListener('click', (e) => {
                e.preventDefault();
                this.switchTabByName(tabSystem, tabName);
            });
        });

        // Đảm bảo tab đầu tiên active
        this.ensureFirstTabActive(tabSystem);
    }

    /**
     * Đảm bảo tab đầu tiên được active
     * @param {Object} tabSystem - Tab system object
     */
    ensureFirstTabActive(tabSystem) {
        const { menus, contents } = tabSystem;

        // Tìm tab đã có class active
        let activeMenu = null;
        let activeContent = null;

        // Tìm menu active
        menus.forEach(menu => {
            if (menu.classList.contains('active')) {
                activeMenu = menu;
                tabSystem.activeTab = menu.getAttribute('data-tab');
            }
        });

        // Tìm content active
        contents.forEach(content => {
            if (content.classList.contains('active')) {
                activeContent = content;
            }
        });

        // Nếu không có tab nào active, active tab đầu tiên
        if (!activeMenu && menus.length > 0) {
            activeMenu = menus[0];
            activeMenu.classList.add('active');
            tabSystem.activeTab = activeMenu.getAttribute('data-tab');
        }

        if (!activeContent && contents.length > 0) {
            // Tìm content tương ứng với active menu
            const activeTabName = tabSystem.activeTab;
            contents.forEach(content => {
                if (content.getAttribute('data-tab-content') === activeTabName) {
                    content.classList.add('active');
                }
            });
        }
    }

    /**
     * Chuyển đổi tab theo tên
     * @param {Object} tabSystem - Tab system object
     * @param {string} tabName - Tên của tab cần chuyển đến
     */
    switchTabByName(tabSystem, tabName) {
        const { menus, contents, activeTab } = tabSystem;

        // Nếu đã active thì không làm gì
        if (tabName === activeTab) {
            return;
        }

        // Tìm menu và content tương ứng
        const targetMenu = Array.from(menus).find(menu => menu.getAttribute('data-tab') === tabName);
        const targetContent = Array.from(contents).find(content => content.getAttribute('data-tab-content') === tabName);

        if (!targetMenu || !targetContent) {
            console.warn(`Tab "${tabName}" không tồn tại`);
            return;
        }

        // Remove active class từ tất cả menus và contents
        menus.forEach(menu => menu.classList.remove('active'));
        contents.forEach(content => content.classList.remove('active'));

        // Add active class cho tab mới
        targetMenu.classList.add('active');
        targetContent.classList.add('active');

        // Cập nhật active tab
        tabSystem.activeTab = tabName;

        // Dispatch custom event
        this.dispatchTabChangeEvent(tabSystem, tabName);
    }

    /**
     * Dispatch custom event khi tab thay đổi
     * @param {Object} tabSystem - Tab system object
     * @param {string} newTabName - Tên của tab mới
     */
    dispatchTabChangeEvent(tabSystem, newTabName) {
        const event = new CustomEvent('tabChanged', {
            detail: {
                container: tabSystem.container,
                newTabName,
                previousTabName: tabSystem.activeTab,
                menu: Array.from(tabSystem.menus).find(menu => menu.getAttribute('data-tab') === newTabName),
                content: Array.from(tabSystem.contents).find(content => content.getAttribute('data-tab-content') === newTabName)
            }
        });

        tabSystem.container.dispatchEvent(event);
    }

    /**
     * Lấy tab system theo container
     * @param {HTMLElement} container - Tab container element
     * @returns {Object|null} Tab system object hoặc null
     */
    getTabSystem(container) {
        return this.tabs.find(tab => tab.container === container);
    }

    /**
     * Chuyển đến tab theo tên trong container cụ thể
     * @param {HTMLElement} container - Tab container element
     * @param {string} tabName - Tab name
     */
    switchTabInContainer(container, tabName) {
        const tabSystem = this.getTabSystem(container);
        if (tabSystem) {
            this.switchTabByName(tabSystem, tabName);
        }
    }

    /**
     * Lấy tab hiện tại active trong container
     * @param {HTMLElement} container - Tab container element
     * @returns {string} Active tab name
     */
    getActiveTabName(container) {
        const tabSystem = this.getTabSystem(container);
        return tabSystem ? tabSystem.activeTab : null;
    }

    /**
     * Kiểm tra overflow cho các tabs-menus và thêm class has-overflow khi cần
     */
    checkTabsMenusOverflow() {
        const tabsMenus = document.querySelectorAll('.tabs.tabs-button .tabs-menus');

        tabsMenus.forEach(menu => {
            // Chỉ kiểm tra trên desktop (lg breakpoint)
            if (window.innerWidth >= 1024) {
                const hasOverflow = menu.scrollWidth > menu.clientWidth;

                if (hasOverflow) {
                    menu.classList.add('has-overflow');
                } else {
                    menu.classList.remove('has-overflow');
                }
            } else {
                menu.classList.remove('has-overflow');
            }
        });
    }
}

// Khởi tạo TabManager khi DOM ready
document.addEventListener('DOMContentLoaded', function () {
    // Tạo global instance
    window.tabManager = new TabManager();

    console.log('TabManager initialized');
});

// Export cho module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TabManager;
}
