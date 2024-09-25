import json
import sys
from library import Game, Player

game_id = sys.argv[1]
buyin = int(sys.argv[2])
blind = float(sys.argv[3].strip('%')) / 100
player_names = sys.argv[4].split(',')

players = [Player(name, None, None, buyin, 0) for name in player_names+['Ryan', 'Jeremy', 'Jackson', 'Trent', 'David', 'Guest']]

game = Game(gameID=game_id, players=players, smallBlind=int(buyin*blind)//2, bigBlind=int(buyin*blind), host=player_names[0])

# game.shuffleDeck()
# game.dealCards()
game.newRound()

print(game.json())