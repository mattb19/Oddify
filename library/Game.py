import random
import time
import json
from library import Card, Player, CheckHands
from copy import deepcopy
from itertools import groupby

class Game:
    def __init__(self, gameID, players, smallBlind, bigBlind, deck=None, pot=0, currentBet=0, round=0, currentPlayer=None, tableCards=None, 
                 lastWinners=None, playerQueue=None, active=False, blinds=None, flip=True, abilities="ON", style="TEXAS HOLD'EM", bombPot=False, 
                 flop1=None, flop2=None, flop3=None, turn=None, river=None, Time=0) -> None:
        """
        Initializes a new game instance with the provided parameters.

        Args:
            gameID (int): Unique identifier for the game.
            players (list of Player): List of players participating in the game.
            smallBlind (int): Amount for the small blind.
            bigBlind (int): Amount for the big blind.
            deck (list of Card, optional): List of cards in the deck. Defaults to an empty list.
            pot (int, optional): Total amount in the pot. Defaults to 0.
            currentBet (int, optional): Current bet amount. Defaults to 0.
            round (int, optional): The current round number. Defaults to 0.
            currentPlayer (Player, optional): The player whose turn it is. Defaults to None.
            tableCards (list of Card, optional): Cards on the table. Defaults to an empty list.
            lastWinners (list of Player, optional): List of last winners. Defaults to an empty list.
            playerNames (list of str, optional): List of player names. Defaults to an empty list.
            playerCount (int, optional): Number of players in the game. Defaults to 0.
            playerQueue (list of Player, optional): Queue of players. Defaults to an empty list.
            active (bool, optional): Whether the game is active. Defaults to False.
            blinds (list of int, optional): List of blind amounts. Defaults to an empty list.
            flip (bool, optional): Whether the game involves flipping cards. Defaults to True.
            abilities (str, optional): Abilities available in the game. Defaults to "ON".
            style (str, optional): The style of the game (e.g., "TEXAS HOLD'EM"). Defaults to "TEXAS HOLD'EM".
            bombPot (bool, optional): Whether the game has a bomb pot feature. Defaults to False.
            flop1 (Card, optional): The first flop card. Defaults to a Card with no suit, number, or value.
            flop2 (Card, optional): The second flop card. Defaults to a Card with no suit, number, or value.
            flop3 (Card, optional): The third flop card. Defaults to a Card with no suit, number, or value.
            turn (Card, optional): The turn card. Defaults to a Card with no suit, number, or value.
            river (Card, optional): The river card. Defaults to a Card with no suit, number, or value.
            Time (int, optional): The time related to the game. Defaults to 0.
        """
        self.gameID = gameID
        self.players = players
        self.deck = deck if deck is not None else []
        self.pot = pot
        self.currentBet = currentBet
        self.round = round
        self.currentPlayer = currentPlayer
        self.tableCards = tableCards if tableCards is not None else []
        self.lastWinners = lastWinners if lastWinners is not None else []
        self.playerNames = [i.getUser().strip(' ') for i in self.players]
        self.playerCount = len(self.players)
        self.playerQueue = playerQueue if playerQueue is not None else []
        self.active = active
        self.blinds = blinds if blinds is not None else []
        self.flip = flip
        self.abilities = abilities
        self.style = style
        
        self.bombPot = bombPot
        
        self.flop1 = flop1 if flop1 is not None else Card("None", "None", 0)
        self.flop2 = flop2 if flop2 is not None else Card("None", "None", 0)
        self.flop3 = flop3 if flop3 is not None else Card("None", "None", 0)
        self.turn = turn if turn is not None else Card("None", "None", 0)
        self.river = river if river is not None else Card("None", "None", 0)
        
        self.smallBlind = smallBlind
        self.bigBlind = bigBlind
        
        self.Time = Time

    def shuffleDeck(self):
        """
        Creates a new deck of cards and shuffles it.

        A standard deck of 52 playing cards is generated, and the deck is shuffled once to ensure randomness.
        """
        suits = ["Hearts", "Diamonds", "Spades", "Clubs"]
        numbers = [2, 3, 4, 5, 6, 7, 8, 9, 10, "Jack", "Queen", "King", "Ace"]
        values = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]

        # Clear the deck before adding new cards
        self.deck.clear()

        # Add cards to the deck
        for suit in suits:
            for num, value in zip(numbers, values):
                self.deck.append(Card(suit, num, value))

        # Shuffle the deck
        random.shuffle(self.deck)

    def dealCards(self):
        """
        Deals two cards to each player from the deck.

        Cards are dealt from the end of the deck, with each player receiving two cards.
        """
        # Deal the first card to each player
        for player in self.players:
            player.setCard1(self.deck.pop())

        # Deal the second card to each player
        for player in self.players:
            player.setCard2(self.deck.pop())

    def newRound(self):
        """
        Initializes a new round of the game by resetting necessary attributes, dealing new cards,
        and updating blinds and bets. Handles player status, table cards, and sets up for a new betting round.
        """
        print("============= Initializing New Round =============")
        # Reset player hand worth and deal a new shuffled deck
        print("- Shuffling the deck and adding new players")
        self.shuffleDeck()
        self.players = [player for player in self.players if not player.getSpectate()] + self.playerQueue
        self.playerQueue = []

        print("- Resetting game status")
        # Reset round and game status
        self.round = 0
        self.pot = 0
        self.lastWinners = []
        self.tableCards = []

        print("- Rotating blinds")
        # Set player hands worth to 0
        for player in self.players:
            player.setHandWorthZero()

        # Initialize or rotate blinds
        if not self.active:
            self.players[0].setBlind(1)
            self.players[1].setBlind(2)
            self.active = True
        else:
            self.rotateBlinds()

        print("- Resetting player status'")
        # Set player turn and reset their bets
        for player in self.players:
            if player.getSpectate():
                player.setFolded()
            else:
                player.setCurrentBetZero()
                player.setTurn(True)
                player.setAllIn(False)

        print("- Updating pot")
        # Set blinds and update pot
        for player in self.players:
            if player.getSpectate():
                continue
            if player.getBlind() == 1:
                player.setCurrentBet(self.smallBlind)
                player.setChipCount(player.getChipCount()-self.smallBlind)
                self.pot += self.smallBlind
            elif player.getBlind() == 2:
                player.setCurrentBet(self.bigBlind)
                player.setChipCount(player.getChipCount()-self.bigBlind)
                self.pot += self.bigBlind

        self.currentBet = self.bigBlind

        print("- Dealing cards")
        # Set table cards to face down
        self.flop1 = self.flop2 = self.flop3 = self.turn = self.river = Card("None", "None", 0)

        # Deal new cards to players
        self.dealCards()

        # Determine flop, turn, and river cards
        self.tableCards = [self.deck.pop() for _ in range(5)]

        # Set current player to the one after the big blind
        self.setCurrentPlayer()

        # Handle bomb pot if applicable
        if self.bombPot:
            time.sleep(5)
            for player in self.players:
                if not player.getSpectate():
                    bet_amount = 0.10 * 1000
                    self.placeBetFold(bet_amount)
                    
        print("============= PRE FLOP =============")

    def rotateBlinds(self):
        """
        Rotates the blinds to the next players.
        """
        for i, player in enumerate(self.players):
            if player.getBlind() == 1:
                player.setBlind(0)
                self.players[(i + 1) % len(self.players)].setBlind(1)
                self.players[(i + 2) % len(self.players)].setBlind(2)

    def setCurrentPlayer(self):
        """
        Determines and sets the current player who will act first in the round.
        """
        # Find the index of the player with the big blind
        big_blind_index = next((i for i, p in enumerate(self.players) if p.getBlind() == 2), None)
        
        if big_blind_index is not None:
            # Determine the next player, wrapping around if needed
            start_index = (big_blind_index + 1) % len(self.players)
            
            # Find the next non-spectating player
            for offset in range(len(self.players)):
                current_index = (start_index + offset) % len(self.players)
                if not self.players[current_index].getSpectate():
                    self.currentPlayer = current_index
                    return
        
        # Fallback: set the first non-spectating player if none found
        self.currentPlayer = next((i for i, p in enumerate(self.players) if not p.getSpectate()), None)    
    
    def placeBetFold(self, value):
        """
        Handles a player's betting actions: fold, check, call, raise, or all-in. Updates the player's status, 
        modifies the pot, and sets the current bet. Also determines the next player to act.

        Args:
            value (float): The amount of money the player wants to bet or raise, or `None` if they are folding.
        
        Returns:
            str: A message indicating the outcome of the player's action, or an error message if applicable.
        """
        if self.round == 4 or not self.active:
            result = "Error: Invalid Bet Time"

        # Get the current player
        player = self.players[self.currentPlayer]

        if value is None:
            # Player folds
            player.setFolded()
            player.setTurn(False)
            result = f"{player.getUser()} Folds."
            
        elif value == 0 and player.getCurrentBet() == self.currentBet:
            # Player checks
            player.setTurn(False)
            result =  f"{player.getUser()} Checks."
        
        elif value == self.currentBet and value < player.getChipCount():
            # Player calls
            player.setChipCount(player.getChipCount()-(value - player.getCurrentBet()))
            player.setTurn(False)
            self.pot += value - player.getCurrentBet()
            player.setCurrentBet(self.currentBet)
            result =  f"{player.getUser()} Calls {value}! {player.getUser()}'s current bet is {self.currentBet}. Pot is {self.pot}"
        
        elif value > self.currentBet and value < player.getChipCount():
            # Player raises
            player.setChipCount(player.getChipCount()-(value - player.getCurrentBet()))
            player.setTurn(False)
            self.currentBet = value
            self.pot += value - player.getCurrentBet()
            player.setCurrentBet(self.currentBet)
            result =  f"{player.getUser()} Bets {value}! {player.getUser()}'s current bet is {self.currentBet}. Pot is {self.pot}"
        
        elif value - player.getCurrentBet() == player.getChipCount():
            # Player goes all-in
            player.setChipCount(0)
            player.setTurn(False)
            self.pot += value - player.getCurrentBet()
            self.currentBet = max(self.currentBet, value)
            player.setAllIn(True)
            player.setCurrentBet(value)
            result = f"{player.getUser()} IS ALL IN!"
            
        elif value + player.getCurrentBet() < self.currentBet:
            # Not enough to call or raise
            result = "You must put more in to call or raise"
        
        elif value > player.getChipCount():
            # Insufficient funds
            result = "Insufficient Funds"
        
        # Set turns for remaining players
        for p in self.players:
            if not p.getSpectate() and p.getCurrentBet() and p.getCurrentBet() < self.currentBet:
                p.setTurn(True)
        
        message = self.proceedToNextStage()
        return result+"\n"+message if message else result
        
    def proceedToNextStage(self): 
        """
        Proceed to the next stage of the game round based on the current state of the players and their actions.
        
        This function evaluates the current game conditions, including player actions such as folding, going all-in, 
        or calling, and determines the next stage of the round. It handles the transition between the flop, turn, and river,
        resetting players' current bets as needed, and manages the flow of the game accordingly.
        """
        
        # Get the current turn status of each player
        turns = [i.getTurn() for i in self.players]
        
        # Determine current players who have not folded and have a current bet
        currentPlayers = [i for i in self.players if i.getCurrentBet() is not None]

        # If only one player remains, end the hand
        if len(currentPlayers) == 1:
            self.round = 4  # Set round to end
            return self.endHand()
        
        # Check if all players still in the game are all-in
        allinPlayers = [i for i in self.players if i.getAllIn() is True]
        nonFolded = [i for i in self.players if i.getCurrentBet() is not None]
        
        # If all players are all-in or all but one are all-in and it is no ones turn
        if (len(allinPlayers) == len(nonFolded)) or (len(allinPlayers) + 1 == len(nonFolded) and True not in turns):
            while self.round < 4:
                if self.round == 0: #If Pre Flop
                    # Deal the flop (first three community cards)
                    self.flop1 = self.tableCards[0]
                    self.flop2 = self.tableCards[1]
                    self.flop3 = self.tableCards[2]
                    self.round = 1  # Move to the next round
                    
                if self.round == 1: # If Flop
                    # Deal the turn (fourth community card)
                    self.turn = self.tableCards[3]
                    self.round += 1
                    
                if self.round == 2: # If Turn
                    # Deal the river (fifth community card)
                    self.river = self.tableCards[4]
                    self.round += 1
                    
                if self.round == 3: # If River
                    # End the current round
                    self.round = 4
                    return self.endRound()
        
        # If all players have called, checked, or folded
        if True not in turns:
            # If it's the first round and there was a bomb pot, reset it
            if self.bombPot and self.round == 0:
                self.bombPot = False
                time.sleep(5)  # Delay for UI updates
                
            # Find the index of the player who posted the blind
            l = [i.getBlind() for i in self.players]
            blindIndex = l.index(1)
            c = blindIndex
            
            # Find the next active player
            while True:
                if self.players[c].getCurrentBet() is not None and not self.players[c].getAllIn():
                    break
                else:
                    # Wrap around if at the end of the player list
                    c = 0 if c == len(self.players) - 1 else c + 1

            # Update the current player and reset current bet
            self.currentPlayer = c
            self.currentBet = 0

            # Deal community cards based on the round
            if self.round == 0:
                self.flop1 = self.tableCards[0]
                self.flop2 = self.tableCards[1]
                self.flop3 = self.tableCards[2]
            elif self.round == 1:
                self.turn = self.tableCards[3]
            elif self.round == 2:
                self.river = self.tableCards[4]
            
            # If it's the last rotation, end the round
            if self.round == 3:
                for i in self.players:
                    if not i.getSpectate() and i.getCurrentBet() is not None:
                        i.setCurrentBetZero()
                
                self.round = 4  # Move to end the hand
                return self.endHand()

            self.round += 1  # Move to the next round
            
            # Output the stage of the game
            if self.round == 1:
                result = "============= FLOP ============="
            elif self.round == 2:
                result = "============= TURN ============="
            elif self.round == 3:
                result = "============= RIVER ============="

            # Reset current bets for players who are not all-in or spectating
            for i in self.players:
                if i.getCurrentBet() is not None and not i.getAllIn() and not i.getSpectate():
                    i.setCurrentBetZero()
                    i.setTurn(True)
                elif i.getAllIn():
                    i.setCurrentBetZero()
            return result
        
        # Determine who's turn is next
        counter = self.currentPlayer
        while True:
            if counter == len(self.players) - 1:
                self.currentPlayer = turns.index(True)  # Move to the first player who has not acted
                return None
            elif turns[counter + 1] == False:
                counter += 1  # Move to the next player
                continue
            elif turns[counter + 1] == True:
                counter += 1
                self.currentPlayer = counter  # Update the current player
                return None
 
    def endHand(self):
        """
        Ends the current hand by determining the winner(s), distributing the winnings,
        and resetting player statuses and game state for the next hand.
        """
        print("============= END OF ROUND =============")
        # Filter out players who have a valid bet
        finalPlayers = [p for p in self.players if p.getCurrentBet() is not None]
        
        # Initialize hand evaluator
        check = CheckHands()
        
        print("- Evaluating hands")
        # Evaluate each player's hand
        for player in finalPlayers:
            cards = [self.tableCards[0], self.tableCards[1], self.tableCards[2], 
                    self.tableCards[3], self.tableCards[4], player.getCard1(), player.getCard2()]
            
            # Check hand strength and update player's hand worth
            hand_functions = [
                check.isRoyalFlush, check.isStraightFlush, check.isQuads,
                check.isFullHouse, check.isFlush, check.isStraight,
                check.isTrips, check.isTwoPair, check.isPair, check.isHighCard
            ]
            
            for hand_function in hand_functions:
                is_hand, worth = hand_function(cards)
                if is_hand:
                    player.setHandWorth(worth)
                    break
        
        print("- Distributing winnings")
        winnings = self.split_pot(finalPlayers)
        
        print(winnings)
        
        for name, take in winnings.items():
            for i in self.players:
                if i.user == name:
                    i.setChipCount(i.chipCount+take)
        
        for player in self.players:
            player.setCurrentBetZero()
            player.setHandWorthZero()

    def split_pot(self, winners):
        """
        Splits the pot among the winning players, handling all-in scenarios and prioritizing based on hand worth.

        Args:
            winners (list of Player): List of players who are currently in the hand.

        Returns:
            dict: A dictionary with player usernames as keys and their respective winnings as values.
        """

        # Sort winners by hand worth, and by currentBet if worths are equal
        # The sorting ensures that players with higher hand worth come first,
        # and in case of ties, the player with the higher currentBet comes first.
        winners_sorted = sorted(winners, key=lambda player: (player.handWorth, -player.currentBet), reverse=True)

        # Group sorted winners by hand worth
        grouped_winners = {key: list(group) for key, group in groupby(winners_sorted, key=lambda player: player.handWorth)}

        # Distribution dictionary to track winnings for each player
        distribution = {i.user: 0 for i in winners_sorted}
        # Iterate over each group of players with the same hand worth
        for group in grouped_winners.values():
            # Create a new dictionary to group players by their currentBet
            new_dict = {player.currentBet: [] for player in group}
            # This dictionary will hold lists of players for each unique currentBet value.

            # Populate the new_dict with players based on their currentBet
            for i in group:
                new_dict[i.currentBet].append(i)
            # Copy result to a new dictionary for processing
            result_dict = {key: players[:] for key, players in new_dict.items()}
            # Combine players with lower currentBet with those of higher currentBet
            for lower_key in sorted(result_dict.keys()):
                for higher_key in sorted(result_dict.keys()):
                    if higher_key > lower_key:
                        result_dict[lower_key].extend(result_dict[higher_key])
            # This step effectively combines players who have lower bets into the higher bet groups.
            # Remove duplicates from result_dict
            result_dict = {key: list(set(players)) for key, players in result_dict.items()}
            # This ensures that each player appears only once in the resulting list.

            # Create a new dictionary with differences in currentBet as keys
            my_dict = {}
            prev_key = None
            new_dict2 = []

            # Populate new_dict2 with the differences between successive keys
            # <PROBLEM> - This will not work if the difference is already an existing key. it will be overridden
            # Need to implement the algorithm using lists instead, rewriting the splitting logic
            for key in sorted(result_dict.keys()):
                # If prev_key is None, use the current key; otherwise, use the difference from prev_key
                new_dict2.append([key if prev_key is None else key - prev_key, result_dict[key]])
                prev_key = key
            
            # Distribute winnings based on the calculated groups in new_dict2
            for key, players in new_dict2:
                split = len(players)  # Number of players in this group
                take = key // split   # Calculate the amount each player will take

                final_player = players[-1]  # The last player in the list for special handling

                # Distribute winnings to each player in the current group
                for player in players:
                    for w in winners_sorted:
                        if take * split > w.currentBet:
                            # If total take exceeds the current bet of the player
                            distribution[player.user] += w.currentBet // split
                            # Add the share of the winnings to the player's distribution
                            if player == final_player:
                                w.currentBet = 0  # Set the currentBet of the last player to 0
                        else:
                            # If total take is less than or equal to the current bet
                            distribution[player.user] += take  # Distribute the full take to the player
                            if player == final_player:
                                w.currentBet -= take * split  # Deduct the distributed amount from the last player's currentBet

        return distribution  # Return the final distribution of winnings
     
    def getGameID(self):
        return self.gameID
    
    def getRound(self):
        return self.round
    
    def getPlayers(self):
        return self.players
    
    def getCurrentBet(self):
        return self.currentBet

    def getPot(self):
        return self.pot

    def getCurrentPlayer(self):
        return self.currentPlayer
    
    def getPlayerNames(self):
        return self.playerNames

    def getFlop1(self):
        return self.flop1
    
    def getFlop2(self):
        return self.flop2
    
    def getFlop3(self):
        return self.flop3
    
    def getTurn(self):
        return self.turn
    
    def getRiver(self):
        return self.river
    
    def getActive(self):
        return self.active

    def setFlop1(self, card):
        self.flop1 = card
    
    def getAbilities(self):
        return self.abilities
    
    def getBlinds(self):
        return str(self.bigBlind)+"/"+str(self.smallBlind)
    
    def getStyle(self):
        return self.style
    
    def setTime(self, Time):
        self.Time = Time
        
    def getTime(self):
        return self.Time
        
    def setFlop2(self, card):
        self.flop2 = card
        
    def setFlop3(self, card):
        self.flop3 = card
        
    def setTurn(self, card):
        self.turn = card
        
    def setRiver(self, card):
        self.river = card
    
    def getPlayerCount(self):
        return str(len(self.players)+len(self.playerQueue))+"/10"
    
    def getPlayerCountInt(self):
        return len(self.players)
    
    def setTableCards(self):
        self.tableCards = [i for i in self.tableCards]

    def setGameID(self, gameID):
        self.gameID = gameID
        
    def setPlayers(self, players):
        self.players = players
    
    def addPlayer(self, name):
        """
        Adds a player to the game if the game is active and the player name is unique.
        Maximum of 10 players allowed.
        """
        if len(self.players) >= 10 or name in self.playerNames:
            return None  # Early exit if conditions are not met

        player_image = '../static/PNG-cards-1.3/None_of_None.png'
        new_player = Player(name, player_image, player_image, self.buyIn, 0, currentBet=None)

        if self.active:
            self.playerQueue.append(new_player)
        else:
            self.players.append(new_player)

        return new_player  # Optionally return the added player for confirmation
    
    def isActive(self):
        return self.active
    
    def setBombPot(self):
        self.bombPot = True
    
    def activate(self):
        """
        Activates the game if there are at least two players.
        Starts a new round and returns a confirmation message.
        """
        if len(self.players) < 2:
            return "Error: Not Enough Players."
        
        self.newRound()
        return "Activated!"
    
    def json(self):
        """
        Serializes the game state into JSON format.
        Returns a dictionary representation of the game.
        """
        try:
            # Create a deep copy of the game instance
            game = deepcopy(self)

            # Set table cards
            game.setTableCards()
            
            # Prepare players for serialization
            game.setPlayers([player.__dict__ for player in game.getPlayers()])
            
            # Serialize the game to JSON format
            return json.loads(json.dumps(game, default=lambda o: o.__dict__))
        
        except TypeError as e:
            print(f"Serialization error: {e}")
            return None

    def reset(self, big, small, *players):
        """
        Resets the game state for a new hand.
        
        Parameters:
            big (int): The big blind value.
            small (int): The small blind value.
            players (list): A list of player objects to initialize the game with.
        """
        self.bigBlind = big
        self.smallBlind = small
        self.players = list(players)  # Use the provided players
        self.deck = []
        self.pot = 0
        self.currentBet = 0
        self.round = 0
        self.currentPlayer = 0
        self.tableCards = []
        self.lastWinners = []
        self.playerQueue = []
        self.active = True
        
        # Initialize table cards
        self.flop1 = Card("None", "None", 0)
        self.flop2 = Card("None", "None", 0)
        self.flop3 = Card("None", "None", 0)
        self.turn = Card("None", "None", 0)
        self.river = Card("None", "None", 0)

        # Update player names and count
        self.playerNames = [player.getUser() for player in self.players]
        self.playerCount = len(self.players)