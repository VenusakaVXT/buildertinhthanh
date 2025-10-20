document.addEventListener('alpine:init', () => {
  Alpine.data('postStatus', () => ({
    init() {
      this.enableSubmitButton();
    },

    // Status post validation (Content or Image required)
    enableSubmitButton() {
      const contentTextarea = document.getElementById('content');
      const imageUpload = document.getElementById('status-image-upload');
      const submitBtn = document.getElementById('status-submit-btn');

      if (!contentTextarea || !imageUpload || !submitBtn) return;

      const validateStatusPost = () => {
        const hasContent = contentTextarea.value.trim().length > 0;
        const hasImages = imageUpload.files && imageUpload.files.length > 0;

        // Enable submit button if there's content OR images
        if (hasContent || hasImages) {
          submitBtn.disabled = false;
          submitBtn.classList.remove('disabled:pointer-events-none', 'disabled:opacity-50');
        } else {
          submitBtn.disabled = true;
          submitBtn.classList.add('disabled:pointer-events-none', 'disabled:opacity-50');
        }
      };

      // Validate on content change
      contentTextarea.addEventListener('input', validateStatusPost);
      contentTextarea.addEventListener('blur', validateStatusPost);

      // Validate on image upload/change
      imageUpload.addEventListener('change', validateStatusPost);

      // Initial validation
      validateStatusPost();
    },
  }));
});