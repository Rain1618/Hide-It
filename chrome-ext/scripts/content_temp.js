
/*Define stylesheet */
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css';
document.head.appendChild(link);



// Function to be executed on page load
window.addEventListener('load', function() {
  
  // Collection of post (where post includes upvote bar)
  var loaded_posts_whole =  document.getElementsByClassName('rpBJOHq2PR60pnwJlUyP0')[0].children;
  
  // Collection of posts (where post excludes upvote bar)
  var loaded_posts = document.querySelectorAll("div[data-click-id='background']");
  console.log('Number of loaded posts: ' + loaded_posts.length);
  
  // Where the feedback buttons are placed
  var option_bars = document.getElementsByClassName('_21pmAV9gWG6F_UKVe7YIE0');
  
  
  /* MANIPULATING DOM */
  //Add feedback button to all loaded posts
  for (var i = 0, len = option_bars.length; i < len; i++) {
    //Create and style button
    var sad_btn = styleButton(document.createElement('button'),'2%');
    //Add icon to button
    sad_btn.appendChild(getIcon('fa-frown-o'));
    // Add button to post
    option_bars[i].appendChild(sad_btn);
  }
 
    
  // Example of hiding a post
  hidePost(loaded_posts_whole[1],1,option_bars,'addiction');
  //hidePost(loaded_posts_whole[5],5,option_bars,'addiction');
  //etc.
  
  /* PROCESSING DOM */
  data = get_posts();
  feed_data(data);
    
  // Function to be executed on scroll load
  window.addEventListener('scroll', function() {  

        // Calculate scroll position
        var scrollPosition = window.innerHeight + window.pageYOffset; // pixels we see (viewport) + pixels passed 
        var documentHeight = document.documentElement.offsetHeight;
        var last = loaded_posts.length;
        
        // Check if the user has reached the bottom of the page
        if (scrollPosition >= documentHeight) {

         // Call your function when reaching the bottom of the page

          data = get_posts();
          feed_data(data);
        }
    });
});
  

  

  function removeHtmlTags(text) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/html");
    const cleanedText = doc.body.textContent;
    return cleanedText;
  }
  
  // This function will be improved in next push!
  function hidePost(post,i,option_bar,trigger) {
    
    //Add happy feedback button ////////////////////////////////////////////////////////
    var happy_btn = styleButton(document.createElement('button'),'8%');
    happy_btn.appendChild(getIcon('fa-smile-o'));
    option_bar[i-1].appendChild(happy_btn);
    ///////////////////////////////////////////////////////////////////////////////////
    
    
    // Get  position and size of the div element
    var { x, y, width, height } = post.getBoundingClientRect(); //position relative to viewport
    console.log('POSITION' + x, y , width, height)

    // Create div
    y = y + document.documentElement.scrollTop //position relative to documnet 
    var cover = document.createElement("div");
    
    //Style div
    cover.style.position = "absolute";
    cover.style.left = x + "px";
    cover.style.top = y + "px";
    cover.style.width = width + "px";
    cover.style.height = height + "px";
    cover.style.background = 'white';
    cover.style.borderRadius = '5px'
    cover.style.zIndex = "3";
    cover.style.display = 'flex';
    cover.style.justifyContent ='center';

    setUnhideButton(cover);

    document.body.appendChild(cover);
 
  }

  function setUnhideButton(div){
    // Create a text element
  var textElement = document.createElement("button");

  // Set the text content
  textElement.innerHTML = "See post";
  

  // Apply initial styles
  textElement.style.color = "gray";
  textElement.style.position = "absolute"
  textElement.style.bottom = "5%";
  textElement.style.transition = "color 0.25s ease";

  // Add event listener for click event
  textElement.addEventListener("click", function() {
    div.remove();
    
  });

  // Add event listener for hover effect
  textElement.addEventListener("mouseover", function() {
    // Mouse hover effect: fade to black
    textElement.style.color = "black";
  });

  textElement.addEventListener("mouseout", function() {
    // Mouse hover effect: revert back to gray
    textElement.style.color = "gray";
  });

  // Append the text element to the cover
  div.appendChild(textElement);

  }

function getIcon(icon_name){
  var icon = this.document.createElement('i');
  icon.classList.add('fa', icon_name);
  icon.setAttribute('width','22px');
  icon.setAttribute('height', '22px');
  icon.style.fontSize = '23px';
  return icon
}
function styleButton(btn,right){
  btn.style.position = "absolute";
  btn.style.width = '30px'
  btn.style.height = '30px'
  btn.style.right = right;
  btn.style.bottom = '1.5%';
  btn.addEventListener('click',function(){
    console.log("Button " +btn+ " has been clicked")
  });
  return btn
}







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