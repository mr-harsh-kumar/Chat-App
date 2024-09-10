from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.core.files.storage import FileSystemStorage
from .models import Members, Messages
import json
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from datetime import datetime
from django.core.cache import cache
from django.utils import timezone


@csrf_exempt
def login(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        filter_members = Members.objects.filter(username=username, password=password)
        if filter_members.exists():
            member = filter_members.first()
            member.last_login = timezone.now()
            member.save(update_fields=['last_login'])

            request.session['username'] = username
            request.session.save()  # Save the session explicitly

            # Debugging statements
            print("login-----------------------------------------------------------------------------")
            print(f"Username set in session: {request.session.get('username')}")
            print(f"Session keys after setting username: {list(request.session.keys())}")
            print(f"Session items after setting username: {list(request.session.items())}")

            data = "Login successful!"
            return JsonResponse({
                "status": "success",
                "message": data,
                'username': username,
                'last_login': member.last_login.strftime('%Y-%m-%d %H:%M:%S')  # Format the date-time string as needed
            }, status=200)
        else:
            data = "Invalid credentials"
            return JsonResponse({"status": "error", "message": data}, status=401)
    else:
        return JsonResponse({"status": "error", "message": "No request"}, status=400)
        
    

@method_decorator(csrf_exempt, name='dispatch')
def signup(request):
    if request.method == 'POST':
        username = request.POST['username']
        
        
        if(Members.objects.filter(username=username).exists()):
            return JsonResponse({"status": "error" , "message": "This username is already existed"})

        password = request.POST['password']
        image = request.FILES['image']

        # Save the image to the file system
        fs = FileSystemStorage()
        filename = fs.save(image.name, image)
        image_url = fs.url(filename)

        # Create and save a new member instance
        member = Members(username=username, password=password, image=image_url)
        member.save()

        return JsonResponse({'status': 'success'})
    else:
        return JsonResponse({'status': 'Request method not supported'})

@csrf_exempt
def after_login(request):
    if request.method == 'POST':
        user = request.POST.get('user')
        
        if user:
            try:
                member = Members.objects.get(username=user)
                # Correcting the image URL
                image_url = member.image.url if member.image else ''
                if image_url.startswith('/media/media/'):
                    image_url = image_url.replace('/media/media/', '/media/')
                
                # Formatting the time to date/month/year
                formatted_date = member.time.strftime('%d/%m/%Y')

                member_data = {
                    'username': member.username,
                    'image': image_url,
                    'date': formatted_date,
                }
                return JsonResponse({'status': 'success', 'message': member_data})
            except Members.DoesNotExist:
                return JsonResponse({'status': 'error', 'message': 'User not found'})
        else:
            return JsonResponse({'status': 'error', 'message': 'User not provided'})

    return JsonResponse({'status': 'error', 'message': 'Invalid request method'})

def show_all_members(request):
    # Define a cache key
    cache_key = 'members_cache'
    # Check if the members are in the cache
    members_data = cache.get(cache_key)
    if members_data:
        print("------------------Members data from cache--------------")
       
    if not members_data:
        print("------------------Members data from DB--------------")
        # If not cached, query the database
        members = Members.objects.all().values('id', 'username', 'image', 'time','last_login')
        members_data = list(members)  # Convert queryset to list
        
        # Cache the result for a specified duration, e.g., 5 minutes (300 seconds)
        cache.set(cache_key, members_data, timeout=300)
    
    # Return the members as JSON
    return JsonResponse({'status': members_data})

def logout(request):
    if 'username' in request.session:
        del request.session['username']
        return JsonResponse({"message": "Logged out successfully"})
    else:
        return JsonResponse({"message": "No user logged in"})



def get_messages(request):
    # Define a cache key
    cache_key = 'messages_cache'
    # Check if the messages are in the cache
    messages_list = cache.get(cache_key)
    
    if messages_list:
        print("------------------Messages list data from cache--------------")
        
    if not messages_list:
        # If not cached, query the database
        print("------------------Messages list data from DB--------------")
        
        messages = Messages.objects.all().values('id', 'sender__username', 'receiver__username', 'content', 'time')
        messages_list = list(messages)  # Convert queryset to list
        
        # Cache the result for a specified duration, e.g., 5 minutes (300 seconds)
        cache.set(cache_key, messages_list, timeout=300)
    
    # Return the messages as JSON
    return JsonResponse(messages_list, safe=False)