from django.shortcuts import render
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from .models import User
from rest_framework.response import Response
from django.core.mail import send_mail
from django.contrib.auth.hashers import make_password
from rest_framework import status
from rest_framework.decorators import api_view
from .serializers import UserSerializer,Notification, AcademicYear, YearsSerializer, NotificationsSerializer, CourseSerializer, Course, ProgrammeSerializer, Programme, TuitionComplaintSerializer, TuitionComplaint, MissingMarksComplaint, MissingMarksComplaintSerializer, RegistrationComplaint, RegistrationComplaintSerializer
import random


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims to the token payload
        token['role'] = user.role
        token['email'] = user.email
        token['student_number'] = user.student_number
        token['registration_number'] = user.registration_number
        token['programme'] = user.programme
        token['has_profile'] = user.has_profile

        return token
    
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

@api_view(["POST"])
def sign_up(request):
    try:
        if request.method == "POST":

            request.data["password"] = make_password(request.data["password"])
            request.data["OTP"] = random.randint(100000,999999)  #hint: randomize me

            if "students.mak.ac.ug" in request.data["email"]:
                request.data["role"] = "student"

            elif "cit.mak.ac.ug" in request.data["email"]:
                request.data["role"] = "lecturer"
    
            try:
                user = User.objects.get(email = request.data["email"])
            except:    
                user = None

            if user:
                user.OTP = request.data["OTP"]
                user.save()
                return Response(status=status.HTTP_201_CREATED)

            converted = UserSerializer(data = request.data)

            if converted.is_valid():
                new_user = converted.save()

                try:
                    subject = 'ACCOUNT CREATION ON ORPMS'
                    message = f'''
Dear {request.data['email'].split('@')[0].split('.')[0]},

Thank you for choosing the Online Research-Project Management System (ORPMS) for managing research projects. We are excited to have you on board!

Your verification code for logging into the ORPMS is:

Verification Code: {request.data["OTP"]}

Please keep this code secure and do not share it with anyone. It is essential for verifying your identity and ensuring the security of your account.

We understand the importance of safeguarding your property information, and we have implemented robust security measures to protect your data. If you have any questions or concerns regarding the security of our platform, please don't hesitate to reach out to us.

Once again, welcome to ORPMS! We look forward to providing you with a seamless property management experience.

Best regards,
The ORPMS Team
'''
                    email_from = 'ORPMS TEAM'
                    recipient_list = [request.data["email"]]

                    send_mail(subject, message, email_from, recipient_list)

                except:
                    pass
                    # return Response(status= status.HTTP_400_BAD_REQUEST)
                return Response(converted.data, status=status.HTTP_201_CREATED)        
            else:
                return Response(status= status.HTTP_403_FORBIDDEN)        
                                

                return Response(converted.data, status=status.HTTP_201_CREATED)
    except:
        return Response(status= status.HTTP_400_BAD_REQUEST)        

@api_view(['POST'])
def verify_otp(request):
    if request.method == "POST":
        try:
            OTP = request.data["OTP"]
            user = User.objects.get(OTP = OTP)
            user.save()
            access_token = AccessToken.for_user(user)
            refresh_token = RefreshToken.for_user(user)
            try:
                user_programme = int(user.programme.id)
            except:
                user_programme = None    
            return Response({"access": str(access_token), "refresh": str(refresh_token), "user": {
                "email": user.email,
                "student_number": user.student_number,
                "registration_number": user.registration_number,
                "programme": user_programme,
                "role": user.role,
                "user_id": user.id,
                "has_profile": "true" if user.has_profile else "false",
            }})
        except:
            return Response(status = status.HTTP_403_FORBIDDEN)
        
@api_view(['PATCH'])
def update_profile(request, pk):
    try:
        user = User.objects.get(id =pk)
    except:
        user = None

    if user is not None:
        converted = UserSerializer(user, data=request.data, partial = True)

        if converted.is_valid():
            converted.save()

            user.has_profile = True
            user.save()
            return Response(converted.data, status=status.HTTP_202_ACCEPTED)
        
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)
            

    else:      
        return Response(status= status.HTTP_404_NOT_FOUND)     

@api_view(['GET', 'POST'])
def courses(request, pk):
    courses = Course.objects.filter(lecturer = pk)
    converted = CourseSerializer(courses, many = True)
    
    if request.method == "POST":
        converted = CourseSerializer(data = request.data)

        if converted.is_valid():
            converted.save()
            return Response(converted.data, status= status.HTTP_201_CREATED)
        
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    return Response(converted.data)  

@api_view(['GET'])
def all_courses(request, pk):
    courses = Course.objects.filter(programme = pk)
    converted = CourseSerializer(courses, many = True)
    return Response(converted.data)  
  
@api_view(['GET', 'POST'])
def programmes(request):

    programmes = Programme.objects.all()
    converted = ProgrammeSerializer(programmes, many = True)
    
    if request.method == "POST":
        converted = ProgrammeSerializer(data = request.data)

        if converted.is_valid():
            converted.save()
            return Response(converted.data, status= status.HTTP_201_CREATED)
        
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    return Response(converted.data)    

@api_view(['GET'])
def student_statistics(request, pk):
    tuition_complaints_all = TuitionComplaint.objects.filter(student = pk).count()
    tuition_complaints_pending = TuitionComplaint.objects.filter(student = pk, status = "pending").count()
    reg_complaints_all = RegistrationComplaint.objects.filter(student = pk).count()
    reg_complaints_pending = RegistrationComplaint.objects.filter(student = pk, status = "pending").count()
    marks_complaints_all = MissingMarksComplaint.objects.filter(student = pk).count()
    marks_complaints_pending = MissingMarksComplaint.objects.filter(student = pk, status = "pending").count()

    response = {
        "total": tuition_complaints_all + marks_complaints_all + reg_complaints_all,
        "pending": tuition_complaints_pending + marks_complaints_pending + reg_complaints_pending
    }

    return Response(response)



@api_view(['GET', 'POST'])
def notifications(request, pk):
    try:
        user = User.objects.get(id = pk)
    except:
        user = None

    if user is not None:

        if request.method == "POST":
            converted = NotificationsSerializer(data=request.data)

            if converted.is_valid():

                converted.save()

                return Response(converted.data, status=status.HTTP_201_CREATED)

            else:
                return Response(status=status.HTTP_201_CREATED)    
            

        notifications = Notification.objects.filter(reciever = pk)
        converted = NotificationsSerializer(notifications, many = True)
        return Response(converted.data)
    
    else:
        return Response(status = status.HTTP_403_FORBIDDEN)
    

@api_view(['GET'])
def view_notifications(request, pk):
    try:
        user = User.objects.get(id = pk)
    except:
        user = None

    if user is not None:
        notifications = Notification.objects.filter(reciever = pk)

        for notification in notifications:
            notification.is_viewed = True
            notification.save()

        return Response(status=status.HTTP_202_ACCEPTED)
    
    else:
        return Response(status = status.HTTP_403_FORBIDDEN)

    
@api_view(['GET', 'POST'])
def academic_years(request):

    if request.method == "POST":
        converted = YearsSerializer(data = request.data)

        if converted.is_valid():
            converted.save()
            return Response(status = status.HTTP_201_CREATED)
        
        else:
            return Response(status = status.HTTP_400_BAD_REQUEST)

    academic_years = AcademicYear.objects.all()
    converted = YearsSerializer(academic_years, many = True)
    return Response(converted.data)

@api_view(['GET', 'POST'])
def missing_marks(request, pk):

    if request.method == "POST":
        converted = MissingMarksComplaintSerializer(data = request.data)

        if converted.is_valid():
            student = User.objects.get(id = request.data["student"])
            course = Course.objects.get(id = request.data["course"])
            lecturer = User.objects.get(id = course.lecturer.id)
            
            Notification.objects.create(
                severity = "warning",
                body = f"You have a new complaint on {course.name} from {student.email}",
                reciever = lecturer
            )
            converted.save()
            return Response(converted.data, status = status.HTTP_201_CREATED)
        
        else:
            return Response(status = status.HTTP_400_BAD_REQUEST)

    complaints = MissingMarksComplaint.objects.filter(student = pk)
    converted = MissingMarksComplaintSerializer(complaints, many = True)
    return Response(converted.data)

@api_view(['GET', 'POST'])
def tuition_issues(request, pk):

    if request.method == "POST":
        converted = TuitionComplaintSerializer(data = request.data)

        if converted.is_valid():
            student = User.objects.get(id = request.data["student"])
            bursar = User.objects.get(role = "bursar")
            Notification.objects.create(
                severity = "warning",
                body = f"You have a new complaint titled ({(request.data["subject"])}) from {student.email}",
                reciever = bursar
            )
            converted.save()
            return Response(converted.data, status = status.HTTP_201_CREATED)
        
        else:
            return Response(status = status.HTTP_400_BAD_REQUEST)

    complaints = TuitionComplaint.objects.filter(student = pk)
    converted = TuitionComplaintSerializer(complaints, many = True)
    return Response(converted.data)

@api_view(['GET', 'POST'])
def registration_issues(request, pk):

    if request.method == "POST":
        converted = RegistrationComplaintSerializer(data = request.data)

        if converted.is_valid():
            student = User.objects.get(id = request.data["student"])
            registrar = User.objects.get(role = "registrar")
            Notification.objects.create(
                severity = "warning",
                body = f"You have a new complaint titled ({(request.data["subject"])}) from {student.email}",
                reciever = registrar
            )            
            converted.save()
            return Response(converted.data, status = status.HTTP_201_CREATED)
        
        else:
            return Response(status = status.HTTP_400_BAD_REQUEST)

    complaints = RegistrationComplaint.objects.filter(student = pk)
    converted = RegistrationComplaintSerializer(complaints, many = True)
    return Response(converted.data)


@api_view(['GET'])
def sent_complaints(request, pk):
        tuition_complaints_all = TuitionComplaint.objects.filter(student = pk)
        reg_complaints_all = RegistrationComplaint.objects.filter(student = pk)
        marks_complaints_all = MissingMarksComplaint.objects.filter(student = pk)

        all_complaints = []

        converted_tuition = TuitionComplaintSerializer(tuition_complaints_all, many = True)
        converted_missing = MissingMarksComplaintSerializer(marks_complaints_all, many = True)
        converted_reg =RegistrationComplaintSerializer(reg_complaints_all, many = True)
        
        for complaint in converted_missing.data:
            complaint["type"] = "missing marks complaint"
            all_complaints.append(complaint)

        for complaint in converted_reg.data:
            complaint["type"] = "registration issues"
            all_complaints.append(complaint)

        for complaint in converted_tuition.data:
            complaint["type"] = "tuition issues"
            all_complaints.append(complaint)

        return Response(all_complaints)


@api_view(['GET'])
def reg_complaints(request, pk):
    reg_complaints = RegistrationComplaint.objects.filter(student__programme = pk)
    
    for complaint in reg_complaints:
        complaint.seen = True
        complaint.save()

    converted = RegistrationComplaintSerializer(reg_complaints, many = True)

    return Response(converted.data)

@api_view(['PATCH'])
def update_reg_complaint(request, pk):
    try:
        complaint = RegistrationComplaint.objects.get(id = pk)
    except:
        complaint = None

    if complaint is not None:
        
        Notification.objects.create(
            reciever = complaint.student,
            severity = "success" if request.data["status"] == "resolved" else "info",
            body = "The registrar has addressed a complaint you made, please get to know more about this from the complaints page"
        )
        complaint.status = request.data["status"]
        complaint.save()
        
        return Response(status= status.HTTP_202_ACCEPTED)
    else:
        return Response(status=status.HTTP_400_BAD_REQUEST) 
    
@api_view(['PATCH'])
def update_tuition_complaint(request, pk):
    try:
        complaint = TuitionComplaint.objects.get(id = pk)
    except:
        complaint = None

    if complaint is not None:
        
        Notification.objects.create(
            reciever = complaint.student,
            severity = "success" if request.data["status"] == "resolved" else "info",
            body = "The bursar has addressed a complaint you made concerning tuition, please get to know more about this from the complaints page"
        )
        complaint.status = request.data["status"]
        complaint.save()
        
        return Response(status= status.HTTP_202_ACCEPTED)
    else:
        return Response(status=status.HTTP_400_BAD_REQUEST) 
         
@api_view(['PATCH'])
def update_marks_complaint(request, pk):
    try:
        complaint = MissingMarksComplaint.objects.get(id = pk)
    except:
        complaint = None

    if complaint is not None:
        
        Notification.objects.create(
            reciever = complaint.student,
            severity = "success" if request.data["status"] == "resolved" else "info",
            body = f"The lecturer ({complaint.course.lecturer.email}) has addressed a complaint you made about missing marks for a courseunit  ({complaint.course.name}) that you covered in {complaint.year_of_study}, please get to know more about this from the complaints page"
        )
        complaint.status = request.data["status"]
        complaint.save()
        
        return Response(status= status.HTTP_202_ACCEPTED)
    else:
        return Response(status=status.HTTP_400_BAD_REQUEST)      

@api_view(['GET'])
def marks_complaints(request, pk):
    complaints = MissingMarksComplaint.objects.filter(course = pk)
    
    for complaint in complaints:
        complaint.seen = True
        complaint.save()

    converted = MissingMarksComplaintSerializer(complaints, many = True)

    return Response(converted.data)      


@api_view(['GET'])
def sent_tuition_complaints(request):
    complaints = TuitionComplaint.objects.all()

    for complaint in complaints:
        complaint.seen = True
        complaint.save()

    converted = TuitionComplaintSerializer(complaints, many = True)
    
    return Response(converted.data)