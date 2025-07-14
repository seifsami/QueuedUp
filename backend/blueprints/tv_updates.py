from flask import Blueprint, jsonify, current_app
from tasks.tv_updates import main as update_tv_shows

tv_updates_blueprint = Blueprint('tv_updates_blueprint', __name__)

@tv_updates_blueprint.route('/run_tv_updates', methods=['POST'])
def run_tv_updates():
    """
    Manually trigger TV shows update job.
    This endpoint will be called by Heroku Scheduler daily, but only runs on the 1st of each month.
    """
    print("Manually triggering TV updates job")
    try:
        from datetime import datetime
        today = datetime.now()
        
        # Check if today is the 1st of the month before running
        if today.day != 1:  # Not the 1st
            print(f"📅 Today is the {today.day}. TV updates only run on the 1st of each month. Skipping...")
            return jsonify({
                "status": "skipped", 
                "message": f"TV updates only run on the 1st of each month. Today is the {today.day}"
            }), 200
        
        # It's the 1st of the month, run the updates
        print("📡 It's the 1st of the month! Running TV updates...")
        with current_app.app_context():
            update_tv_shows()
            
        return jsonify({
            "status": "success", 
            "message": "TV updates job completed successfully"
        }), 200
            
    except Exception as e:
        print(f"Error running TV updates: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 500 