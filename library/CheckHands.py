class CheckHands:
    def isRoyalFlush(self, cards):
        """
        Check if the given cards form a Royal Flush.

        Args:
            cards (list[Card]): List of Card objects.

        Returns:
            list: A list where the first element is a boolean indicating if it's a Royal Flush,
                  and the second element is a score value.
        """
        card_values = [card.getValue() for card in cards]
        suits = [card.getSuit() for card in cards]
        
        # Sort card values and suits
        card_values.sort()
        suits.sort(reverse=True)
        
        # Check for Royal Flush
        is_flush = True if 5 in [suits.count(i) for i in suits] else False
        is_straight = (card_values[-1] == 14 and 
                       card_values == list(range(card_values[0], card_values[0] + 5)))
        
        if is_flush and is_straight:
            return [True, 10**37]
        
        return [False, 0]

    def isStraightFlush(self, cards):
        """
        Check if the given cards form a Straight Flush.

        Args:
            cards (list[Card]): List of Card objects.

        Returns:
            list: A list where the first element is a boolean indicating if it's a Straight Flush,
                  and the second element is a score value.
        """
        card_values = [card.getValue() for card in cards]
        suits = [card.getSuit() for card in cards]
        
        card_values.sort()
        suits.sort(reverse=True)
        
        # Check for Straight Flush
        for i in range(len(card_values) - 4):
            if (all(card_values[i + j] + 1 == card_values[i + j + 1] for j in range(4)) and
                all(suit == suits[i] for suit in suits[i:i+5])):
                return [True, 9 * 10**10 + card_values[i + 4]]
        
        return [False, 0]

    def isQuads(self, cards):
        """
        Check if the given cards contain Four of a Kind.

        Args:
            cards (list[Card]): List of Card objects.

        Returns:
            list: A list where the first element is a boolean indicating if it's Four of a Kind,
                  and the second element is a score value.
        """
        card_values = [card.getValue() for card in cards]
        count_values = {value: card_values.count(value) for value in set(card_values)}
        
        quads = [value for value, count in count_values.items() if count == 4]
        if quads:
            quads_value = quads[0]
            remaining_cards = [value for value in card_values if value != quads_value]
            remaining_cards.sort(reverse=True)
            high_card = remaining_cards[0]
            return [True, 8 * 10**10 + quads_value * 10**8 + high_card * 10**6]
        
        return [False, 0]

    def isFullHouse(self, cards):
        """
        Check if the given cards form a Full House.

        Args:
            cards (list[Card]): List of Card objects.

        Returns:
            list: A list where the first element is a boolean indicating if it's a Full House,
                  and the second element is a score value.
        """
        card_values = [card.getValue() for card in cards]
        count_values = {value: card_values.count(value) for value in set(card_values)}
        
        three_of_a_kind = [value for value, count in count_values.items() if count == 3]
        pair = [value for value, count in count_values.items() if count == 2]
        
        if three_of_a_kind and pair:
            three_value = three_of_a_kind[0]
            pair_value = pair[0]
            if three_value < pair_value:
                three_value, pair_value = pair_value, three_value
            return [True, 7 * 10**10 + three_value * 10**8 + pair_value * 10**6]
        
        return [False, 0]

    def isFlush(self, cards):
        """
        Check if the given cards form a Flush.

        Args:
            cards (list[Card]): List of Card objects.

        Returns:
            list: A list where the first element is a boolean indicating if it's a Flush,
                  and the second element is a score value.
        """
        suits = [card.getSuit() for card in cards]
        card_values = [card.getValue() for card in cards]
        
        flush_suit = next((suit for suit in set(suits) if suits.count(suit) == 5), "")
        if not flush_suit:
            return [False, 0]
        
        flush_values = [value for card, value in zip(cards, card_values) if card.getSuit() == flush_suit]
        flush_values.sort(reverse=True)
        
        return [True, 6 * 10**10 + sum(v * 10**(i * 2) for i, v in enumerate(flush_values))]

    def isStraight(self, cards):
        """
        Check if the given cards form a Straight.

        Args:
            cards (list[Card]): List of Card objects.

        Returns:
            list: A list where the first element is a boolean indicating if it's a Straight,
                  and the second element is a score value.
        """
        card_values = [card.getValue() for card in cards]
        card_values.sort()
        
        for i in range(len(card_values) - 4):
            if all(card_values[i + j] + 1 == card_values[i + j + 1] for j in range(4)):
                return [True, 5 * 10**10 + card_values[i + 4]]
        
        return [False, 0]

    def isTrips(self, cards):
        """
        Check if the given cards contain Three of a Kind.

        Args:
            cards (list[Card]): List of Card objects.

        Returns:
            list: A list where the first element is a boolean indicating if it's Three of a Kind,
                  and the second element is a score value.
        """
        card_values = [card.getValue() for card in cards]
        count_values = {value: card_values.count(value) for value in set(card_values)}
        
        trips = [value for value, count in count_values.items() if count == 3]
    
        if trips:
            trips_value = trips[0]
            remaining_cards = [value for value in card_values if value != trips_value]
            remaining_cards.sort(reverse=True)
            high_card1, high_card2 = remaining_cards[:2]
            return [True, 4 * 10**10 + trips_value * 10**8 + high_card1 * 10**6 + high_card2 * 10**4]
        
        return [False, 0]

    def isTwoPair(self, cards):
        """
        Check if the given cards contain Two Pair.

        Args:
            cards (list[Card]): List of Card objects.

        Returns:
            list: A list where the first element is a boolean indicating if it's Two Pair,
                  and the second element is a score value.
        """
        card_values = [card.getValue() for card in cards]
        count_values = {value: card_values.count(value) for value in set(card_values)}
        
        pairs = [value for value, count in count_values.items() if count == 2]
        if len(pairs) == 2:
            pair1, pair2 = sorted(pairs, reverse=True)
            remaining_cards = [value for value in card_values if value not in pairs]
            remaining_cards.sort(reverse=True)
            high_card = remaining_cards[0]
            return [True, 3 * 10**10 + pair1 * 10**8 + pair2 * 10**6 + high_card * 10**4]
        
        return [False, 0]

    def isPair(self, cards):
        """
        Check if the given cards contain One Pair.

        Args:
            cards (list[Card]): List of Card objects.

        Returns:
            list: A list where the first element is a boolean indicating if it's One Pair,
                  and the second element is a score value.
        """
        card_values = [card.getValue() for card in cards]
        count_values = {value: card_values.count(value) for value in set(card_values)}
        
        pair = [value for value, count in count_values.items() if count == 2]
        if pair:
            pair_value = pair[0]
            remaining_cards = [value for value in card_values if value != pair_value]
            remaining_cards.sort(reverse=True)
            high_cards = remaining_cards[:3]
            return [True, 2 * 10**10 + pair_value * 10**8 + sum(v * 10**(i * 4) for i, v in enumerate(high_cards))]
        
        return [False, 0]

    def isHighCard(self, cards):
        """
        Check if the given cards form a High Card hand.

        Args:
            cards (list[Card]): List of Card objects.

        Returns:
            list: A list where the first element is a boolean indicating if the hand is a High Card,
                  and the second element is a score value based on the card values.
        """
        # Extract card values and sort them in descending order
        card_values = [card.getValue() for card in cards]
        card_values.sort(reverse=True)
        
        # Take the top 5 card values
        top_5_values = card_values[:5]
        
        # Assign sorted values to variables
        h1, h2, h3, h4, h5 = top_5_values
        
        # Calculate the score for a High Card
        # The base value is 10 billion, and we add the card values in decreasing order of significance
        score = 10000000000 + h1 * 1000000 + h2 * 10000 + h3 * 100 + h4 * 1
        
        return [True, score]
        

        
        