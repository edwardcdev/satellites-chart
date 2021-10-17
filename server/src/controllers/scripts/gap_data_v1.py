import pandas as pd
import numpy as np
from datetime import datetime

import os.path
import sys


filename = str(sys.argv[1])
ext = str(sys.argv[2])


def getAvgs(data):
    sum = 0

    for idx, val in enumerate(data):
        sum += val[3]
        val.append(sum / (idx + 1))

    return data


def gapItems(filename, ext):
    if os.path.isfile(os.getcwd() + '/assets/' + filename + '.' + ext):
        # Define variants
        preSat = 0
        gdata = list()
        cdata = list()
        hcdata = list()
        hgdata = list()
        output = dict()

        df = pd.read_csv(os.getcwd() + '/assets/' + filename + '.csv',
                         parse_dates=[0], lineterminator='\n', index_col=None)

        # Get static variants
        headers = df.columns.values
        handoff = headers[-1]
        df[handoff] = df[handoff].apply(str).str.replace('\r', '')

        for idx, val in enumerate(df.values):
            if val[-1] == 'False' or val[-1] == 'FALSE':
                if val[1] != 0:
                    gdata.append(['Gap_' + str(idx + 1), preSat,
                                  val[1], abs(preSat - val[1])])
                    hgdata.append(abs(preSat - val[1]))

                cdata.append(['Gap_' + str(idx + 1), val[1], val[2], val[3]])
                hcdata.append(val[3])
            preSat = val[2]

        # Put results
        output['coverage'] = {
            'data': getAvgs(cdata),
            'title': 'Coverage Running Average',
            'type': 'line'
        }
        output['gap'] = {
            'data': getAvgs(gdata),
            'title': 'Gaps Running Average',
            'type': 'line'
        }
        output['coverage_histogram'] = {
            'data': hcdata,
            'title': 'Coverage Distribution',
            'type': 'histogram'
        }
        output['gap_histogram'] = {
            'data': hgdata,
            'title': 'Gaps Distribution',
            'type': 'histogram'
        }

        # Export Result as excel file
        cdata = pd.DataFrame(cdata)
        cdata = cdata.rename(
            columns={0: 'Gap', 1: 'Start', 2: 'End', 3: 'Duration', 4: 'Average'})
        cdata.to_csv("assets/gap-" + filename + '-' +
                     str(datetime.timestamp(datetime.now())) + ".csv", index=False)

        print(output)
    else:
        print("File not exist")
    sys.stdout.flush()


gapItems(filename, ext)
