import os
from datetime import timedelta

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'super-secret-key-change-in-production')
    SQLALCHEMY_DATABASE_URI = 'sqlite:///classifieds.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'jwt-secret-key-change-in-production')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=2)
    
    # Mail Engine SMTP Configurations
    MAIL_SERVER = os.environ.get('MAIL_SERVER', 'sandbox.smtp.mailtrap.io')
    MAIL_PORT = int(os.environ.get('MAIL_PORT', 2525))
    MAIL_USE_TLS = os.environ.get('MAIL_USE_TLS', 'True') == 'True'
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME', 'your_mailtrap_username')
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD', 'your_mailtrap_password')
    MAIL_DEFAULT_SENDER = os.environ.get('MAIL_DEFAULT_SENDER', 'security@smartclassifieds.com')