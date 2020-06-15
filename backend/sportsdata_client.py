import requests
import json


base_url = 'https://api.sportsdata.io/v3/nba/stats/json/'
player_season_path = 'PlayerSeasonStats/'
team_season_path = 'TeamSeasonStats/'


class SportsDataClient(object):

    def __init__(self, api_key):
        self.api_key = api_key

    def fetch_season_stats_players(self, year):
        return self.__fetch_season_states(year, player_season_path)

    def fetch_season_stats_teams(self, year):
        return self.__fetch_season_states(year, team_season_path)

    def __fetch_season_states(self, year, path):
        url = base_url + path + str(year)
        resp = requests.get(url, params={
            'key': self.api_key
        })
        data = json.loads(resp.text)
        return data


if __name__ == '__main__':
    import os

    api_key = os.environ['SPORTS_API_KEY']

    client = SportsDataClient(api_key)

    data = client.fetch_season_stats_players(2020)
    print(data)

    data = client.fetch_season_stats_teams(2020)
    print(data)
