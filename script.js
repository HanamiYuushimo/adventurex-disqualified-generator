document.addEventListener('DOMContentLoaded', () => {
    const topIconSelect = document.getElementById('topIcon');
    const cardColorSelect = document.getElementById('cardColor');
    const customColorInput = document.getElementById('customColor');
    const mainTextInput = document.getElementById('mainText');
    const englishTextInput = document.getElementById('englishText');
    const secondaryTextInput = document.getElementById('secondaryText');
    const secondaryEnglishTextInput = document.getElementById('secondaryEnglishText');
    const bottomIconInput = document.getElementById('bottomIcon');
    const generateBtn = document.getElementById('generateBtn');

    const preview = document.getElementById('preview');
    const previewTopIcon = preview.querySelector('.top-icon .material-icons');
    const previewCardContent = preview.querySelector('.card-content');
    const previewMainText = preview.querySelector('.main-text');
    const previewEnglishText = preview.querySelector('.english-text');
    const previewSecondaryText = preview.querySelector('.secondary-text');
    const previewSecondaryEnglishText = preview.querySelector('.secondary-english-text');
    const bottomIconPreview = document.getElementById('bottomIconPreview');
    const initialSvgHTML = bottomIconPreview.innerHTML;

    // --- Update Functions ---

    function updateTopIcon() {
        previewTopIcon.textContent = topIconSelect.value;
    }

    function updateCardColor() {
        const selectedColor = cardColorSelect.value;
        if (selectedColor === 'custom') {
            customColorInput.style.display = 'inline-block';
            previewCardContent.style.backgroundColor = customColorInput.value;
            previewTopIcon.style.backgroundColor = customColorInput.value;
        } else {
            customColorInput.style.display = 'none';
            previewCardContent.style.backgroundColor = selectedColor;
            previewTopIcon.style.backgroundColor = selectedColor;
        }
    }

    function updateText() {
        previewMainText.textContent = mainTextInput.value;
        previewEnglishText.textContent = englishTextInput.value.toUpperCase();
        previewSecondaryText.textContent = secondaryTextInput.value;
        previewSecondaryEnglishText.textContent = secondaryEnglishTextInput.value.toUpperCase();
    }

    function updateBottomIcon(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                // Clear the wrapper and append an img element for the new icon
                bottomIconPreview.innerHTML = '';
                const img = document.createElement('img');
                img.src = e.target.result;
                bottomIconPreview.appendChild(img);
            };
            reader.readAsDataURL(file);
        } else {
            // If no file is selected, restore the initial SVG
            bottomIconPreview.innerHTML = initialSvgHTML;
        }
    }

    // --- Event Listeners ---

    topIconSelect.addEventListener('change', updateTopIcon);
    cardColorSelect.addEventListener('change', updateCardColor);
    customColorInput.addEventListener('input', updateCardColor);

    mainTextInput.addEventListener('input', updateText);
    englishTextInput.addEventListener('input', updateText);
    secondaryTextInput.addEventListener('input', updateText);
    secondaryEnglishTextInput.addEventListener('input', updateText);

    bottomIconInput.addEventListener('change', updateBottomIcon);

    generateBtn.addEventListener('click', () => {
        // Temporarily remove box-shadow for cleaner capture
        const originalShadow = preview.style.boxShadow;
        preview.style.boxShadow = 'none';

        html2canvas(preview, {
            useCORS: true, // Allow loading cross-origin images
            backgroundColor: '#333', // Set background color for canvas to match the card
            scale: window.devicePixelRatio * 2, // Increase resolution for better quality
            onclone: (clonedDoc) => {
                // Ensure styles are applied correctly in the cloned document
                const clonedPreview = clonedDoc.getElementById('preview');
                clonedPreview.style.transform = 'none';
                clonedPreview.style.margin = '0';
            }
        }).then(canvas => {
            // Restore box-shadow
            preview.style.boxShadow = originalShadow;

            const link = document.createElement('a');
            link.download = 'disqualified.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        }).catch(err => {
            console.error('Oops, something went wrong!', err);
            // Restore box-shadow even if there's an error
            preview.style.boxShadow = originalShadow;
        });
    });

    // --- Initial Setup ---
    updateTopIcon();
    updateCardColor();
    updateText();
});