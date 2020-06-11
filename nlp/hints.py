import json
from sentence_transformers import SentenceTransformer
from scipy.spatial.distance import cosine

class Hints(object):
    '''
    Hint system
    '''
    def __init__(self, fn='nlp/qas.json'):
        '''
        Initialize the object by reading question/answers data
        '''
        with open(fn) as json_file:
            self.data = json.load(json_file)

        self.bc = SentenceTransformer('distiluse-base-multilingual-cased')

    def similarity(self, q1, q2):
        """
        Compute the similarity between q1 and q2. 
        You are supposed to modify this function.
        The goal is to vectorise the two questions with a nlp method of your choice
        """
        v = self.bc.encode([q1, q2])
        dist = 1 - cosine(v[0], v[1])
        return dist

    def getHints(self, q: str):
        '''
        Returns the most similar questions in the base to what people are typing.
        Basically, this function will iterate over the whole dataset to compare
        the similarity of each question in the base with what people are typing and finally select ones
        with highest scores to return
        '''
        hints = []
        for h in self.data:
            hints.append({"text": h["question"], "score": self.similarity(q, h["question"])})
        hints.sort(reverse=True, key=lambda d: d["score"])
        hints = hints[:5] # select top 5 results
        return hints

    def getAnswer(self, q: str):
        '''
        Returns the answer to the question q.
        
        Basically this function will search for the most similar question to q in the 
        base, and if the similarity is greater than 90%, will return the answer of 
        that question
        '''
        mx = 0
        ans = 'Cannot find an answer for your question'
        for h in self.data:
            sim = self.similarity(q, h['question'])
            if sim > 0.9 and sim > mx:
                mx = sim
                ans = h['answer']
        return ans
        
        
