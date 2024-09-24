import json
from library import Game, Player

names = ["mcmattman", "Jeremy", "Ryan", "Jackson", "Luke", "Jack", "Guest"]
players = [Player(name, None, None, 1000, 0) for name in names]

game = Game(gameID=0, players=players, smallBlind=10, bigBlind=20)

game.newRound()

print(game.json())