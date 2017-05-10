from flask import Flask, render_template,jsonify,json
from flaskext.mysql import MySQL

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

@app.route('/fetchMasterList', methods=['GET'])
def fetchMasterList():
    cur = mysql.get_db().cursor()
    cur.execute('''use crbernie_ribovision2''')
    cur.execute('''SELECT SpeciesName, DataSetType, StructureName, LoadString FROM crbernie_ribovision2.MasterTable''')
    r = [dict((cur.description[i][0], value) \
               for i, value in enumerate(row)) for row in cur.fetchall()]
    return jsonify(r)
    
if __name__ == "__main__":
    app.run(debug=True)
