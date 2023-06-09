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

    return data

def run_model(data):
    loaded_model = pickle.load(open('backend/LinearSVC_model.sav', 'rb'))

