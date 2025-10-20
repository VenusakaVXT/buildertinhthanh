document.addEventListener('alpine:init', () => {
  Alpine.data('postServices', () => ({
    init() {
      this.handleValidateContact();
      this.enableSubmitButton();
    },

    // Contact validation (Email and Phone)
    handleValidateContact() {
      const emailInput = document.getElementById('contactEmailService');
      const phoneInput = document.getElementById('contactPhoneService');
      const emailMessage = document.getElementById('email-message-service');
      const phoneMessage = document.getElementById('phone-message-service');

      if (!emailInput || !phoneInput || !emailMessage || !phoneMessage) return;

      // Email validation
      const validateEmail = () => {
        const email = emailInput.value.trim();

        if (!email) {
          // Empty email - show optional message
          emailMessage.textContent = 'Nhập địa chỉ email hợp lệ (tùy chọn)';
          emailMessage.className = 'text-sm text-gray-500';
          return;
        }

        // Email regex pattern
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
          // Invalid email format
          emailMessage.textContent = 'Địa chỉ email không hợp lệ';
          emailMessage.className = 'text-sm text-red-500';
        } else {
          // Valid email
          emailMessage.textContent = 'Địa chỉ email hợp lệ';
          emailMessage.className = 'text-sm text-green-500';
        }
      };

      // Phone validation
      const validatePhone = () => {
        const phone = phoneInput.value.trim();

        if (!phone) {
          // Empty phone - show optional message
          phoneMessage.textContent = 'Nhập số điện thoại hợp lệ (tùy chọn)';
          phoneMessage.className = 'text-sm text-gray-500';
          return;
        }

        // Remove all non-digit characters
        const cleanPhone = phone.replace(/\D/g, '');

        // Vietnamese phone number patterns
        const phoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$/;

        if (!phoneRegex.test(cleanPhone)) {
          // Invalid phone format
          phoneMessage.textContent = 'Số điện thoại không hợp lệ (VD: 0123456789)';
          phoneMessage.className = 'text-sm text-red-500';
        } else {
          // Valid phone
          phoneMessage.textContent = 'Số điện thoại hợp lệ';
          phoneMessage.className = 'text-sm text-green-500';
        }
      };

      // Email event listeners
      emailInput.addEventListener('input', validateEmail);
      emailInput.addEventListener('blur', validateEmail);

      // Phone event listeners
      phoneInput.addEventListener('input', validatePhone);
      phoneInput.addEventListener('blur', validatePhone);

      // Auto-format phone number on input
      phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');

        // Limit to 10 digits
        if (value.length > 10) {
          value = value.substring(0, 10);
        }

        // Format: 0123 456 789
        if (value.length >= 4) {
          value = value.substring(0, 4) + ' ' + value.substring(4);
        }
        if (value.length >= 8) {
          value = value.substring(0, 8) + ' ' + value.substring(8);
        }

        e.target.value = value;
        validatePhone();
      });
    },

    // Service post validation (Required fields + Phone validation)
    enableSubmitButton() {
      const titleInput = document.getElementById('service-title');
      const priceInput = document.getElementById('service-price');
      const descriptionTextarea = document.getElementById('service-description');
      const categorySelect = document.getElementById('service-category-select');
      const phoneInput = document.getElementById('contactPhoneService');
      const submitBtn = document.getElementById('service-submit-btn');

      if (!titleInput || !priceInput || !descriptionTextarea || !categorySelect || !phoneInput || !submitBtn) return;

      const validateServicePost = () => {
        const hasTitle = titleInput.value.trim().length > 0;
        const hasPrice = priceInput.value.trim().length > 0;
        const hasDescription = descriptionTextarea.value.trim().length > 0;
        const hasCategory = categorySelect.value !== '';

        // Phone validation
        const phone = phoneInput.value.trim();
        const cleanPhone = phone.replace(/\D/g, '');
        const phoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$/;
        const hasValidPhone = phone !== '' && phoneRegex.test(cleanPhone);

        // Enable submit button if all required fields are filled and phone is valid
        if (hasTitle && hasPrice && hasDescription && hasCategory && hasValidPhone) {
          submitBtn.disabled = false;
          submitBtn.classList.remove('disabled:pointer-events-none', 'disabled:opacity-50');
        } else {
          submitBtn.disabled = true;
          submitBtn.classList.add('disabled:pointer-events-none', 'disabled:opacity-50');
        }
      };

      // Validate on input change
      titleInput.addEventListener('input', validateServicePost);
      titleInput.addEventListener('blur', validateServicePost);

      priceInput.addEventListener('input', validateServicePost);
      priceInput.addEventListener('blur', validateServicePost);

      descriptionTextarea.addEventListener('input', validateServicePost);
      descriptionTextarea.addEventListener('blur', validateServicePost);

      categorySelect.addEventListener('change', validateServicePost);

      phoneInput.addEventListener('input', validateServicePost);
      phoneInput.addEventListener('blur', validateServicePost);

      // Initial validation
      validateServicePost();
    }
  }));
});