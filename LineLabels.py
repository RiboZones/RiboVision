# Vishva Natarajan
# Summer Internship 2017 @GaTech - RiboVision project
#ammavishva@gmail.com

from flask import Flask
from flask_restful import Resource,reqparse
from flask_jsonpify import jsonify

class LineLabels(Resource):
      def __init__(self,**kwargs):
        self.db = kwargs['db'];
        self.conn = self.db.raw_connection();
    
      def get(self):
        try:
	    #parse input arguments LineLabels
            parser = reqparse.RequestParser()
            parser.add_argument('LineLabels', type=str)
            args = parser.parse_args();
            _LineLabels = args['LineLabels'];
            
            cur= self.conn.cursor();
            SQLStatement = 'SELECT * FROM %s' % (_LineLabels)
            print(SQLStatement)
            cur.execute(SQLStatement)
            r = [dict((cur.description[i][0], value)
               for i, value in enumerate(row)) for row in cur.fetchall()]
            cur.close()
            return jsonify(r) 
        
        except Exception as e:
            return {'error': str(e)}

