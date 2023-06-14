document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("preferencesForm");
    //Determine where the triggers and theshold will show up on the html frontend
    const selectedLabelsElem = document.getElementById("selectedLabels");
    const selectedThresholdElem = document.getElementById("selectedThreshold");

    form.addEventListener("submit", function(event) {
        event.preventDefault();

        // update user preferences
        const checkboxes = document.querySelectorAll('input[name="preferences"]:checked');
        const selectedLabels = Array.from(checkboxes).map(checkbox => checkbox.parentNode.textContent.trim());
        const userThreshold = document.getElementById("thresholdLevel").value; 

        selectedLabelsElem.textContent = "Selected Labels: " + selectedLabels.join(", ");
        selectedThresholdElem.textContent = "Selected Threshold: " + userThreshold;
        
        chrome.storage.sync.set({ triggers: selectedLabels }).then(() => {});

        var threshold = 'threshold', test_threshold = 0.5;

        chrome.storage.sync.set({ threshold: test_threshold }).then(() => {});
    })
});
