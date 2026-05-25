from flask import Flask, make_response, request
from flask_cors import CORS
from config import Config
from extensions import db, jwt, migrate, mail # <-- Imported mail here
from routes.auth import auth_bp
from routes.listings import listings_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Apply global cross-origin resource mapping rules directly to the app instance
    CORS(app, resources={r"/api/*": {
        "origins": ["http://localhost:3000"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }})

    # Init Extensions
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    mail.init_app(app) # <-- Attached mail to app engine pipeline context

    # Force database file and tables creation on startup
    with app.app_context():
        db.create_all()

    @app.after_request
    def add_cors_headers(response):
        response.headers["Access-Control-Allow-Origin"] = "http://localhost:3000"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
        return response

    # Register Blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(listings_bp)

    return app

if __name__ == '__main__':
    application = create_app()
    application.run(debug=True, port=5001) # Bypasses AirPlay on port 5000