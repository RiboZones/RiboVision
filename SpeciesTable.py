
from flask import Flask
from flask_restful import Resource,reqparse
from sqlalchemy import create_engine
from flaskext.mysql import MySQL

class SpeciesTable(Resource):
      def __init__(self,**kwargs):
        self.db = kwargs['db'];
        self.conn = self.db.raw_connection();
    
      def post(self):
        try:
                   
           # Parse the arguments
           parser = reqparse.RequestParser();
           parser.add_argument('content', type=str);
           args = parser.parse_args();
           _content = args['content'];

           cur= self.conn.cursor();
           SQLStatement = 'SELECT * FROM SpeciesTables2 WHERE SS_Table = %s OR SS_Table = %s'
           cur.execute(SQLStatement,content)
           r = [dict((cur.description[i][0], value) \
                for i, value in enumerate(row)) for row in cur.fetchall()]
           return jsonify(r)    
        except Exception as e:
            return {'error': str(e)}
