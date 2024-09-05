from django.contrib import admin
from .models import Members, Messages

class AllMembersAdmin(admin.ModelAdmin):
    list_display = ('username', 'password', 'time', 'image', 'last_login')

admin.site.register(Members, AllMembersAdmin)




class AllMessagesAdmin(admin.ModelAdmin):
    list_display = ('sender', 'receiver', 'content', 'time')

admin.site.register(Messages, AllMessagesAdmin)