from django.db import models
from django.contrib.auth.models import AbstractUser


class AcademicYear(models.Model):
    title = models.CharField(max_length=100)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title  

# program
class Programme(models.Model):
    name = models.CharField(max_length=100, unique = True)
    number_of_years = models.IntegerField(default=3)

    class Meta:
        ordering = ['name']
    
    def __str__(self):
        return self.name
    
    
class User(AbstractUser):
    OTP = models.CharField(max_length=100, null=True, blank=True)
    role = models.CharField(max_length=100, default="user")
    registration_number = models.CharField(unique=True,max_length=100 , null=True, blank = True)
    student_number = models.CharField(unique = True, max_length=100, null= True, blank = True)
    programme = models.ForeignKey(Programme, on_delete=models.SET_NULL, null=True, blank=True)
    username = models.CharField(max_length=100, unique=True, null=True, blank=True)
    email = models.EmailField(unique=True)
    has_profile = models.BooleanField(default=False)

    REQUIRED_FIELDS = ["username"]
    USERNAME_FIELD = "email"
    
# common complaint fields 
class CommonComplaintIssue(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    year_of_study = models.CharField(max_length=100)
    seen = models.BooleanField(default=False)
    academic_year = models.ForeignKey(AcademicYear, on_delete=models.SET_NULL, null = True)
    status = models.CharField(max_length=100, default="pending") 

    class Meta:
        ordering = ['-created']     



# course 
class Course(models.Model):
    name = models.CharField(max_length=100, unique= True)
    code = models.CharField(max_length=100, unique=True) 
    semester = models.CharField(max_length=2)
    programme = models.ForeignKey(Programme, on_delete=models.CASCADE)
    lecturer = models.ForeignKey(User, on_delete=models.CASCADE)   
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    

    def __str__(self):
         return self.name
    

# tuition complaint 
class TuitionComplaint(CommonComplaintIssue):
    subject = models.CharField(max_length=100)
    details = models.TextField()
    attachment = models.FileField(upload_to="static/uploads/attachments")
    
    def __str__(self):
        return self.subject[0:20]
    

# missing marks complaint   
class MissingMarksComplaint(CommonComplaintIssue):
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    category = models.CharField(max_length=100)

    def __str__(self):
        return str(self.created)
    
    
# registration issues 
class RegistrationComplaint(CommonComplaintIssue):
    subject = models.CharField(max_length=100)
    details = models.TextField()
   
    def __str__(self):
        return self.subject[0:20]
    

class Notification(models.Model):
    severity = models.CharField(max_length=100)
    body = models.TextField()
    sent = models.DateTimeField(auto_now=True)
    reciever = models.ForeignKey(User, on_delete=models.CASCADE)
    is_viewed = models.BooleanField(default=False)

    class Meta:
        ordering = ['-sent']      

    def __str__(self):
        return self.body[0:20]
    

  





