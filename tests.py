from library.Game import Game
from library.Player import Player
from itertools import groupby

names = ["Matt", "Jeremy", "Jackson"]
players = [Player(name, None, None, 1000, 0) for name in names]

game = Game(gameID=0, players=players, smallBlind=10, bigBlind=20)

game.newRound()

print(game.placeBetFold(20))
print(game.placeBetFold(20))
print(game.placeBetFold(0))
print(game.placeBetFold(20))
print(game.placeBetFold(20))
print(game.placeBetFold(20))
print(game.placeBetFold(None))
print(game.placeBetFold(0))
print(game.placeBetFold(20))
print(game.placeBetFold(20))