# POV-Poker
POV Poker is a work in progress. The end goal of this project is for users to be able to play poker with friends online, and for special abilities to be added.

As of right now, POV Poker is still in early development. Some features do not work as expected while others have not been implemented yet. 

## Classes
* main.py: This is the game file. All attributes for the game are stored in this class, and all actions carried out by the users are passed through this class. All poker logic is present in this file.
* Card.py: This is where card objects are created and called upon by the Game
* Player.py: This class contains all individual player attributes, for use by main.py - Each player contains a User
* User.py: This class has not yet been implemented, it will be used for database storage of player account attributes
* app.py: This is where the flask server is ran


## Dependencies
```console
Python v3.11.9
Flask v3.0.3
```

## How to Run
```console
python app.py
```
Click the link and type in any extension you want to view

## How to play (In Progress)
1. Enter your name and hit register
2. Hit join table
3. Start playing around with the betting, folding and such
