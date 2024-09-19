class Player:
    def __init__(self, user: str, card1, card2, chipCount: int, blind: int, currentBet: int = 0, handWorth: int = 0, 
                 turn: bool = False, allIn: bool = False, 
                 spectate: bool = False, muck: bool = False) -> None:
        """
        Initialize a Player object.

        Args:
            user (str): The username of the player.
            card1: The first card of the player.
            card2: The second card of the player.
            chipCount (int): The number of chips the player has.
            blind (int): The player's blind amount.
            currentBet (int, optional): The player's current bet. Defaults to 0.
            handWorth (int, optional): The worth of the player's hand. Defaults to 0.
            turn (bool, optional): Whether it's the player's turn. Defaults to False.
            allIn (bool, optional): Whether the player is all-in. Defaults to False.
            spectate (bool, optional): Whether the player is spectating. Defaults to False.
            muck (bool, optional): Whether the player has mucked their hand. Defaults to False.
        """
        self.user = user.strip()
        self.card1 = card1
        self.card2 = card2
        self.chipCount = chipCount
        self.blind = blind
        self.currentBet = currentBet
        self.handWorth = handWorth
        self.turn = turn
        self.allIn = allIn
        self.spectate = spectate
        self.muck = muck

    def getMuck(self) -> bool:
        """Return whether the player has mucked their hand."""
        return self.muck

    def setMuck(self, muck: bool) -> None:
        """Set whether the player has mucked their hand."""
        self.muck = muck

    def getHandWorth(self) -> int:
        """Return the worth of the player's hand."""
        return self.handWorth

    def setHandWorth(self, value: int) -> None:
        """Set the worth of the player's hand."""
        self.handWorth = value

    def setHandWorthZero(self) -> None:
        """Reset the worth of the player's hand to zero."""
        self.handWorth = 0
        
    def setCurrentBetZero(self) -> None:
        """Sets the player current bet value to zero."""
        self.currentBet = 0

    def getBlind(self) -> int:
        """Return the player's blind amount."""
        return self.blind

    def setBlind(self, blind: int) -> None:
        """Set the player's blind amount."""
        self.blind = blind

    def getSpectate(self) -> bool:
        """Return whether the player is spectating."""
        return self.spectate

    def setSpectate(self, value: bool) -> None:
        """Set whether the player is spectating."""
        self.spectate = value

    def getAllIn(self) -> bool:
        """Return whether the player is all-in."""
        return self.allIn

    def setAllIn(self, allIn: bool) -> None:
        """Set whether the player is all-in."""
        self.allIn = allIn

    def getTurn(self) -> bool:
        """Return whether it's the player's turn."""
        return self.turn

    def setTurn(self, turn: bool) -> None:
        """Set whether it's the player's turn."""
        self.turn = turn

    def getUser(self) -> str:
        """Return the username of the player."""
        return self.user

    def setUser(self, user: str) -> None:
        """Set the username of the player."""
        self.user = user.strip()

    def getCard1(self):
        """Return the player's first card."""
        return self.card1

    def setCard1(self, card1) -> None:
        """Set the player's first card."""
        self.card1 = card1

    def getCard2(self):
        """Return the player's second card."""
        return self.card2

    def setCard2(self, card2) -> None:
        """Set the player's second card."""
        self.card2 = card2

    def getChipCount(self) -> int:
        """Return the number of chips the player has."""
        return self.chipCount

    def setChipCount(self, chipCount: int) -> None:
        """Sets the total number of chips a player has."""
        self.chipCount = chipCount

    def getCurrentBet(self) -> int:
        """Return the player's current bet."""
        return self.currentBet

    def setCurrentBet(self, currentBet: int) -> None:
        """Sets the player's current bet."""
        self.currentBet = currentBet

    def setFolded(self) -> None:
        """Mark the player as having folded."""
        self.currentBet = None

    def getPlayerNum(self) -> int:
        """Return the player's number."""
        return self.playerNum

    def setPlayerNum(self, playerNum: int) -> None:
        """Set the player's number."""
        self.playerNum = playerNum
