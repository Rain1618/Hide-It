 
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
  
  function get_posts() {
    loaded_posts =  document.getElementsByClassName('rpBJOHq2PR60pnwJlUyP0')[0].children;
    for (var i = 1, len = loaded_posts.length; i < len; i++) {
       
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

function hide_posts(result) {
    for (const key in result) {

        labelled_posts[`${key}`] = `${result[key]}`
    }
}
    

function removeHtmlTags(text) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/html");
    const cleanedText = doc.body.textContent;
    return cleanedText;
    }


