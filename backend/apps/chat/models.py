from django.db import models
from apps.usuarios.models import Usuario
from apps.matches.models import Match


# Create your models here.
class Mensaje(models.Model):
    """
    Mensajes entre usuarios que tienen match
    """
    
    match = models.ForeignKey(
        Match,
        on_delete=models.CASCADE,
        related_name='mensajes'
    )
    
    remitente = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        related_name='mensajes_enviados'
    )
    
    contenido = models.TextField(
        max_length=1000,
        help_text="Contenido del mensaje"
    )
    
    fecha = models.DateTimeField(auto_now_add=True)
    
    leido = models.BooleanField(
        default=False,
        help_text="Si el mensaje fue leído por el destinatario"
    )
    
    fecha_lectura = models.DateTimeField(
        null=True,
        blank=True,
        help_text="Cuándo fue leído el mensaje"
    )
    
    class Meta:
        verbose_name = 'Mensaje'
        verbose_name_plural = 'Mensajes'
        ordering = ['fecha']
        indexes = [
            models.Index(fields=['match', 'fecha']),
            models.Index(fields=['remitente', 'fecha']),
        ]
    
    def __str__(self):
        preview = self.contenido[:50] + '...' if len(self.contenido) > 50 else self.contenido
        return f"{self.remitente.nombre_completo}: {preview}"
    
    def save(self, *args, **kwargs):
        """
        Actualizar la fecha del último mensaje en el match
        """
        super().save(*args, **kwargs)
        
        # Actualizar ultimo_mensaje en el Match
        self.match.ultimo_mensaje = self.fecha
        self.match.save(update_fields=['ultimo_mensaje'])
    
    def marcar_como_leido(self):
        """Marca el mensaje como leído"""
        if not self.leido:
            from django.utils import timezone
            self.leido = True
            self.fecha_lectura = timezone.now()
            self.save(update_fields=['leido', 'fecha_lectura'])