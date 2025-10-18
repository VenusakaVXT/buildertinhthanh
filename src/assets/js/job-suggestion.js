document.addEventListener('alpine:init', () => {
  // Main Alpine.js component for job suggestion settings
  Alpine.data('jobSuggestionSettings', () => ({
    // Gender selection
    selectedGender: null,

    // Privacy switches
    allowEmployerContact: false,
    activelyLookingForJob: false,
    receiveJobSuggestions: true,

    // Professional positions (max 5)
    professionalPositions: [],
    professionalPositionInput: '',

    // Custom positions (max 5)
    customPositions: [],
    customPositionInput: '',

    // Skills (max 5)
    skills: [],
    skillInput: '',

    // Locations
    locations: [],
    locationInput: '',

    // Experience dropdown
    selectedExperience: '',

    // Salary input
    salaryInput: 0,
    salaryUnit: 'VND',

    // Short introduction
    shortIntroduction: '',

    // Methods for gender selection
    selectGender(gender) {
      this.selectedGender = gender;
    },

    isGenderSelected(gender) {
      return this.selectedGender === gender;
    },

    // Methods for privacy switches
    toggleEmployerContact() {
      this.allowEmployerContact = !this.allowEmployerContact;
    },

    toggleActivelyLooking() {
      this.activelyLookingForJob = !this.activelyLookingForJob;
    },

    toggleJobSuggestions() {
      this.receiveJobSuggestions = !this.receiveJobSuggestions;
    },


    // Methods for professional positions
    addProfessionalPosition(position) {
      if (this.professionalPositions.length < 5 && !this.professionalPositions.includes(position)) {
        this.professionalPositions.push(position);
      }
    },

    removeProfessionalPosition(position) {
      this.professionalPositions = this.professionalPositions.filter(p => p !== position);
    },

    handleProfessionalPositionKeydown(event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        const value = this.professionalPositionInput.trim();
        if (value && this.professionalPositions.length < 5) {
          this.addProfessionalPosition(value);
          this.professionalPositionInput = '';
        }
      }
    },

    // Methods for custom positions
    addCustomPosition(position) {
      if (this.customPositions.length < 5 && !this.customPositions.includes(position)) {
        this.customPositions.push(position);
      }
    },

    removeCustomPosition(position) {
      this.customPositions = this.customPositions.filter(p => p !== position);
    },

    handleCustomPositionKeydown(event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        const value = this.customPositionInput.trim();
        if (value && this.customPositions.length < 5) {
          this.addCustomPosition(value);
          this.customPositionInput = '';
        }
      }
    },

    // Methods for skills
    addSkill(skill) {
      if (this.skills.length < 5 && !this.skills.includes(skill)) {
        this.skills.push(skill);
      }
    },

    removeSkill(skill) {
      this.skills = this.skills.filter(s => s !== skill);
    },

    handleSkillKeydown(event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        const value = this.skillInput.trim();
        if (value && this.skills.length < 5) {
          this.addSkill(value);
          this.skillInput = '';
        }
      }
    },

    // Methods for locations
    addLocation(location) {
      if (!this.locations.includes(location)) {
        this.locations.push(location);
      }
    },

    removeLocation(location) {
      this.locations = this.locations.filter(l => l !== location);
    },

    handleLocationKeydown(event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        const value = this.locationInput.trim();
        if (value && !this.locations.includes(value)) {
          this.addLocation(value);
          this.locationInput = '';
        }
      }
    },


    // Form validation methods
    isFormValid() {
      return this.selectedGender !== null &&
        this.selectedExperience !== '' &&
        this.professionalPositions.length > 0;
    },


    handleUpdate() {
      if (this.isFormValid()) {
        alert('Thêm Gợi ý việc làm thành công');
        // Here you can add additional logic like sending data to server
        console.log('Form data:', {
          gender: this.selectedGender,
          professionalPositions: this.professionalPositions,
          customPositions: this.customPositions,
          skills: this.skills,
          experience: this.selectedExperience,
          salary: this.salaryInput,
          salaryUnit: this.salaryUnit,
          locations: this.locations,
          introduction: this.shortIntroduction,
          allowEmployerContact: this.allowEmployerContact,
          activelyLookingForJob: this.activelyLookingForJob,
          receiveJobSuggestions: this.receiveJobSuggestions
        });
      }
    },

    handleSaveDraft() {
      // Save draft logic
      console.log('Saving draft...');
      alert('Đã lưu nháp thành công');
    },

    // Utility methods
    isMaxReached(items, max = 5) {
      return items.length >= max;
    },


  }));
});