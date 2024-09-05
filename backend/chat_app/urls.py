from django.contrib import admin
from django.urls import path,include
from .views import *

urlpatterns = [
    path('login/',login),
    path('signup/',signup),
    path('logout/',logout),
    path('after_login/',after_login),
    path('show_all_members/',show_all_members),
    path('chat/messages/<str:room_name>/', get_messages, name='get_messages'),


    path('messages/', get_messages, name='get_messages'),
    
]
