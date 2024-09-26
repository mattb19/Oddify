class Card:
    def __init__(self, _suit: str, _num: int, _value: int) -> None:
        """
        Initialize a Card instance.

        Args:
            _suit (str): The suit of the card (e.g., 'Hearts', 'Diamonds').
            _num (int): The number or rank of the card (e.g., 2, 10, 12).
            _value (int): The value of the card (e.g., 2 for a 2 of Hearts, 10 for a 10 of Hearts).
        """
        self._suit = _suit
        self._num = str(_num)
        self._value = _value
        
    def getSuit(self) -> str:
        """
        Get the suit of the card.

        Returns:
            str: The suit of the card.
        """
        return self._suit
    
    def getNum(self) -> str:
        """
        Get the number or rank of the card.

        Returns:
            str: The number or rank of the card.
        """
        return self._num
    
    def getValue(self) -> int:
        """
        Get the value of the card.

        Returns:
            int: The value of the card.
        """
        return self._value
    
    def getId(self) -> list[str]:
        """
        Get a list identifier for the card consisting of number and suit.

        Returns:
            list[str]: A list with the number and suit of the card.
        """
        return [self._num, self._suit]
    
    def __str__(self) -> str:
        """
        Get the file path for the card's image.

        Returns:
            str: The file path to the image of the card.
        """
        return "../static/PNG-cards-1.3/" + self._num + "_of_" + self._suit + ".png"