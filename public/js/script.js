document.addEventListener("DOMContentLoaded", () => {
  const languageFilter = document.getElementById("languageFilter");
  const tagFilter = document.getElementById("tagFilter");

  function filterSnippets() {
    const selectedLanguage = languageFilter.value;
    const selectedTag = tagFilter.value;
    const rows = document.querySelectorAll(".snippet-row");

    rows.forEach((row) => {
      const rowLanguage = row.dataset.language;
      const rowTags = row.dataset.tags.split(",");

      const languageMatch =
        selectedLanguage === "All" || rowLanguage === selectedLanguage;
      const tagMatch = selectedTag === "All" || rowTags.includes(selectedTag);

      row.style.display = languageMatch && tagMatch ? "" : "none";
    });
  }

  languageFilter.addEventListener("change", filterSnippets);
  tagFilter.addEventListener("change", filterSnippets);
});
