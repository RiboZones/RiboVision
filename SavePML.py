# Chad R. Bernier
# Ribovision 2.0 from COOL@GaTech
# chad.r.bernier@gmail.com

from flask import Flask, request, send_file, json
from flask_restful import Resource
import tempfile

class SavePML(Resource):
    def post(self):
        try:
            #_content = request.form.get('data', None)
            #_content = request.get_json(force=True)
            _content = json.loads(request.form.get('data', None), strict=False) # strict = False allow for escaped char
            sn = _content["StructureName"]
            script = _content["script"]
           
            tmp = tempfile.NamedTemporaryFile(delete=False, dir='/var/tmp')
            tmp.write(script)
            tmp.seek(0)
            return send_file(tmp.name, as_attachment=True, 
                 attachment_filename='RiboVisionFigure.pml')
        except Exception as e:
            return {'error': str(e)}
