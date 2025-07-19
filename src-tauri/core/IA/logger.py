import logging
import sys

class Logger:
    _instance = None
    _initialized = False

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self):
        if not Logger._initialized:
            self.logger = logging.getLogger('EPIA')
            self.logger.setLevel(logging.INFO)  # Default level
            
            # Create console handler
            console_handler = logging.StreamHandler(sys.stdout)
            formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
            console_handler.setFormatter(formatter)
            self.logger.addHandler(console_handler)
            
            Logger._initialized = True

    def setup_debug(self, debug_mode: bool):
        if debug_mode:
            self.logger.setLevel(logging.DEBUG)
        else:
            self.logger.setLevel(logging.INFO)

    def get_logger(self):
        return self.logger