# Vishva Natarajan
# Summer Internship 2017 @GaTech - RiboVision project
# ammavishva@gmail.com

from flask import Flask, jsonify, request
from flask_restful import Resource

class SpeciesTable(Resource):
      def __init__(self,**kwargs):
        self.db = kwargs['db'];
        self.conn = self.db.raw_connection();
    
      def post(self):
        try:     
           _content = request.get_json(force=True)
           cur = self.conn.cursor();
           SQLStatement = 'SELECT * FROM SecondaryStructureDetails WHERE SS_Table = %s OR SS_Table = %s'
           cur.execute(SQLStatement,_content)
           r = [dict((cur.description[i][0], value) \
               for i, value in enumerate(row)) for row in cur.fetchall()]
           cur.close()
           return jsonify(r)    
        except Exception as e:
            return repr(e)
