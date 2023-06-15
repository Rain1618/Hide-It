// update user preferences when the user does so from the front end
document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("preferencesForm");

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        const checkboxes = document.querySelectorAll('input[name="preferences"]:checked');
        const selected_labels = Array.from(checkboxes).map(checkbox => checkbox.parentNode.textContent.trim());
        chrome.storage.sync.set({ triggers: selected_labels }).then(() => {});
        const chosen_threshold = parseInt(document.getElementById('threshold').value);
        chrome.storage.sync.set({ threshold: chosen_threshold }).then(() => {});

    })
});
