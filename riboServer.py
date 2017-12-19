# Vishva Natarajan
# Summer Internship 2017 @GaTech - RiboVision project
# ammavishva@gmail.com


# import modules required
from flask import Flask,render_template,send_from_directory
from flask_restful import Resource, Api, reqparse
from sqlalchemy import create_engine
from flask_cors import CORS, cross_origin
from json2html import *
from flaskext.mysql import MySQL

# import modules written for this project
from Residues import Residues
from SpeciesTable import SpeciesTable
from FetchMasterList import FetchMasterList
from StructureLookup import StructureLookup
from TextLabels import TextLabels
from LineLabels import LineLabels
from BasePairs import BasePairs
from FullTable import FullTable
from StructDataMenu import StructDataMenu

from SavePML import SavePML

from config import SQLConfig

#for database test purposes
from test import Test

# create database engine (SQLAlchemy db pool)
sql_string = 'mysql://' + SQLConfig.USER_ID + ':' + SQLConfig.PASSWORD + '@' + SQLConfig.IP + '/' + SQLConfig.DB;
db = create_engine(sql_string, pool_recycle=270);

# Create instance of Flask class. 
app = Flask(__name__)
app = Flask(__name__, static_url_path='/static')
CORS(app)

@app.route('/<path:path>')
def redirect(path):
    return send_from_directory('./', path)

# Create instance of API from flask-restful
# flask-restful provides the modules that help us create easy APIs in Python and flask.

api = Api(app)

# Now, list the APIs provided, the route path, input arguments if any
# Here, we are passing the db object as an input argument. 

api.add_resource(Residues, '/RiboVision/v1.0/fetchResidues', resource_class_kwargs={ 'db': db });
api.add_resource(SpeciesTable, '/RiboVision/v1.0/speciesTable', resource_class_kwargs={ 'db': db });
api.add_resource(FetchMasterList, '/RiboVision/v1.0/fetchMasterList', resource_class_kwargs={ 'db': db });
api.add_resource(StructureLookup, '/RiboVision/v1.0/fetchStructureName', resource_class_kwargs={ 'db': db });
api.add_resource(TextLabels, '/RiboVision/v1.0/textLabels', resource_class_kwargs={ 'db': db });
api.add_resource(LineLabels, '/RiboVision/v1.0/lineLabels', resource_class_kwargs={ 'db': db });
api.add_resource(BasePairs, '/RiboVision/v1.0/basePairs', resource_class_kwargs={ 'db': db });
api.add_resource(FullTable, '/RiboVision/v1.0/fullTable', resource_class_kwargs={ 'db': db });
api.add_resource(StructDataMenu, '/RiboVision/v1.0/structdatamenu', resource_class_kwargs={ 'db': db });
api.add_resource(Test, '/RiboVision/v1.0/test', resource_class_kwargs={ 'db': db });
api.add_resource(SavePML, '/RiboVision/v1.0/savepml');


@app.route('/')
def main():
	return render_template('index.html')

# Start Server 
if __name__ == '__main__':
    app.run(debug=True)

