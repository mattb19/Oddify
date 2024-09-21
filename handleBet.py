import sys
import re
import json
from library import Game, Player

def format_game_data(game_data):
    # Replace single quotes with double quotes
    formatted_data = re.sub(r"'", '"', game_data)
    
    # Replace True and False with true and false
    formatted_data = re.sub(r'\bTrue\b', 'true', formatted_data)
    formatted_data = re.sub(r'\bFalse\b', 'false', formatted_data)

    return formatted_data

def convertGame(data):
    players = [Player(**i) for i in data["players"]]
    del data["players"]
    return Game(**data, players=players)

# Read the bet from command line argument
bet = sys.argv[1]

# Read the game state from stdin
game_data = sys.stdin.read()
game_data = game_data.strip()
game_data = format_game_data(game_data)

try:
    game_data = json.loads(game_data[1:-1])
except json.JSONDecodeError as e:
    print(repr(game_data.strip()))
    print(f"JSON decode error: {e}", flush=True)
    sys.exit(1)

game = convertGame(game_data)
players = [i for i in game.players]
currentPlayer = players[game.currentPlayer]

response = ""

pot = game.pot

if bet == 'call':
    response = game.placeBetFold(game.currentBet)
else:
    raise ValueError("No!")


print(json.dumps(game.json()))
# raise ValueError(response)