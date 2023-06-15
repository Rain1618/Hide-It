import pandas as pd
import numpy as np
import spacy
import pickle

# input data is type list of strings
def clean(data):
    
    # put data into df & clean
    df = pd.DataFrame(data, columns = ['post'])

    df['post'] = df['post'].replace(np.nan,'',regex=True)
    df['post'] = df['post'].str.replace(r'[^\x00-\x7F]+', '', regex=True)
    df['post'] = df['post'].str.lower()
    df['post'] = df['post'].str.replace('https:\S+|www.\S+', '', case=False)

    # word level tokenize + remove stopwords
    nlp = spacy.load('en_core_web_sm')
    df['token_text'] = df.apply(lambda row: nlp(row['post']), axis=1)
    return df

def run_model(data, triggers, threshold):

    # vectorize spacy token data for input into model
    with open('backend/model_constants/5000tfidf_vectorizer.pkl', 'rb') as f:
        vectorizer = pickle.load(f)

    data['as_string'] = data['token_text'].astype(str)
    vector_text = vectorizer.transform(data['as_string']) 

    # load model and get probabilities
    loaded_model = pickle.load(open('backend/model_constants/SVCv2.sav', 'rb'))
    probabilities = loaded_model.predict_proba(vector_text)
    labels = []

    print(probabilities)

    # keep posts that are labelled as triggering & correspond to user's triggers
    for prob in probabilities:
        labels.append(get_label(threshold, prob))
    data['label'] = labels
    trigger_posts = data[data['label'].isin(triggers)]
    print(trigger_posts)

    # return post-label dict in json form
    labelled_posts = dict(zip(trigger_posts['post'], trigger_posts['label']))
    return labelled_posts

def get_label(threshold, probabilities):
  
  classes_names = ['Abuse', 'Addiction', 'Eating disorder', 'safe', 'Sexual violence',
                  'Suicide']
  result = 'safe'
  highest_prob = 0
  for percentage, label in zip(probabilities, classes_names):
      #if percentage > threshold and percentage > highest_prob:
    if percentage > 0.1 and percentage > highest_prob and label != 'safe':
          result = label
          highest_prob = percentage
          print(highest_prob)
          print(label)

  return result

    

