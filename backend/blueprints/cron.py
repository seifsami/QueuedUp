from flask import Blueprint, jsonify, current_app
from tasks.cron import update_trending_and_upcoming

cron_blueprint = Blueprint('cron_blueprint', __name__)

@cron_blueprint.route('/run_cron', methods=['POST'])
def run_cron():
    print("Manually triggering cron job")
    with current_app.app_context():
        mongo = current_app.extensions['pymongo']
        update_trending_and_upcoming(mongo)
    return jsonify({"status": "Cron job triggered manually"}), 200
