class Hints(object):
    def __init__(self):
        self.data = ['what is machine learning', 'what is deep learning']

    def getHints(self, q: str):
        hints = []
        for h in self.data:
            hints.append({"text": h, "score": 0.5})
        hints.sort(reverse=True, key=lambda d: d["score"])
        hints = hints[:5] # select top 5 results
        return hints