from library import Game, Player, TestGame

names = ["Matt", "Jeremy", "Ryan", "Jackson", "Luke", "Jack"]
players = [Player(name, None, None, 1000, 0) for name in names]

game = Game(gameID=0, players=players, smallBlind=10, bigBlind=20)

game.newRound()
gamejson = game.json()
game.from_json(gamejson)
print([(i._suit, i._num) for i in game.tableCards])
print(game.json())


print()
print()
print()
print()
print()
print()
game.placeBetFold(20)
game.placeBetFold(20)
game.newRound()
gamejson = game.json()
n = game.from_json(gamejson)
print([(i._suit, i._num) for i in game.tableCards])