# Petar Penev
# Ribovision 2.0 from COOL@GaTech
# peteripenev@gmail.com

from flask import jsonify, request
from flask_restful import Resource

class Chains(Resource):
      def __init__(self,**kwargs):
        self.db = kwargs['db'];
        self.cnx = self.db.raw_connection(); 
    
      def post(self):
        try:
           _content = request.get_json(force=True)
           cur = self.cnx.cursor();
           SQLStatement = 'SELECT MoleculeName, ChainName FROM ChainList \
                          WHERE StructureName = %s'
           cur.execute(SQLStatement,_content)
           r = [dict((cur.description[i][0], value) \
               for i, value in enumerate(row)) for row in cur.fetchall()]
           cur.close()
           return jsonify(r) 
        except Exception as e:
            return repr(e)

 