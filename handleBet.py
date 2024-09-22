import sys
import re
import json
from library import Game, Player

bet = sys.argv[1]
game_data = sys.stdin.read().strip()
game = Game()
game.from_json(game_data)

game.placeBetFold(game.currentBet) if bet == 'call' else game.placeBetFold(None)

output = game.json()
    
print(output, flush=True)