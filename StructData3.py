# Chad R. Bernier
# Ribovision 2.0 from COOL@GaTech
# chad.r.bernier@gmail.com

from flask import Flask, jsonify, request
from flask_restful import Resource

class StructData3(Resource):
      def __init__(self,**kwargs):
        #self.db = kwargs['db'];  
        self.cnx = kwargs['cnx'];
    
      def post(self):
        try:
           _content = request.get_json(force=True)
           cur = self.cnx.cursor();
           SQLStatement = 'SELECT mi.map_index,Value from (SELECT map_index FROM SecondaryStructures WHERE SS_Table=%s) as mi \
              inner JOIN (SELECT map_index, Value FROM StructuralData3 WHERE StructureName = %s and VariableName=%s) \
               as sd WHERE mi.map_index=sd.map_index'
           
           cur.execute(SQLStatement,_content)
           r = [dict((cur.description[i][0], value) \
               for i, value in enumerate(row)) for row in cur.fetchall()]
           cur.close()
           return jsonify(r) 
        except Exception as e:
            return repr(e)
 

