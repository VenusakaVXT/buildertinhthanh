// User Profile Alpine.js Component
document.addEventListener('alpine:init', () => {
    Alpine.data('userProfileComponent', () => ({
        // User info data
        userInfo: {
            fullname: 'Nguyễn Văn A',
            email: 'nguyenvana@example.com',
            phone: '0123456789',
            dateOfBirth: '1990-01-01',
            gender: 'male',
            address: '123 Đường ABC, Quận 1, TP.HCM',
            avatar: ''
        },

        // Password form data
        passwordForm: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        },

        // UI state
        isEditing: false,
        isSubmitting: false,
        showCurrentPassword: false,
        showNewPassword: false,
        showConfirmPassword: false,

        // Error handling
        errors: {},

        init() {
            console.log('User Profile component initialized.');
        },

        toggleEditMode() {
            if (this.isEditing) {
                // Save changes
                this.updatePersonalInfo();
            } else {
                // Enable edit mode
                this.isEditing = true;
                this.clearErrors();
            }
        },

        async updatePersonalInfo() {
            this.clearErrors();
            this.isSubmitting = true;

            // Validation
            const validationErrors = this.validatePersonalInfo();
            if (Object.keys(validationErrors).length > 0) {
                this.errors = validationErrors;
                this.isSubmitting = false;
                return;
            }

            // Mock success for testing
            setTimeout(() => {
                this.isEditing = false;
                this.isSubmitting = false;
                this.showSuccess('Cập nhật thông tin thành công');
            }, 1000);
        },

        validatePersonalInfo() {
            const errors = {};

            if (!this.userInfo.fullname || this.userInfo.fullname.trim().length < 2) {
                errors.fullname = 'Họ và tên phải có ít nhất 2 ký tự';
            }

            if (!this.userInfo.email || !this.isValidEmail(this.userInfo.email)) {
                errors.email = 'Email không hợp lệ';
            }

            if (this.userInfo.phone && !this.isValidPhone(this.userInfo.phone)) {
                errors.phone = 'Số điện thoại không hợp lệ';
            }

            if (this.userInfo.dateOfBirth && !this.isValidDate(this.userInfo.dateOfBirth)) {
                errors.dateOfBirth = 'Ngày sinh không hợp lệ';
            }

            return errors;
        },

        async changePassword() {
            this.clearErrors();
            this.isSubmitting = true;

            // Validation
            const validationErrors = this.validatePasswordForm();
            if (Object.keys(validationErrors).length > 0) {
                this.errors = validationErrors;
                this.isSubmitting = false;
                return;
            }

            // Mock success for testing
            setTimeout(() => {
                this.isSubmitting = false;
                this.showSuccess('Đổi mật khẩu thành công');
                this.resetPasswordForm();
            }, 1000);
        },

        validatePasswordForm() {
            const errors = {};

            if (!this.passwordForm.currentPassword) {
                errors.currentPassword = 'Vui lòng nhập mật khẩu hiện tại';
            }

            if (!this.passwordForm.newPassword) {
                errors.newPassword = 'Vui lòng nhập mật khẩu mới';
            } else if (this.passwordForm.newPassword.length < 6) {
                errors.newPassword = 'Mật khẩu mới phải có ít nhất 6 ký tự';
            }

            if (!this.passwordForm.confirmPassword) {
                errors.confirmPassword = 'Vui lòng nhập lại mật khẩu mới';
            } else if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
                errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
            }

            if (this.passwordForm.currentPassword === this.passwordForm.newPassword) {
                errors.newPassword = 'Mật khẩu mới phải khác mật khẩu hiện tại';
            }

            return errors;
        },

        resetPasswordForm() {
            this.passwordForm = {
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            };
            this.showCurrentPassword = false;
            this.showNewPassword = false;
            this.showConfirmPassword = false;
        },

        changeAvatar() {
            // TODO: Implement avatar change functionality
            this.showInfo('Tính năng đổi avatar sẽ được cập nhật sớm');
        },

        // Utility functions
        isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },

        isValidPhone(phone) {
            const phoneRegex = /^[0-9]{10,11}$/;
            return phoneRegex.test(phone.replace(/\s/g, ''));
        },

        isValidDate(dateString) {
            const date = new Date(dateString);
            return date instanceof Date && !isNaN(date);
        },

        clearErrors() {
            this.errors = {};
        },

        showSuccess(message) {
            if (window.fastNotice) {
                window.fastNotice.show(message, 'success');
            }
        },

        showError(message) {
            if (window.fastNotice) {
                window.fastNotice.show(message, 'error');
            }
        },

        showInfo(message) {
            if (window.fastNotice) {
                window.fastNotice.show(message, 'info');
            }
        }
    }));
});