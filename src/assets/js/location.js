document.addEventListener('alpine:init', () => {
  Alpine.data('communesList', () => ({
    showAllCommunes: false,

    init() {
      this.updateCommuneDisplay();
    },

    updateCommuneDisplay() {
      // Chỉ target các card xã/phường trong section cụ thể
      // Tìm section chứa "Danh Sách Các Xã/Phường" và chỉ target các card trong đó
      const sections = document.querySelectorAll('section');
      let communeSection = null;

      sections.forEach(section => {
        const heading = section.querySelector('h2');
        if (heading && heading.textContent.includes('Danh Sách Các Xã/Phường')) {
          communeSection = section;
        }
      });

      if (!communeSection) return;

      // Chỉ target các card trong section xã/phường
      const allCommuneCards = communeSection.querySelectorAll('.rounded-lg.border.bg-card');

      allCommuneCards.forEach(card => {
        if (this.showAllCommunes) {
          // Hiển thị tất cả xã
          card.style.display = 'block';
        } else {
          // Chỉ hiển thị 12 xã đầu tiên
          if (card.hasAttribute('data-first-12')) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        }
      });
    },

    toggleCommunes() {
      this.showAllCommunes = !this.showAllCommunes;
      this.updateCommuneDisplay();
    },

    getCommunesButtonText() {
      return this.showAllCommunes ? 'Thu Gọn' : 'Xem Tất Cả 95 Xã/Phường';
    },

    getCommunesButtonIconClass() {
      return this.showAllCommunes ? 'lucide lucide-arrow-right w-4 h-4 ml-2 transition-transform rotate-90' : 'lucide lucide-arrow-right w-4 h-4 ml-2 transition-transform';
    },
  }))
})