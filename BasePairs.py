# Vishva Natarajan
# Summer Internship 2017 @GaTech - RiboVision project
# ammavishva@gmail.com


from flask import Flask
from flask_restful import Resource,reqparse
from flask_jsonpify import jsonify

class BasePairs(Resource):
      def __init__(self,**kwargs):
        self.db = kwargs['db'];
        self.conn = self.db.raw_connection();
    
      def get(self):
        try:
	    #parse input arguments BasePairs
            parser = reqparse.RequestParser()
            parser.add_argument('BasePairs', type=str)
            parser.add_argument('ProtChain', type=str)
            args = parser.parse_args();   
            
            _ProtChain = args['ProtChain'];
            _BasePairs = args['BasePairs'];

            if _ProtChain is None:
              SQLStatement = 'SELECT * FROM %s' % (_BasePairs)
            else:
              SQLStatement = 'SELECT %s FROM %s' % (_ProtChain,_BasePairs)

            print('***SQLStatement='+ SQLStatement) 
            cur= self.conn.cursor();
            cur.execute(SQLStatement)
            r = [dict((cur.description[i][0], value)
               for i, value in enumerate(row)) for row in cur.fetchall()]
            cur.close()
            return jsonify(r) 
        
        except Exception as e:
            return {'error': str(e)}

