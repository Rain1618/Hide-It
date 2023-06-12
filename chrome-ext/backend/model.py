import pandas as pd
import numpy as np
import spacy
import pickle
import json

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

def run_model(data):

    # vectorize spacy token data for input into model
    with open('backend/model_constants/5000tfidf_vectorizer.pkl', 'rb') as f:
        vectorizer = pickle.load(f)

    # check sizes of arrays

    data['as_string'] = data['token_text'].astype(str)
    vector_text = vectorizer.transform(data['as_string']) 

    # load model and get probabilities
    loaded_model = pickle.load(open('backend/model_constants/LinearSVC_proba.sav', 'rb'))
    probabilities = loaded_model.predict_proba(vector_text)
    threshold = 30
    labels = []
    print(probabilities)
    for prob in probabilities:
        labels.append(get_label(threshold, prob))

    data['label'] = labels
    trigger_posts = data['safe'.isin(data['label'])]
    print(trigger_posts)

    # return post-label dict in json form

    labelled_posts = dict(zip(trigger_posts['post'], trigger_posts['label']))
    return labelled_posts

def get_label(threshold, probabilities):
  
  classes_names = ['safe', 'addiction', 'abuse', 'sexual violence', 'eating disorder',
                  'suicide']
  result = []
  safe = True
  for percentage, label in zip(probabilities, classes_names):
      if percentage > threshold:
          result.append(label)
          safe = False

  if safe:
    return ['safe']

  return result

    

