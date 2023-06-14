document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("preferencesForm");
    const selectedLabelsElem = document.getElementById("selectedLabels");

    form.addEventListener("submit", function(event) {
        event.preventDefault();

        // update user preferences
        const checkboxes = document.querySelectorAll('input[name="preferences"]:checked');
        const selectedLabels = Array.from(checkboxes).map(checkbox => checkbox.parentNode.textContent.trim());
        selectedLabelsElem.textContent = "Selected Labels: " + selectedLabels.join(", ");
        chrome.storage.sync.set({ triggers: selectedLabels }).then(() => {});
        chrome.storage.sync.set({ threshold: 0.5 }).then(() => {});
    })
});
