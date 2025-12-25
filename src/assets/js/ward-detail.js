document.addEventListener('alpine:init', () => {
  Alpine.data('tabNavigation', () => ({
    activeTab: 'gioi-thieu',

    scrollToSection(sectionId) {
      this.activeTab = sectionId;
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    },

    isActive(sectionId) {
      return this.activeTab === sectionId;
    }
  }));

  Alpine.data('mobileTableOfContents', () => ({
    isOpen: false,

    open() {
      this.isOpen = true;
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    },

    close() {
      this.isOpen = false;
      // Restore body scroll
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