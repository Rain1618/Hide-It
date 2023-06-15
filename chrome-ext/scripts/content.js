
/*Define stylesheet */
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css';
document.head.appendChild(link);

//References
var button = {'like':{'right':'8%','icon':'fa-smile-o'},'dislike':{'right':'2%','icon':'fa-frown-o'}}

window.addEventListener('load', function() {
    
    // Executed on page load
    var data = get_posts()
    feed_data(data);
    
    window.addEventListener('scroll', function() {

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
    var data = []
    loaded_posts = document.querySelectorAll("div[data-click-id='background']");

    for (var i = 0, len = loaded_posts.length; i < len; i++) {

      // Add dislike button to post
      option_bar = loaded_posts[i].querySelector('._1ixsU4oQRnNfZ91jhBU74y').querySelector('._3-miAEojrCvx_4FQ8x3P-s').querySelector('._21pmAV9gWG6F_UKVe7YIE0');
      option_bar.appendChild(createButton('dislike'));

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

    return data
  }

// send user posts to model in server api, get back label for each post
function feed_data(data) {
    
    // access user preferences
    chrome.storage.sync.get('triggers').then(trigger_response => {
      triggers = trigger_response.triggers
      chrome.storage.sync.get('threshold').then(threshold_response => {
          threshold = threshold_response.threshold
          user_prefs = {'triggers':triggers, 'threshold':threshold, "data":data}

                console.log(triggers)

                // Send a POST request to the Python server
                result = fetch('http://localhost:5000/api/submit', {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json'
                    },
                    mode: 'cors',
                    body: JSON.stringify(user_prefs)
                })
                    .then(response => response.json())
                    .then(result => {
                    // Process the response from the Python server
                    // put response into dict
                    labelled_posts = [];
                    //console.log(result)
                    for (const key in result) {
                        labelled_posts[`${key}`] = `${result[key]}`
                    }
                    // hide posts on user end
                    console.log(labelled_posts)
                    //hidePost(labelled_posts,'')
                    })
                    .catch(error => {
                    console.error('Error:', error);
                    });
                return result
        })
    })
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


  function hidePost(post) {
    
    // Add like button to post
    option_bar = post.querySelector('._1ixsU4oQRnNfZ91jhBU74y').querySelector('._3-miAEojrCvx_4FQ8x3P-s').querySelector('._21pmAV9gWG6F_UKVe7YIE0')
    option_bar.appendChild(createButton('like'))
  
    // Get  position and size of the div element
    parent_div = post.parentNode.parentNode;;
    var { x, y, width, height } = parent_div.getBoundingClientRect(); //position relative to viewport
    console.log('POSITION' + x, y , width, height)
    y = y + document.documentElement.scrollTop //position relative to document 
    
    // Create and style cover
    var cover = document.createElement("div");
    cover.style.position = "absolute";
    cover.style.left = x + "px";
    cover.style.top = y + "px";
    cover.style.width = width+"px";
    cover.style.height = height + "px";
    cover.style.background = 'white';
    cover.style.borderRadius = '5px'
    cover.style.zIndex = "3";
    cover.style.display = 'flex';
    cover.style.justifyContent ='center';
    cover.appendChild(unhideButton(cover));
    
    // Add cover to page
    document.body.appendChild(cover);
 
  }
  // Adds unhide button to div
  function unhideButton(div){
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
    return textElement
    

  }

function getIcon(icon_name){
  var icon = this.document.createElement('i');
  icon.classList.add('fa', icon_name);
  icon.setAttribute('width','22px');
  icon.setAttribute('height', '22px');
  icon.style.fontSize = '23px';
  return icon
}

function createButton(type){

  var btn = document.createElement('button')
  //Style button
  btn.style.position = "absolute";
  btn.style.width = '30px'
  btn.style.height = '30px'
  btn.style.right = button[type]['right'];
  btn.style.bottom = '1.5%';
  btn.addEventListener('click',function(){
    console.log("Button " +btn+ " has been clicked")
  });
  //Add icon
  btn.appendChild(getIcon(button[type]['icon']))

  return btn
}






