import nltk
import pandas as pd
import numpy as np

# input data is type list of strings
def clean(data):
    
    # put data into df & clean
    df = pd.DataFrame(data, columns = ['post'])

    df['post'] = df['post'].replace(np.nan,'',regex=True)
    df['post'] = df['post'].str.replace(r'[^\x00-\x7F]+', '', regex=True)
    df['post'] = df['post'].str.lower()
    df['post'] = df['post'].str.replace('https:\S+|www.\S+', '', case=False)

    print(df)

    # word level tokenize + remove stopwords
    # df['token_text'] = df.apply(lambda row: nltk.word_tokenize(row['text']), axis=1)
    # df = df.drop('text', axis = 1)

    # clean df
    return data
