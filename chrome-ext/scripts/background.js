document.addEventListener("DOMContentLoaded", function() {
  const form = document.getElementById("preferencesForm");
  const deletePreferencesBtn = document.getElementById("deletePreferencesBtn");

  //Determines where the triggers and theshold will show up on the html frontend
  const selectedLabelsElem = document.getElementById("selectedLabels");
  const selectedThresholdElem = document.getElementById("selectedThreshold");


    //Get frontend to display saved user preferences
  chrome.storage.sync.get('triggers', (result) => {
  const triggers = result.triggers;

  if (triggers) {
    document.getElementById('selectedLabels').textContent = "Selected Labels: " + triggers.join(", ");
  } else {
    document.getElementById('selectedLabels').textContent = "";
  }
});


  chrome.storage.sync.get('threshold', (result) => {
  const threshold = result.threshold;

  if (threshold) {
    document.getElementById('selectedThreshold').textContent = "Selected Threshold: " + threshold;
  } else {
    document.getElementById('selectedThreshold').textContent = "";
  }
});

  form.addEventListener("submit", function(event) {
    event.preventDefault();

    const checkboxes = document.querySelectorAll('input[name="preferences"]:checked');
    const selectedLabels = Array.from(checkboxes).map(checkbox => checkbox.parentNode.textContent.trim()); //Triggers set by user
    const userThreshold = document.getElementById("thresholdLevel").value;

    // Save preferences to storage
    chrome.storage.sync.set({ triggers: selectedLabels }).then(() => {});
    chrome.storage.sync.set({ threshold: userThreshold }).then(() => {});

    selectedLabelsElem.textContent = "Selected Labels: " + selectedLabels.join(", ");
    selectedThresholdElem.textContent = "Selected Threshold: " + userThreshold;

    //Reload tab after clicking Save Preferences
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.reload(tabs[0].id);
    });
  });
});

