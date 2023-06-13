document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("preferencesForm");
    const selectedLabelsElem = document.getElementById("selectedLabels");

    form.addEventListener("submit", function(event) {
        event.preventDefault();

        const checkboxes = document.querySelectorAll('input[name="preferences"]:checked');
        const selectedLabels = Array.from(checkboxes).map(checkbox => checkbox.parentNode.textContent.trim());
        console.log(typeof(selectedLabels))
        selectedLabelsElem.textContent = "Selected Labels: " + selectedLabels.join(", ");
    });
});
