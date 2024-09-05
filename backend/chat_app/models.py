from django.db import models

# Create your models here.

class Members(models.Model):
    username = models.CharField(max_length=100,default="unknown")
    password = models.CharField(max_length=10,default="12345")
    time = models.DateTimeField(auto_now_add = True, blank=True, null=True)
    image = models.ImageField()
    last_login = models.DateTimeField(auto_now_add = True,help_text="last seen")
    def __str__(self) :
        return self.username
    
    


class Messages(models.Model):
    sender = models.ForeignKey(Members, on_delete=models.CASCADE, related_name='messages_sent')
    receiver = models.ForeignKey(Members, on_delete=models.CASCADE, related_name='messages_received')
    content = models.TextField()
    time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender.username} to {self.receiver.username}"

    