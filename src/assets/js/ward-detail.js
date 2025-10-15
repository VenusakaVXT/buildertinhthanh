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
});