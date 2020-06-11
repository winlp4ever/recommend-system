import json

class Hints(object):
    '''
    Hint system
    '''
    def __init__(self, fn='nlp/qas.json'):
        with open(fn) as json_file:
            self.data = json.load(json_file)

        print (self.data)

    def similarity(self, q1, q2):
        return 0.95

    def getHints(self, q: str):
        hints = []
        for h in self.data:
            hints.append({"text": h["question"], "score": self.similarity(q, h["question"])})
        hints.sort(reverse=True, key=lambda d: d["score"])
        hints = hints[:5] # select top 5 results
        return hints

    def getAnswer(self, q: str):
        mx = 0
        ans = 'Cannot find an answer for your question'
        for h in self.data:
            sim = self.similarity(q, h['question'])
            if sim > 0.9 and sim > mx:
                mx = sim
                ans = h['answer']
        return ans
        
        
