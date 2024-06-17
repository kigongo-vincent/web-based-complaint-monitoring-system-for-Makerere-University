installation

======================= backend config ========================

make sure you have python installed on your machine

if not, download it from the internet

run cd backend (make sure you are at the root of the project, when running this command)

run pip install -r requirements.txt

run py manage.py makemigrations app 

run py manage.py migrate

run py manage.py createsuperuser

follow the prompts provided to create the admin user of the app

======================= end backend config ====================



################## running the application ####################

run ./run.sh ( in a git bash terminal (make sure you have git installed when running this command) )

!!! if you donot have git installed, you can download it from the internet

if all goes well, you application should be running on http://localhost:5173

to access the admin page, login on http://localhost:8000/admin







