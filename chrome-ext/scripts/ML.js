// Import NLTK and download the 'punkt' package
import { download, word_tokenize } from 'nltk';
download('punkt');

function clean_data(posts) {

        // Replace NaN values and non ascii with empty string 
        // convert to lowercase
        // and get rid of urls
        posts = posts.map(value => isNaN(value) ? '' : value);
        posts = posts.map(str => str.replace(/[^\x00-\x7F]+/g, ''));
        posts = posts.map(str => str.toLowerCase());
        posts = posts.map(str => str.replace(/https:\S+|www.\S+/gi, ''));

        // word-level tokenization and remove stop words
        const tokenizedList = posts.map(str =>
            str.split(' ').filter(word => !stopwords.includes(word))
        );

    print(tokenizedList)
}

module.exports = { clean_data }