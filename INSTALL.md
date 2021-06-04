# RiboVision2

## Installation notes written by Petar Penev in 2021.

Install the following:

1. Linux distribution (Native Linux system or <a href="https://docs.microsoft.com/en-us/windows/wsl/install-win10#update-to-wsl-2">WSL</a>)
	
	After it has been set up make sure it is updated:

>sudo apt-get update

>sudo apt-get upgrade

2. <a href=" https://code.visualstudio.com/docs/setup/setup-overview">Visual Studio Code</a> (VS Code)

3. Instal git and get an account on github.com. Contact the current admin to receive access to the project repository.

4. Ask for a config.py file from one of the admins (ppenev@gatech.edu or anton.petrov@biology.gatech.edu)

5. Install mysqlclient

> sudo apt-get install libmysqlclient-dev --fix-missing

6. Make a python2.7 virtual environment and install the requirements. You will need to already have a python2.7 installed somewhere and to know the location to its executable.

> virtualenv -p [path to python2.7 executable] venv

> source ./venv/bin/activate

> pip install -r requirements.txt

7. Set up GaTech VPN with the Cisco AnyConnect Secure Mobility Client. Follow <a href="https://faq.oit.gatech.edu/content/how-do-i-get-started-campus-vpn">these</a> instructions.

8. A development server from VS code should be able to run by starting the **Python: Flask** debugger.

If you are experiencing problems reach out to one of admins.

## Updating the online server

After changing files in the dev3 branch and pushing the changes online, log in Apollo1 and execute the following:

```bash
cd /var/www/ribovision/
sudo git fetch
sudo git pull
```

This should bring apollo.chemistry.gatech.edu/RiboVision2 up to speed.

## Adding new structure

Not more than 60 characters in species name!