# Vishva Natarajan
# Summer Internship 2017 @GaTech - RiboVision project
#ammavishva@gmail.com

from flask import Flask
from flask_restful import Resource,reqparse
from flask_jsonpify import jsonify

class FullTable(Resource):
      def __init__(self,**kwargs):
        self.db = kwargs['db'];
        self.conn = self.db.raw_connection();
    
      def get(self):
        try:
	    #parse input arguments FullTable
            parser = reqparse.RequestParser()
            parser.add_argument('FullTable', type=str)
            args = parser.parse_args();
            _FullTable = args['FullTable'];
            
            cur= self.conn.cursor();
            SQLStatement = 'SELECT * FROM %s' % (_FullTable)
            print(SQLStatement)
            cur.execute(SQLStatement)
            r = [dict((cur.description[i][0], value)
               for i, value in enumerate(row)) for row in cur.fetchall()]
            cur.close()
            return jsonify(r) 
        
        except Exception as e:
            return {'error': str(e)}

