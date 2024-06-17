from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
urlpatterns = [
    path('token/', views.CustomTokenObtainPairView.as_view()),
    path('token/refresh', TokenRefreshView.as_view()),
    path('signup/', views.sign_up),
    path('verify/', views.verify_otp),
    path('update_profile/<str:pk>', views.update_profile),
    path('courses/<str:pk>', views.courses),
    path('all_courses/<str:pk>', views.all_courses),
    path('programmes/', views.programmes),
    path('student_statistics/<str:pk>', views.student_statistics),
    path('notifications/<str:pk>', views.notifications),
    path('view_notifications/<str:pk>', views.view_notifications),
    path('academic_years/', views.academic_years),
    path('registration_issues/<str:pk>', views.registration_issues),
    path('tuition_issues/<str:pk>', views.tuition_issues),
    path('missing_marks/<str:pk>', views.missing_marks),
    path('sent_complaints/<str:pk>', views.sent_complaints),
    path('reg_complaints/<str:pk>', views.reg_complaints),
    path('update_reg_complaint/<str:pk>', views.update_reg_complaint),
    path('update_marks_complaint/<str:pk>', views.update_marks_complaint),
    path('update_tuition_complaint/<str:pk>', views.update_tuition_complaint),
    path('marks_complaints/<str:pk>', views.marks_complaints),
    path('sent_tuition_complaints/', views.sent_tuition_complaints),
]