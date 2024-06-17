from rest_framework.serializers import ModelSerializer, EmailField, CharField
from .models import User, Course, Programme, TuitionComplaint, AcademicYear, Notification, MissingMarksComplaint, RegistrationComplaint

class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'    

class CourseSerializer(ModelSerializer):
    email = EmailField(source="lecturer.email", read_only = True)
    program = EmailField(source="programme.name", read_only = True)

    class Meta:
        model = Course
        fields = '__all__'

class ProgrammeSerializer(ModelSerializer):
    class Meta:
        model = Programme
        fields = '__all__'

class TuitionComplaintSerializer(ModelSerializer):
    year = CharField(source = "academic_year.title", read_only = True)
    registration_number = CharField(source = "student.registration_number", read_only = True)
    student_number = CharField(source = "student.student_number", read_only = True)
    email = CharField(source = "student.email", read_only = True)
    class Meta:
        model = TuitionComplaint
        fields = '__all__'

class RegistrationComplaintSerializer(ModelSerializer):
    year = CharField(source = "academic_year.title", read_only = True)
    registration_number = CharField(source = "student.registration_number", read_only = True)
    student_number = CharField(source = "student.student_number", read_only = True)
    email = CharField(source = "student.email", read_only = True)
    class Meta:
        model = RegistrationComplaint
        fields = '__all__'

class MissingMarksComplaintSerializer(ModelSerializer):
    year = CharField(source = "academic_year.title", read_only = True)
    registration_number = CharField(source = "student.registration_number", read_only = True)
    student_number = CharField(source = "student.student_number", read_only = True)
    email = CharField(source = "student.email", read_only = True)
    courseName = CharField(source = "course.name", read_only = True)
    academicYear  = CharField(source= "academic_year.title", read_only = True)
    semester  = CharField(source= "course.semester", read_only = True)
    class Meta:
        model = MissingMarksComplaint
        fields = '__all__'

class NotificationsSerializer(ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'

class YearsSerializer(ModelSerializer):
    class Meta:
        model = AcademicYear
        fields = '__all__'