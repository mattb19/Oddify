import sys
import re
import json
from library import Game, Player

bet = sys.argv[1]

game_data = sys.stdin.read().strip()
game = Game()
game.from_json(game_data)

if bet == 'CALL':
    game.placeBetFold(game.currentBet)
elif bet == 'FOLD':
    game.placeBetFold(None)
else:
    game.placeBetFold(int(bet))


output = game.json()
    
print(output, flush=True)