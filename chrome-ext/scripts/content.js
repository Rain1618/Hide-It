// BUGS:
// need to make this run every time the user goes to a new reddit page
// if there are hyperlinks in the text of the post it includes <a href ...> in the text
// if there's bold includes <strong> etc

data = get_posts();
feed_data(data);

// get posts from browser and send them to Flask API
function get_posts() {

    // create the data to send in the request body
    const posts = document.querySelectorAll("div[data-click-id='background']");
    const data = []

    for (var i = 0, len = posts.length; i < len; i++) {

        // get title
        var post = posts[i].getElementsByTagName('h3')[0].innerHTML;
        // get text if the post has it
        paragraphs = posts[i].getElementsByTagName('p');
        for (var p = 0, length = paragraphs.length; p<length; p++) {

            // don't include text about why user is seeing the post
            dont_include = ["Popular near you", "Suggested", "Promoted", 
                            "Because you visited this community before",
                            "Popular on Reddit right now", "Videos that redditors liked",
                            "Some redditors find this funny"];
            if (!dont_include.includes(paragraphs[p].innerHTML)) {
                post = post.concat(" ", paragraphs[p].innerHTML);
            }
        }
        data.push(post);
    }
    console.log(JSON.stringify(data, null, 2));
    return data
}

function feed_data(data) {

    // Send a POST request to the Python server
    fetch('http://localhost:5000/api/submit', {
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
        console.log(result);
        })
        .catch(error => {
        console.error('Error:', error);
        });
}
    

