document.addEventListener('alpine:init', () => {
  Alpine.data('postRealEstates', () => ({
    init() {
      this.handleValidateContact();
      this.enableSubmitButton();
    },

    // Contact validation (Email and Phone)
    handleValidateContact() {
      const emailInput = document.getElementById('contactEmailRealEstate');
      const phoneInput = document.getElementById('contactPhoneRealEstate');
      const emailMessage = document.getElementById('email-message-real-estate');
      const phoneMessage = document.getElementById('phone-message-real-estate');

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
          // Empty phone - show required message
          phoneMessage.textContent = 'Số điện thoại là bắt buộc';
          phoneMessage.className = 'text-sm text-red-500';
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

    // Real Estate post validation (Required fields + Images + Phone)
    enableSubmitButton() {
      const titleInput = document.getElementById('real-estate-title');
      const propertyTypeSelect = document.getElementById('property-type-select');
      const propertyFormSelect = document.getElementById('property-form-select');
      const priceInput = document.getElementById('real-estate-price');
      const areaInput = document.getElementById('real-estate-area');
      const addressInput = document.getElementById('real-estate-address');
      const descriptionTextarea = document.getElementById('real-estate-description');
      const phoneInput = document.getElementById('contactPhoneRealEstate');
      const imagesInput = document.getElementById('real-estate-images');
      const submitBtn = document.getElementById('real-estate-submit-btn');

      if (!titleInput || !propertyTypeSelect || !propertyFormSelect || !priceInput ||
        !areaInput || !addressInput || !descriptionTextarea || !phoneInput ||
        !imagesInput || !submitBtn) return;

      const validateRealEstatePost = () => {
        const hasTitle = titleInput.value.trim().length > 0;
        const hasPropertyType = propertyTypeSelect.value !== '';
        const hasPropertyForm = propertyFormSelect.value !== '';
        const hasPrice = priceInput.value.trim().length > 0;
        const hasArea = areaInput.value.trim().length > 0;
        const hasAddress = addressInput.value.trim().length > 0;
        const hasDescription = descriptionTextarea.value.trim().length > 0;
        const hasImages = imagesInput.files && imagesInput.files.length > 0;

        // Phone validation
        const phone = phoneInput.value.trim();
        const cleanPhone = phone.replace(/\D/g, '');
        const phoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$/;
        const hasValidPhone = phone !== '' && phoneRegex.test(cleanPhone);

        // Enable submit button if all required fields are filled, has images, and phone is valid
        if (hasTitle && hasPropertyType && hasPropertyForm && hasPrice &&
          hasArea && hasAddress && hasDescription && hasValidPhone && hasImages) {
          submitBtn.disabled = false;
          submitBtn.classList.remove('disabled:pointer-events-none', 'disabled:opacity-50');
        } else {
          submitBtn.disabled = true;
          submitBtn.classList.add('disabled:pointer-events-none', 'disabled:opacity-50');
        }
      };

      // Validate on input change
      titleInput.addEventListener('input', validateRealEstatePost);
      titleInput.addEventListener('blur', validateRealEstatePost);

      propertyTypeSelect.addEventListener('change', validateRealEstatePost);
      propertyFormSelect.addEventListener('change', validateRealEstatePost);

      priceInput.addEventListener('input', validateRealEstatePost);
      priceInput.addEventListener('blur', validateRealEstatePost);

      areaInput.addEventListener('input', validateRealEstatePost);
      areaInput.addEventListener('blur', validateRealEstatePost);

      addressInput.addEventListener('input', validateRealEstatePost);
      addressInput.addEventListener('blur', validateRealEstatePost);

      descriptionTextarea.addEventListener('input', validateRealEstatePost);
      descriptionTextarea.addEventListener('blur', validateRealEstatePost);

      phoneInput.addEventListener('input', validateRealEstatePost);
      phoneInput.addEventListener('blur', validateRealEstatePost);

      // Validate on image upload/change
      imagesInput.addEventListener('change', validateRealEstatePost);

      // Initial validation
      validateRealEstatePost();
    },
  }));
});