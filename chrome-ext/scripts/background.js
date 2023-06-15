document.addEventListener("DOMContentLoaded", function() {
  const form = document.getElementById("preferencesForm");
  const deletePreferencesBtn = document.getElementById("deletePreferencesBtn");

  //Determines where the triggers and theshold will show up on the html frontend
  const selectedLabelsElem = document.getElementById("selectedLabels");
  const selectedThresholdElem = document.getElementById("selectedThreshold");


  chrome.storage.local.get("preferences", function(result) {
    if (result.preferences) {
      // Preferences exist, display them
      selectedLabelsElem.textContent = "Selected Labels: " + result.preferences.labels;
      selectedThresholdElem.textContent = "Selected Threshold: " + result.preferences.threshold;
    } else {
      // Preferences don't exist, show the form
      form.style.display = "block";
    }
  });

  form.addEventListener("submit", function(event) {
    event.preventDefault();

    const checkboxes = document.querySelectorAll('input[name="preferences"]:checked');
    const selectedLabels = Array.from(checkboxes).map(checkbox => checkbox.parentNode.textContent.trim()); //Triggers set by user

    const userThreshold = document.getElementById("thresholdLevel").value;

    // Save preferences to storage
    chrome.storage.local.set({ preferences: { labels: selectedLabels, threshold: userThreshold } });

    selectedLabelsElem.textContent = "Selected Labels: " + selectedLabels.join(", ");
    selectedThresholdElem.textContent = "Selected Threshold: " + userThreshold;

    //Reload tab after clicking Save Preferences
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.reload(tabs[0].id);
    });
  });
});

