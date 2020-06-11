# Recommend-system

* Clone the repo with: 
```python
git clone https://github.com/winlp4ever/recommend-system
cd recommend-system
```
* Install `nodejs` and `npm` on your system 

    * For __Windows__ users, please visite [https://nodejs.org/en/download/](https://nodejs.org/en/download/) and download the installer

    * For __Ubuntu__ users, type the following commands:

    1. `curl -sL https://deb.nodesource.com/setup_10.x -o nodesource_setup.sh`
    2. `sudo bash nodesource_setup.sh`
    3. `sudo apt install nodejs`

* Install nodemon with `npm i -g nodemon` (consider using `sudo` if you're unix/linux user)

* Install all necessary python packages `pip install -r nlp/requirements.txt` (parse `--no-cache-dir` in case you have a limited RAM)
* Install all `npm` packages (for front-end): `npm i`
* Start your server with: `npm start`
* Open another terminal and start the python backend with: `python nlp/hint-server.py`
* Open the link: `http://localhost:5000` on your browser, you should see a simple website

# Exercises

## Deployment on AWS

* Install the whole system on an AWS EC2 machine
* Manage to make the app run in background 

You would need a third party to do that. A good option is `pm2` (homepage [here](https://github.com/Unitech/pm2)). But feel free to try another option you find.

With `pm2`, you can simply run

```
pm2 start npm -- start
pm2 start nlp/hint-server.py
```

Check the status with `pm2 status` and the loggings with `pm2 log`

* Succeed to open the website (Configure the security groups)

## Implement a recommend system

The system will search for similar questions in the base to return (as hints). Once you've entered the question, they will try to find the response (which is the response of the question of which the similarity with your typed question > 90%)

* What we have to modify is the method `similarity` of class Hints: Modify a function in a way that vectorises both argument questions then returns the cosine similarity between them.

* There are plenty of ways to do that: `tf-idf` with `scikit-learn`, or `word2vec` of `gensim`. Here I propose the use of `sentence-transformers` (based on BERT, state-of-the-art in many nlp problems, the github page is [here](https://github.com/UKPLab/sentence-transformers))

## Improve your system

* Enlarge the database
* Vectorise all the questions at rest
* ...

