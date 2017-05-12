from flask import Flask, render_template, jsonify, request, send_from_directory
import simplejson as json
from flaskext.mysql import MySQL
import os

mysql = MySQL()
app = Flask(__name__)
app.config['MYSQL_DATABASE_USER'] = 'crbernie_rvweb'
app.config['MYSQL_DATABASE_PASSWORD'] = 'OL!TaI7No*BF'
app.config['MYSQL_DATABASE_DB'] = 'crbernie_ribovision2'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'
mysql.init_app(app)

@app.route("/")
def main():
    return render_template('index.html')
    
@app.route('/<path:path>')
def redirect(path):
    cwd = os.getcwd()
    print cwd
    return send_from_directory('./', path)
    
@app.route('/fetchMasterList', methods=['GET'])
def fetchMasterList():
    cur = mysql.get_db().cursor()
    cur.execute('''use crbernie_ribovision2''')
    cur.execute('''SELECT SpeciesName, DataSetType, StructureName, LoadString FROM crbernie_ribovision2.MasterTable''')
    r = [dict((cur.description[i][0], value) \
               for i, value in enumerate(row)) for row in cur.fetchall()]
    return jsonify(r)

@app.route('/fetchStructure/<structure_hash>', methods=['GET'])
def fetchStructure(structure_hash):
    cur = mysql.get_db().cursor()
    query = 'SELECT StructureName, JmolState FROM crbernie_ribovision2.MasterTable WHERE LoadString = %s'
    cur.execute(query,structure_hash)
    r = [dict((cur.description[i][0], value) \
               for i, value in enumerate(row)) for row in cur.fetchall()]
    return jsonify(r)   
    
@app.route('/speciesTable', methods=['POST'])
def speciesTable():
    cur = mysql.get_db().cursor()
    query = 'SELECT * FROM crbernie_ribovision2.SpeciesTables2 WHERE SS_Table = %s OR SS_Table = %s'
    content = request.get_json('content')
    cur.execute(query,content)
    r = [dict((cur.description[i][0], value) \
                for i, value in enumerate(row)) for row in cur.fetchall()]
    return jsonify(r)    

@app.route('/fetchResidues/<structure_hash>', methods=['GET'])
def fetchResidues(structure_hash):
    cur = mysql.get_db().cursor()
    query = 'SELECT * FROM %s' % (structure_hash)
    cur.execute(query)
    r = [dict((cur.description[i][0], value) \
               for i, value in enumerate(row)) for row in cur.fetchall()]
    return jsonify(r)
    
if __name__ == "__main__":
    app.run(debug=True)
