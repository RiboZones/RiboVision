# Chad R. Bernier
# Ribovision 2.0 from COOL@GaTech
# chad.r.bernier@gmail.com

from flask import Flask, jsonify, request
from flask_restful import Resource

class StructDataMenu(Resource):
      def __init__(self,**kwargs):
        self.db = kwargs['db'];
        self.cnx = self.db.raw_connection(); 
        #self.cnx = kwargs['cnx'];
    
      def post(self):
        try:
           _content = request.get_json(force=True)
           cur = self.cnx.cursor();
           SQLStatement = 'SELECT StructDataMenu.StructDataName, StructDataMenuDetails.ColName, ColorList, IndexMode, ExtraArg, Description, HelpLink, StructureName \
               FROM StructDataMenu, StructDataMenuDetails, DataDescriptions \
               WHERE StructDataMenu.StructDataName = StructDataMenuDetails.StructDataName \
               AND StructDataMenuDetails.ColName = DataDescriptions.ColName \
               HAVING StructureName = %s'
           
           cur.execute(SQLStatement,_content)
           r = [dict((cur.description[i][0], value) \
               for i, value in enumerate(row)) for row in cur.fetchall()]
           cur.close()
           return jsonify(r) 
        except Exception as e:
            return repr(e)
