from library import Game, Player, TestGame

names = ["Matt", "Jeremy", "Ryan", "Jackson", "Luke", "Jack"]
players = [Player(name, None, None, 1000, 0) for name in names]

game = Game(gameID=0, players=players, smallBlind=10, bigBlind=20)

game.newRound()

game.placeBetFold(20)
game.placeBetFold(20)
print(f"Current Bet: {game.currentBet}")
print(f"Current Player: {game.players[game.currentPlayer].user}")

pot = game.pot
print(pot)
game.placeBetFold(20)
print(game.pot)

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