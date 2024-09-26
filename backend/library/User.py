class User:
    def __init__(self, userID: int, userName: str, userEmail: str, userPassword: str) -> None:
        """
        Initialize a User object.

        Args:
            userID (int): The user's ID.
            userName (str): The user's name.
            userEmail (str): The user's email address.
            userPassword (str): The user's password.
        """
        self.userID = userID
        self.userName = userName
        self.userEmail = userEmail
        self.userPassword = userPassword
        self.bio = ""
        self.winCount = 0
        self.straightCount = 0
        self.flushCount = 0
        self.fullHouseCount = 0
        self.quadCount = 0
        self.straightFlushCount = 0
        self.royalFlushCount = 0
        self.muckCount = 0
        self.tenCount = 0
        self.bombPot = 0

    def get_user_id(self) -> int:
        """Return the user's ID."""
        return self.userID

    def set_user_id(self, value: int) -> None:
        """Set the user's ID."""
        self.userID = value

    def get_user_name(self) -> str:
        """Return the user's name."""
        return self.userName

    def set_user_name(self, value: str) -> None:
        """Set the user's name."""
        self.userName = value

    def get_user_email(self) -> str:
        """Return the user's email address."""
        return self.userEmail

    def set_user_email(self, value: str) -> None:
        """Set the user's email address."""
        self.userEmail = value

    def get_user_password(self) -> str:
        """Return the user's password."""
        return self.userPassword

    def set_user_password(self, value: str) -> None:
        """Set the user's password."""
        self.userPassword = value

    def get_bio(self) -> str:
        """Return the user's bio."""
        return self.bio

    def set_bio(self, value: str) -> None:
        """Set the user's bio."""
        self.bio = value

    def get_win_count(self) -> int:
        """Return the user's win count."""
        return self.winCount

    def set_win_count(self, value: int) -> None:
        """Set the user's win count."""
        self.winCount = value

    def get_straight_count(self) -> int:
        """Return the user's straight count."""
        return self.straightCount

    def set_straight_count(self, value: int) -> None:
        """Set the user's straight count."""
        self.straightCount = value

    def get_flush_count(self) -> int:
        """Return the user's flush count."""
        return self.flushCount

    def set_flush_count(self, value: int) -> None:
        """Set the user's flush count."""
        self.flushCount = value

    def get_full_house_count(self) -> int:
        """Return the user's full house count."""
        return self.fullHouseCount

    def set_full_house_count(self, value: int) -> None:
        """Set the user's full house count."""
        self.fullHouseCount = value

    def get_quad_count(self) -> int:
        """Return the user's quad count."""
        return self.quadCount

    def set_quad_count(self, value: int) -> None:
        """Set the user's quad count."""
        self.quadCount = value

    def get_straight_flush_count(self) -> int:
        """Return the user's straight flush count."""
        return self.straightFlushCount

    def set_straight_flush_count(self, value: int) -> None:
        """Set the user's straight flush count."""
        self.straightFlushCount = value

    def get_royal_flush_count(self) -> int:
        """Return the user's royal flush count."""
        return self.royalFlushCount

    def set_royal_flush_count(self, value: int) -> None:
        """Set the user's royal flush count."""
        self.royalFlushCount = value

    def get_muck_count(self) -> int:
        """Return the user's muck count."""
        return self.muckCount

    def set_muck_count(self, value: int) -> None:
        """Set the user's muck count."""
        self.muckCount = value

    def get_ten_count(self) -> int:
        """Return the user's ten count."""
        return self.tenCount

    def set_ten_count(self, value: int) -> None:
        """Set the user's ten count."""
        self.tenCount = value

    def get_bomb_pot(self) -> int:
        """Return the user's bomb pot count."""
        return self.bombPot

    def set_bomb_pot(self, value: int) -> None:
        """Set the user's bomb pot count."""
        self.bombPot = value
