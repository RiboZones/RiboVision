# Chad R. Bernier
# Ribovision 2.0 from COOL@GaTech
# chad.r.bernier@gmail.com

from flask import Flask, request, send_file, json
from flask_restful import Resource
import tempfile

class Save1D(Resource):
    def post(self):
        try:
            _content = json.loads(request.form.get('data', None), strict=False) # strict = False allow for escaped char
            svg = _content["svg"]
           
            tmp = tempfile.NamedTemporaryFile(delete=False, dir='/var/tmp')
            tmp.write(svg)
            tmp.seek(0)
            return send_file(tmp.name, as_attachment=True, 
                 attachment_filename='RiboVisionFigure1D.svg')
        except Exception as e:
            return {'error': str(e)}
