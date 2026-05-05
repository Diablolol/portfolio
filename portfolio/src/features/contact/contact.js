import { sendContactMessage } from './contact.service.js';

export function initContact() {
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');
    const privacyLink = document.getElementById('privacy-link');
    const termsLink = document.getElementById('terms-link');
    const privacyModal = document.getElementById('privacy-modal');
    const termsModal = document.getElementById('terms-modal');
    const closePrivacy = document.getElementById('close-privacy');
    const closeTerms = document.getElementById('close-terms');

    if (contactForm) {
        contactForm.addEventListener('submit', async event => {
            event.preventDefault();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn?.textContent || 'กำลังส่ง...';
            submitBtn.textContent = 'กำลังส่ง...';
            submitBtn.disabled = true;

            const formData = new FormData(contactForm);
            const payload = {
                name: formData.get('name'),
                email: formData.get('email'),
                subject: formData.get('subject'),
                message: formData.get('message'),
            };

            try {
                await sendContactMessage(payload);
                formSuccess?.classList.remove('hidden');
                contactForm.reset();
            } catch (error) {
                console.error(error);
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                setTimeout(() => {
                    formSuccess?.classList.add('hidden');
                }, 5000);
            }
        });
    }

    function toggleModal(modalElement, isOpen) {
        if (!modalElement) return;
        if (isOpen) {
            modalElement.classList.remove('hidden');
            modalElement.classList.add('flex');
        } else {
            modalElement.classList.add('hidden');
            modalElement.classList.remove('flex');
        }
    }

    if (privacyLink && privacyModal) {
        privacyLink.addEventListener('click', event => {
            event.preventDefault();
            toggleModal(privacyModal, true);
        });
    }

    if (termsLink && termsModal) {
        termsLink.addEventListener('click', event => {
            event.preventDefault();
            toggleModal(termsModal, true);
        });
    }

    closePrivacy?.addEventListener('click', () => toggleModal(privacyModal, false));
    closeTerms?.addEventListener('click', () => toggleModal(termsModal, false));

    privacyModal?.addEventListener('click', event => {
        if (event.target === privacyModal) toggleModal(privacyModal, false);
    });

    termsModal?.addEventListener('click', event => {
        if (event.target === termsModal) toggleModal(termsModal, false);
    });
}
