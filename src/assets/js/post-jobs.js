document.addEventListener('alpine:init', () => {
  Alpine.data('postJobs', () => ({
    init() {
      this.handleClickCheckboxSalaryRange();
      this.handleAddSkills();
      this.handleValidateDeadline();
      this.handleValidateContact();
      this.enableSubmitButton();
    },

    // Handle click checkbox salary range
    handleClickCheckboxSalaryRange() {
      const negotiableCheckbox = document.getElementById('negotiable');
      const rangeCheckbox = document.getElementById('range');
      const salaryForm = document.querySelector('.hidden.grid.grid-cols-1.md\\:grid-cols-3.gap-4');

      if (!negotiableCheckbox || !rangeCheckbox || !salaryForm) return;

      // Handle negotiable checkbox change
      negotiableCheckbox.addEventListener('change', () => {
        if (negotiableCheckbox.checked) {
          // Uncheck range when negotiable is checked
          rangeCheckbox.checked = false;
          // Hide salary form
          salaryForm.classList.add('hidden');
        }
      });

      // Handle range checkbox change
      rangeCheckbox.addEventListener('change', () => {
        if (rangeCheckbox.checked) {
          // Uncheck negotiable when range is checked
          negotiableCheckbox.checked = false;
          // Show salary form
          salaryForm.classList.remove('hidden');
        }
      });

      // Initial state - hide salary form since negotiable is checked by default
      salaryForm.classList.add('hidden');
    },

    // Handle add skills
    handleAddSkills() {
      const skillInput = document.getElementById('skill-input');
      const addSkillBtn = document.getElementById('add-skill-btn');
      const skillsContainer = document.getElementById('skills-container');

      if (!skillInput || !addSkillBtn || !skillsContainer) return;

      // Add skill function
      const addSkill = () => {
        const skillText = skillInput.value.trim();
        if (skillText === '') return;

        // Check if skill already exists
        const existingSkills = Array.from(skillsContainer.querySelectorAll('.skill-item')).map(skill =>
          skill.querySelector('.skill-text').textContent.trim()
        );

        if (existingSkills.includes(skillText)) {
          console.log('Skill already exists:', skillText);
          return;
        }

        // Create skill element
        const skillElement = document.createElement('div');
        skillElement.className = 'skill-item inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium';
        skillElement.innerHTML = `
          <span class="skill-text">${skillText}</span>
          <button type="button" class="skill-remove-btn ml-1 hover:bg-gray-200 rounded-full p-0.5 transition-colors" data-skill="${skillText}">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x">
              <path d="M18 6 6 18"></path>
              <path d="M6 6l12 12"></path>
            </svg>
          </button>
        `;

        // Add to container
        skillsContainer.appendChild(skillElement);

        // Clear input
        skillInput.value = '';

        // Add remove functionality
        const removeBtn = skillElement.querySelector('.skill-remove-btn');
        removeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          skillElement.remove();
          console.log('Skill removed:', skillText);
        });

        console.log('Skill added:', skillText);
      };

      // Add skill on button click
      addSkillBtn.addEventListener('click', addSkill);

      // Add skill on Enter key press
      skillInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          addSkill();
        }
      });
    },

    // Deadline validation
    handleValidateDeadline() {
      const deadlineInput = document.getElementById('deadline');
      const deadlineMessage = document.getElementById('deadline-message');

      if (!deadlineInput || !deadlineMessage) return;

      const validateDeadline = () => {
        const selectedDate = deadlineInput.value;

        if (!selectedDate) {
          // Empty input - show default message
          deadlineMessage.textContent = 'Chọn ngày hạn nộp hồ sơ';
          deadlineMessage.className = 'text-sm text-gray-500';
          return;
        }

        const selectedDateTime = new Date(selectedDate);
        const currentDate = new Date();
        // Set current date to start of day for comparison
        currentDate.setHours(0, 0, 0, 0);

        if (selectedDateTime < currentDate) {
          // Past date - show error message
          deadlineMessage.textContent = 'Hạn nộp hồ sơ phải lớn hơn hoặc bằng ngày hiện tại';
          deadlineMessage.className = 'text-sm text-red-500';
        } else {
          // Future date or today - show success message
          const timeDiff = selectedDateTime - currentDate;
          const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

          if (days === 0) {
            deadlineMessage.textContent = 'Hạn nộp hồ sơ là hôm nay';
            deadlineMessage.className = 'text-sm text-green-500';
          } else if (days === 1) {
            deadlineMessage.textContent = 'Hạn nộp hồ sơ là ngày mai';
            deadlineMessage.className = 'text-sm text-green-500';
          } else {
            deadlineMessage.textContent = `Còn ${days} ngày để nộp hồ sơ`;
            deadlineMessage.className = 'text-sm text-green-500';
          }
        }
      };

      // Validate on input change
      deadlineInput.addEventListener('input', validateDeadline);

      // Validate on focus out
      deadlineInput.addEventListener('blur', validateDeadline);
    },

    // Contact validation (Email and Phone)
    handleValidateContact() {
      const emailInput = document.getElementById('contactEmail');
      const phoneInput = document.getElementById('contactPhone');
      const emailMessage = document.getElementById('email-message');
      const phoneMessage = document.getElementById('phone-message');

      if (!emailInput || !phoneInput || !emailMessage || !phoneMessage) return;

      // Email validation
      const validateEmail = () => {
        const email = emailInput.value.trim();

        if (!email) {
          // Empty email - show required message
          emailMessage.textContent = 'Email là bắt buộc';
          emailMessage.className = 'text-sm text-red-500';
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

    // Job post validation (Required fields + Email format)
    enableSubmitButton() {
      const titleInput = document.getElementById('job-title');
      const companyInput = document.getElementById('job-company');
      const jobTypeSelect = document.getElementById('job-type-select');
      const workTypeSelect = document.getElementById('work-type-select');
      const experienceSelect = document.getElementById('experience-select');
      const workLocationInput = document.getElementById('job-work-location');
      const descriptionTextarea = document.getElementById('job-description');
      const requirementsTextarea = document.getElementById('job-requirements');
      const emailInput = document.getElementById('contactEmail');
      const submitBtn = document.getElementById('job-submit-btn');

      if (!titleInput || !companyInput || !jobTypeSelect || !workTypeSelect || !experienceSelect ||
        !workLocationInput || !descriptionTextarea || !requirementsTextarea || !emailInput || !submitBtn) return;

      const validateJobPost = () => {
        const hasTitle = titleInput.value.trim().length > 0;
        const hasCompany = companyInput.value.trim().length > 0;
        const hasJobType = jobTypeSelect.value !== '';
        const hasWorkType = workTypeSelect.value !== '';
        const hasExperience = experienceSelect.value !== '';
        const hasWorkLocation = workLocationInput.value.trim().length > 0;
        const hasDescription = descriptionTextarea.value.trim().length > 0;
        const hasRequirements = requirementsTextarea.value.trim().length > 0;

        // Email validation
        const email = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const hasValidEmail = email !== '' && emailRegex.test(email);

        // Enable submit button if all required fields are filled and email is valid
        if (hasTitle && hasCompany && hasJobType && hasWorkType && hasExperience &&
          hasWorkLocation && hasDescription && hasRequirements && hasValidEmail) {
          submitBtn.disabled = false;
          submitBtn.classList.remove('disabled:pointer-events-none', 'disabled:opacity-50');
        } else {
          submitBtn.disabled = true;
          submitBtn.classList.add('disabled:pointer-events-none', 'disabled:opacity-50');
        }
      };

      // Validate on input change
      titleInput.addEventListener('input', validateJobPost);
      titleInput.addEventListener('blur', validateJobPost);

      companyInput.addEventListener('input', validateJobPost);
      companyInput.addEventListener('blur', validateJobPost);

      jobTypeSelect.addEventListener('change', validateJobPost);
      workTypeSelect.addEventListener('change', validateJobPost);
      experienceSelect.addEventListener('change', validateJobPost);

      workLocationInput.addEventListener('input', validateJobPost);
      workLocationInput.addEventListener('blur', validateJobPost);

      descriptionTextarea.addEventListener('input', validateJobPost);
      descriptionTextarea.addEventListener('blur', validateJobPost);

      requirementsTextarea.addEventListener('input', validateJobPost);
      requirementsTextarea.addEventListener('blur', validateJobPost);

      emailInput.addEventListener('input', validateJobPost);
      emailInput.addEventListener('blur', validateJobPost);

      // Initial validation
      validateJobPost();
    },
  }));
}); 