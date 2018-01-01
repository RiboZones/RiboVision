activate_this = '/var/www/ribovision/venv/bin/activate_this.py'
execfile(activate_this, dict(__file__=activate_this))

import sys, os
sys.path.insert(0, '/var/www/ribovision')
os.chdir('/var/www/ribovision')
from riboServer import app as application 

