from library import Card, Player, CheckHands, Game

class TestGame:
    def __init__(self, game, players) -> None:
        self.game = game
              
    
    def test_all_in_split_pot(self, scenario_list, expected_results) -> bool:
        """
        Tests every all-in split pot scenario type and ensures chips are distributed correctly
        
        :param list[Player] scenario_list: A list of player objects to test with
        :param list[dict] expected_result: The list of expected results corresponding with the scenario list indices
        
        returns: True if all scenarios produce expected results are met, else False
        rtype: Boolean
        
        raises AssertionError: If a specific scenario fails
        """
        return True
    
    def test_all_in_betting(self, scenario_list, expected_results) -> bool:
        """
        Tests every all-in betting scenario and ensures players current bets are accurate
        
        :param list[list] scenario_list: A list of betting order lists to test with
        :param list expected_result: The list of expected results corresponding with the scenario list indices
        
        returns: True if all scenarios produce expected results are met, else False
        rtype: Boolean
        
        raises AssertionError: If a specific scenario fails
        """
        return True
    
    def test_folds(self, scenario_list, expected_results) -> bool:
        """
        Tests every fold scenario to make sure the game functions properly
        
        :param list[list] scenario_list: A list of betting order lists to test with
        :param list expected_result: The list of expected results corresponding with the scenario list indices
        
        returns: True if all scenarios produce expected results are met, else False
        rtype: Boolean
        
        raises AssertionError: If a specific scenario fails
        """
        return True
    
    def test_checks(self, scenario_list, expected_results) -> bool:
        """
        Tests every check scenario to make sure the game functions properly
        
        :param list[list] scenario_list: A list of betting order lists to test with
        :param list expected_result: The list of expected results corresponding with the scenario list indices
        
        returns: True if all scenarios produce expected results are met, else False
        rtype: Boolean
        
        raises AssertionError: If a specific scenario fails
        """
        return True
    
    def test_calls_and_bets(self, scenario_list, expected_results) -> bool:
        """
        Tests every call and bet scenario to make sure the game functions properly
        
        :param list[list] scenario_list: A list of betting order lists to test with
        :param list expected_result: The list of expected results corresponding with the scenario list indices
        
        returns: True if all scenarios produce expected results are met, else False
        rtype: Boolean
        
        raises AssertionError: If a specific scenario fails
        """
        return True