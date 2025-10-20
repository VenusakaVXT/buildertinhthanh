document.addEventListener('alpine:init', () => {
  Alpine.data('postNews', () => ({
    init() {
      this.handleAddTags();
      this.handleValidatePublishDate();
      this.enableSubmitButton();
    },

    // Handle add tags
    handleAddTags() {
      const tagInput = document.getElementById('tag-input');
      const addTagBtn = document.getElementById('add-tag-btn');
      const tagsContainer = document.getElementById('tags-container');

      if (!tagInput || !addTagBtn || !tagsContainer) return;

      // Add tag function
      const addTag = () => {
        const tagText = tagInput.value.trim();
        if (tagText === '') return;

        // Check if tag already exists
        const existingTags = Array.from(tagsContainer.querySelectorAll('.tag-item')).map(tag =>
          tag.querySelector('.tag-text').textContent.trim()
        );

        if (existingTags.includes(tagText)) {
          return;
        }

        // Create tag element
        const tagElement = document.createElement('div');
        tagElement.className = 'tag-item inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium';
        tagElement.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-tag">
            <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.586 8.586a2 2 0 0 0 2.828 0l7.172-7.172a2 2 0 0 0 0-2.828L12.586 2.586Z"></path>
            <path d="M7 7h.01"></path>
          </svg>
          <span class="tag-text">${tagText}</span>
          <button type="button" class="tag-remove-btn ml-1 hover:bg-gray-200 rounded-full p-0.5 transition-colors" data-tag="${tagText}">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x">
              <path d="M18 6 6 18"></path>
              <path d="M6 6l12 12"></path>
            </svg>
          </button>
        `;

        // Add to container
        tagsContainer.appendChild(tagElement);

        // Clear input
        tagInput.value = '';

        // Add remove functionality
        const removeBtn = tagElement.querySelector('.tag-remove-btn');
        removeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          tagElement.remove();
        });
      };

      // Add tag on button click
      addTagBtn.addEventListener('click', addTag);

      // Add tag on Enter key press
      tagInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          addTag();
        }
      });
    },

    // Publish date validation
    handleValidatePublishDate() {
      const publishDateInput = document.getElementById('publishDate');
      const publishDateMessage = document.getElementById('publish-date-message');

      if (!publishDateInput || !publishDateMessage) return;

      const validatePublishDate = () => {
        const selectedDate = publishDateInput.value;

        if (!selectedDate) {
          // Empty input - show default message
          publishDateMessage.textContent = 'Để trống để đăng ngay lập tức';
          publishDateMessage.className = 'text-sm text-gray-500';
          return;
        }

        const selectedDateTime = new Date(selectedDate);
        const currentDateTime = new Date();

        if (selectedDateTime <= currentDateTime) {
          // Past time - show error message
          publishDateMessage.textContent = 'Thời gian đăng phải lớn hơn thời gian hiện tại';
          publishDateMessage.className = 'text-sm text-red-500';
        } else {
          // Future time - show success message
          const timeDiff = selectedDateTime - currentDateTime;
          const hours = Math.floor(timeDiff / (1000 * 60 * 60));
          const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

          let timeText = '';
          if (hours > 0) {
            timeText = `${hours} giờ ${minutes} phút`;
          } else if (minutes > 0) {
            timeText = `${minutes} phút`;
          } else {
            timeText = `${seconds} giây`;
          }

          publishDateMessage.textContent = `Sẽ đăng sau ${timeText}`;
          publishDateMessage.className = 'text-sm text-green-500';
        }
      };

      // Validate on input change
      publishDateInput.addEventListener('input', validatePublishDate);

      // Validate on focus out
      publishDateInput.addEventListener('blur', validatePublishDate);
    },

    // News post validation (Title, Summary, Content, Featured Image required)
    enableSubmitButton() {
      const titleInput = document.getElementById('news-title');
      const summaryTextarea = document.getElementById('news-summary');
      const contentTextarea = document.getElementById('news-content');
      const featuredImageInput = document.getElementById('news-featured-image');
      const submitBtn = document.getElementById('news-submit-btn');

      if (!titleInput || !summaryTextarea || !contentTextarea || !featuredImageInput || !submitBtn) return;

      const validateNewsPost = () => {
        const hasTitle = titleInput.value.trim().length > 0;
        const hasSummary = summaryTextarea.value.trim().length > 0;
        const hasContent = contentTextarea.value.trim().length > 0;
        const hasFeaturedImage = featuredImageInput.files && featuredImageInput.files.length > 0;

        // Enable submit button if all required fields are filled
        if (hasTitle && hasSummary && hasContent && hasFeaturedImage) {
          submitBtn.disabled = false;
          submitBtn.classList.remove('disabled:pointer-events-none', 'disabled:opacity-50');
        } else {
          submitBtn.disabled = true;
          submitBtn.classList.add('disabled:pointer-events-none', 'disabled:opacity-50');
        }
      };

      // Validate on input change
      titleInput.addEventListener('input', validateNewsPost);
      titleInput.addEventListener('blur', validateNewsPost);

      summaryTextarea.addEventListener('input', validateNewsPost);
      summaryTextarea.addEventListener('blur', validateNewsPost);

      contentTextarea.addEventListener('input', validateNewsPost);
      contentTextarea.addEventListener('blur', validateNewsPost);

      // Validate on image upload/change
      featuredImageInput.addEventListener('change', validateNewsPost);

      // Initial validation
      validateNewsPost();
    },
  }));
});