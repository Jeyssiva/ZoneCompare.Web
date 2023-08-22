import cv2
import base64
from matplotlib import pyplot as plt

class Helper:
    @staticmethod
    def img_base64str(region_image):
        try:
            result_buffer = Helper.encode_ndarray(region_image)
            base64_str = base64.b64encode(result_buffer).decode()
            return base64_str
        except Exception as ex:
            self._logger.log_error(ex.args[0])

    @staticmethod
    def encode_ndarray(ndarray):
        _, buffer = cv2.imencode('.png', ndarray)
        return buffer
