from backend.sportsdata_client import SportsDataClient
from backend.sportsdata_repo import SportsDataRepository
from backend.sportsdata_service import SportsDataService
from flask import Flask, jsonify
import os


api_key = os.environ['SPORTS_API_KEY']
mongo_conn = os.environ['MONGODB_URI']

service = SportsDataService(
    SportsDataClient(api_key),
    SportsDataRepository(mongo_conn),
)

app = Flask(
    __name__, 
    static_url_path='', 
    static_folder='../basketball-website/front_end/assets')

@app.after_request # blueprint can also be app~~
def after_request(response):
    header = response.headers
    header['Access-Control-Allow-Origin'] = '*'
    return response

@app.route('/players/<int:season>')
def players(season):
    data = service.get_player_season(season)
    return jsonify(data)


@app.route('/teams/<int:season>')
def teams(season):
    data = service.get_team_season(season)
    return jsonify(data)


if __name__ == '__main__':
   app.run()

