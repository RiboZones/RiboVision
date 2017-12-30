# Chad R. Bernier
# Ribovision 2.0 from COOL@GaTech
# chad.r.bernier@gmail.com

from flask import Flask, jsonify, request
from flask_restful import Resource

class Interactions(Resource):
      def __init__(self,**kwargs):
        self.db = kwargs['db'];
        self.conn = self.db.raw_connection();
    
      def post(self):
        try:
           _content = request.get_json(force=True)
           cur = self.conn.cursor();
           SQLStatement = 'SELECT residue_i, residue_j, bp_type FROM Interactions \
               WHERE StructureName = %s and bp_group = %s'
           cur.execute(SQLStatement,_content)
           r = [dict((cur.description[i][0], value) \
               for i, value in enumerate(row)) for row in cur.fetchall()]
           cur.close()
           return jsonify(r) 
        except Exception as e:
            return repr(e)
 
class InteractionsMenu(Resource):
      def __init__(self,**kwargs):
        self.db = kwargs['db'];
        self.conn = self.db.raw_connection();
    
      def post(self):
        try:
           _content = request.get_json(force=True)
           cur = self.conn.cursor();
           SQLStatement = 'SELECT DISTINCT bp_group FROM Interactions \
               WHERE StructureName = %s'
           cur.execute(SQLStatement,_content)
           r = [dict((cur.description[i][0], value) \
               for i, value in enumerate(row)) for row in cur.fetchall()]
           cur.close()
           return jsonify(r) 
        except Exception as e:
            return repr(e)
 