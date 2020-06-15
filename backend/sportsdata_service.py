import datetime


class SportsDataService(object):
    def __init__(self, client, repo):
        self.client = client
        self.repo = repo

    def preload_seasons(self, count):
        current_year = datetime.datetime.now().year

        # add 1 to include the current year.
        range(current_year - count + 1, current_year + 1)

    def populate_season_team(self, year):
        data = self.client.fetch_season_stats_teams(year)
        self.repo.insert_team_seasons(data, year)
        return data

    def populate_season_player(self, year):
        data = self.client.fetch_season_stats_players(year)
        self.repo.insert_player_seasons(data, year)
        return data

    def get_team_season(self, year):
        data = self.repo.get_team_season(year)
        if not data:
            return self.populate_season_team(year)
        return data

    def get_player_season(self, year):
        data = self.repo.get_player_season(year)
        if not data:
            return self.populate_season_player(year)
        return data


if __name__ == '__main__':
    from sportsdata_client import SportsDataClient
    from sportsdata_repo import SportsDataRepository
    from secrets import SPORTSDATA_API_KEY as api_key

    client = SportsDataClient(api_key)
    repo = SportsDataRepository()
    service = SportsDataService(client, repo)

    data = service.get_player_season(2020)
    print(len(data))

