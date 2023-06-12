 window.addEventListener('load', function() {
    // Executed on page load
    data = get_posts();
    feed_data(data);
    
    // Executed on scroll load
    window.addEventListener('scroll', function() {
       
        // Calculate scroll position
        var scrollPosition = window.innerHeight + window.pageYOffset;
        var documentHeight = document.documentElement.offsetHeight;

        // Check if the user has reached the bottom of the page
        if (scrollPosition >= documentHeight) {
        data = get_posts();
        feed_data(data);
        }
    });
});

// scrape reddit posts from user feed
function get_posts() {
    data = []
    loaded_posts = document.querySelectorAll("div[data-click-id='background']");
    for (var i = 0, len = loaded_posts.length; i < len; i++) {
       
        // get title
        var post = loaded_posts[i].getElementsByTagName('h3')[0].innerHTML;
        // get text if the post has it
        paragraphs = loaded_posts[i].getElementsByTagName('p');
        
        for (var p = 0, length = paragraphs.length; p<length; p++) {

            // don't include text about why user is seeing the post
            dont_include = ["Popular near you", "Suggested", "Promoted", 
                            "Because you visited this community before",
                            "Popular on Reddit right now", "Videos that redditors liked",
                            "Some redditors find this funny", 
                            "Because you've shown interest in a similar community"];
            if (!dont_include.includes(paragraphs[p].innerHTML)) {
                var clean_post = removeHtmlTags(paragraphs[p].innerHTML)
                post = post.concat(" ", clean_post);
            }
        }
        data.push(post);
    }
    console.log(JSON.stringify(data, null, 2));
    return data
  }

// send user posts to model in server api, get back label for each post
function feed_data(data) {

    // Send a POST request to the Python server
    result = fetch('http://localhost:5000/api/submit', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        mode: 'cors',
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(result => {
        // Process the response from the Python server
        // put response into dict
        labelled_posts = [];
        for (const key in result) {
            labelled_posts[`${key}`] = `${result[key]}`
        }
        // hide posts on user end
        hide_posts(labelled_posts)
        })
        .catch(error => {
        console.error('Error:', error);
        });
    return result
}

// hide posts labelled as triggering
function hide_posts(result) {

    // base hiding off of user preferences
    /*
    chrome.storage.sync.get(["key"]).then((result) => {
        console.log("Value currently is " + result.key);
      });
    */
    for (const key in result) {

        labelled_posts[`${key}`] = `${result[key]}`
    }
}

// clean posts
function removeHtmlTags(text) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/html");
    const cleanedText = doc.body.textContent;
    return cleanedText;
}

// save user data (triggers & thresholds)

document.getElementById("preferencesForm").addEventListener("submit", function(event) {
    console.log("hello")
    event.preventDefault(); // Prevent the form from submitting normally
    
    // access form field values
    var triggers = document.getElementById("triggers").value;
    var threshold = document.getElementById("threshold").value;
    
    // save user's inputs
    chrome.storage.sync.set({ 'triggers': triggers }).then(() => {
        console.log("Triggers are set");
      });
    chrome.storage.sync.set({ 'threshold': threshold }).then(() => {
        console.log("Threshold is set");
    });
      
    // Clear the form fields (optional)
    document.getElementById("myForm").reset();
  });



