import numpy as np
import json
import sys
from scipy import interpolate


params = str(sys.argv[1])


class NumpyEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        return json.JSONEncoder.default(self, obj)


def getPlot(params):
    data = list()
    params = json.loads(params)

    f = interpolate.interp2d(
        params['x'], params['y'], params['z'], kind='cubic')

    xnew = np.arange(np.amin(params['x']), np.amax(params['x']), 1)
    ynew = np.arange(np.amin(params['y']), np.amax(params['y']), 1)
    znew = f(xnew, ynew)

    data = json.dumps({"x": xnew, "y": ynew, "z": znew}, cls=NumpyEncoder)
    print(data)


getPlot(params)
