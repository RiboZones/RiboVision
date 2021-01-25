# Vishva Natarajan
# Summer Internship 2017 @GaTech - RiboVision project
# ammavishva@gmail.com

from flask import Flask, jsonify, request
from flask_restful import Resource

class Residues(Resource):
      def __init__(self,**kwargs):
        self.db = kwargs['db'];
        self.cnx = self.db.raw_connection(); 

      def post(self):
        try:
            _content = request.get_json(force=True)
            cur= self.cnx.cursor();
            SQLStatement = 'SELECT ss.map_Index, ss.molName, resNum, X, Y, unModResName, modResName, MoleculeType, \
                MoleculeGroup, ChainName, Domain_RN, Domain_AN, Domains_Color, Helix_Num, Helix_Color, ss.SS_Table \
                FROM (SELECT * FROM SecondaryStructures WHERE SS_Table = %s) AS ss \
                INNER JOIN MoleculeNames AS mn ON ss.molName = mn.MoleculeName \
                INNER JOIN (SELECT MoleculeName, ChainName FROM ChainList \
                WHERE StructureName = (SELECT DISTINCT StructureName FROM Secondary_Tertiary WHERE SS_Table = %s)) \
                AS cl ON cl.MoleculeName = ss.molName \
                LEFT JOIN (SELECT * FROM StructuralData2 WHERE SS_Table = %s) AS sd ON sd.map_Index = ss.map_Index'
                
            cur.execute(SQLStatement,_content)
            r = [dict((cur.description[i][0], value)
               for i, value in enumerate(row)) for row in cur.fetchall()]
            cur.close()
            return jsonify(r)
         
        except Exception as e:
            return {'error': str(e)}
