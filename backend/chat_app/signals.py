from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.core.cache import cache
from .models import Members
from .models import Messages

@receiver(post_save, sender=Members)
@receiver(post_delete, sender=Members)
def invalidate_members_cache(sender, **kwargs):
    cache_key = 'members_cache'
    cache.delete(cache_key)




@receiver(post_save, sender=Messages)
@receiver(post_delete, sender=Messages)
def invalidate_messages_cache(sender, **kwargs):
    cache_key = 'messages_cache'
    cache.delete(cache_key)
