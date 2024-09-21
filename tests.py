from library import Game, Player, TestGame

names = ["Matt", "Jeremy", "Ryan", "Jackson"]
players = [Player(name, None, None, 1000, 0) for name in names]

game = Game(gameID=0, players=players, smallBlind=10, bigBlind=20)

game.newRound()
game.placeBetFold(20)
game.placeBetFold(20)
game.placeBetFold(20)
game.placeBetFold(0)

game.placeBetFold(0)
game.placeBetFold(0)
game.placeBetFold(30)
game.placeBetFold(30)
game.placeBetFold(None)
game.placeBetFold(60)
game.placeBetFold(60)
game.placeBetFold(60)

game.placeBetFold(60)
game.placeBetFold(60)
game.placeBetFold(60)

game.placeBetFold(200)
game.placeBetFold(200)
game.placeBetFold(400)
game.placeBetFold(400)
game.placeBetFold(400)


# class TestPlayer():
#     def __init__(self, user, handWorth, totalValue) -> None:
#         self.user = user
#         self.handWorth = handWorth
#         self.totalValue = totalValue

# lst = [
#     TestPlayer("Matt", 0, 20),
#     TestPlayer("Jeremy", 21200110013, 540),
#     TestPlayer("Ryan", 21200120013, 540),
#     TestPlayer("Jackson", 31302100000, 540)
# ]

# game.split_pot(lst)