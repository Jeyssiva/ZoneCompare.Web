import logging


class Logger:
    def __init__(self):
        logging.basicConfig(
            level=logging.INFO,
            #format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            filename='service.log')

        self._logger = logging.getLogger()

    def log_exception(self, exception):
        self._logger.exception(exception)

    def log_error(self, message):
        self._logger.error(message)

    def log_warning(self, message):
        self._logger.warning(message)

    def log_debug(self, message):
        self._logger.debug(message)

    def log_info(self, message):
        self._logger.info(message)


