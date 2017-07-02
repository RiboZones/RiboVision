# Vishva Natarajan
# Summer Internship 2017 @GaTech - RiboVision project
# ammavishva@gmail.com

from flask import Flask
from flask_restful import Resource,reqparse
from sqlalchemy import create_engine
from flaskext.mysql import MySQL

class StructureLookup(Resource):
      def __init__(self,**kwargs):
        self.db = kwargs['db'];
        self.conn = self.db.raw_connection();
    
      def get(self):
        try:
           #parse input arguments structure_hash
            parser = reqparse.RequestParser();
            parser.add_argument('structure_hash', type=str)
            args = parser.parse_args();
            _structure_hash = args['structure_hash'];
           
            cur= self.conn.cursor();
	    SQLStatement = 'SELECT StructureName, JmolState FROM MasterTable WHERE LoadString = %s' % (_structure_hash)
            cur.execute(SQLStatement)
            r = [dict((cur.description[i][0], value) \
               for i, value in enumerate(row)) for row in cur.fetchall()]
            return jsonify(r) 
        except Exception as e:
            return {'error': str(e)}
