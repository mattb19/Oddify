from library.Game import Game
from library.Player import Player
from itertools import groupby

names = ["Matt", "Jeremy", "Jackson"]
players = [Player(name, None, None, 1000, 0) for name in names]

game = Game(gameID=0, players=players, smallBlind=10, bigBlind=20)

class TestPlayer:
    def __init__(self, user, handWorth, currentBet):
        self.user = user
        self.handWorth = handWorth
        self.currentBet = currentBet
# lst = [
#     TestPlayer("Player 1", 5, 0),264
#     TestPlayer("Player 2", 5, 0),614
#     TestPlayer("Player 3", 5, 0),1214
#     TestPlayer("Player 4", 3, 0),165
#     TestPlayer("Player 5", 3, 0),233
#     TestPlayer("Player 6", 3, 0),533
#     TestPlayer("Player 7", 2, 0),100
#     TestPlayer("Player 8", 2, 0)200
# ]

3600

lst = [
    TestPlayer("Player 1", 5, 100),
    TestPlayer("Player 2", 5, 200),
    TestPlayer("Player 3", 4, 300),
    TestPlayer("Player 4", 4, 400),
    TestPlayer("Player 5", 3, 500),
    TestPlayer("Player 6", 3, 600),
    TestPlayer("Player 7", 2, 700),
    TestPlayer("Player 8", 2, 800)
]
print(game.split_pot(lst))

# {
#     5: [[60, Player1, Player2, Player3], [40, Player2, Player3], [150, Player3]],
    
    
#     4: [[100,  Player4, Player5], [400, Player 5]],
# }