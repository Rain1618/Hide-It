function get_posts() {

    const posts = document.querySelectorAll("div[data-click-id='background']");

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
        console.log(post)
    }
}