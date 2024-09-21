import json
from library import Game, Player

names = ["Matt", "Jeremy", "Ryan", "Jackson", "Luke", "Jack"]
players = [Player(name, None, None, 1000, 0) for name in names]

game = Game(gameID=0, players=players, smallBlind=10, bigBlind=20)

game.newRound()

print(game.json())