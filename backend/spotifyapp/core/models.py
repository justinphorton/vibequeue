from django.db import models

# Create your models here.

class SpotifyToken(models.Model):
    user = models.CharField(max_length=50, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    refresh_token = models.CharField(max_length=255)
    access_token = models.CharField(max_length=255)
    expires_in = models.DateTimeField()
    token_type = models.CharField(max_length=50)

    def __str__(self):
        return f"Token for {self.user}"

class Song(models.Model):
    title = models.CharField(max_length=200)
    artist = models.CharField(max_length=200)
    timestamp = models.DateTimeField(auto_now_add=True)

    # new
    source = models.CharField(max_length=50, default="unknown")  # "gpt" or "manual"
    prompt = models.CharField(max_length=500, blank=True, default="")

    def __str__(self):
        return f"{self.title} by {self.artist}"

class Message(models.Model):
    text = models.CharField(max_length=200)

    def __str__(self):
        return self.text