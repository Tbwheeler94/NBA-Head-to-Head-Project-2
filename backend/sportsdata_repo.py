import pymongo


conn_str = 'mongodb://localhost:27017'


class SportsDataRepository(object):

    def __init__(self, conn_str=conn_str):
        self.client = pymongo.MongoClient(conn_str)
        self.db = self.client.nbaDB

    def insert_team_seasons(self, data, year):
        self.db.team_seasons.update_one(
            {'_id': year},
            {'$set': { 'data': data}},
            upsert=True,
        )

    def insert_player_seasons(self, data, year):
        self.db.player_seasons.update_one(
            {'_id': year},
            {'$set': { 'data': data}},
            upsert=True,
        )

    def get_team_season(self, year):
        data = self.db.team_seasons.find_one({'_id': year})
        return data['data'] if data else None

    def get_player_season(self, year):
        data = self.db.player_seasons.find_one({'_id': year})
        return data['data'] if data else None


if __name__ == '__main__':
    mongo_conn = os.environ['MONGODB_URI']

    repo = SportsDataRepository(mongo_conn)
    data = repo.get_team_season(2020)
    print(data)
