console.log("testing")

const article = document.querySelectorAll("article");
const posts = document.querySelectorAll("div[data-testid='post-container']");
const test = document.querySelectorAll("div[data-adclicklocation='background']");

/*
if (article) {
    const text = article.textContent;
    const wordMatchRegExp = /[^\s]+/g; // Regular expression
    const words = text.matchAll(wordMatchRegExp);
    // matchAll returns an iterator, convert to array to get word count
    const wordCount = [...words].length;
    const readingTime = Math.round(wordCount / 200);
    const badge = document.createElement("p");
    // Use the same styling as the publish information in an article's header
    badge.classList.add("color-secondary-text", "type--caption");
    badge.textContent = `⏱️ ${readingTime} min read xxx`;

    // Support for API reference docs
  const heading = article.querySelector("h1");
  // Support for article docs with date
  const date = article.querySelector("time")?.parentNode;

  (date ?? heading).insertAdjacentElement("afterend", badge);
}
*/

for (var t = 0, len = test.length; t < len; t++) {
    //work with checkboxes[i]
    console.log(test[t])
}