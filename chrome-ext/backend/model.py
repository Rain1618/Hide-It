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

def run_model(data):

    # vectorize spacy token data for input into model
    with open('backend/model_constants/tfidf_vectorizer.pkl', 'rb') as f:
        vectorizer = pickle.load(f)

    # check sizes of arrays

    data['as_string'] = data['token_text'].astype(str)
    data['vector_text'] = vectorizer.transform(data['as_string']) 

    '''
    # load model and get probabilities
    loaded_model = pickle.load(open('backend/model_constants/LinearSVC_model.sav', 'rb'))
    print(loaded_model.predict(data['vector_text']))
    '''

    #return data_with_predictions
    return 1
    

