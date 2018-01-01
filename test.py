from flask import Flask, json, Response
from flask_jsonpify import jsonify
from flask_restful import Resource,reqparse

class Test(Resource):
      def __init__(self,**kwargs):
        #self.db = kwargs['db'];  
        self.cnx = kwargs['cnx'];

      def get(self):
       try:
         result = self.db.execute("select * from members");
         rList = [];
         for r in result:
            rDict = {
	     'make': r[0],
	     'model': r[1],
	     'type': r[2]
            };
            rList.append(rDict);
         return jsonify(data=rList);
       except Exception as e:
         return {'error': str(e)}
