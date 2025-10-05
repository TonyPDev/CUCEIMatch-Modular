from django.db import models
from apps.usuarios.models import Usuario

# Create your models here.
class Swipe(models.Model):
    """
    Registro de cada swipe (like o dislike) que hace un usuario
    """

    LIKE = 'like'
    DISLIKE = 'dislike'
    SUPER_LIKE = 'superlike'

    TIPO_CHOICES = [
        (LIKE, 'Like'),
        (DISLIKE, 'Dislike'),
        (SUPER_LIKE, 'Super Like'),
    ]

    usuario_origen = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        related_name='swipes_dados',
        help_text="Usuario que hace el swipe"
    )

    usuario_destino = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        related_name='swipes_recibidos',
        help_text="Usuario que recibe el swipe"
    )

    tipo = models.CharField(
        max_length=10,
        choices=TIPO_CHOICES,
        default=LIKE
    )
    
    fecha = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Swipe'
        verbose_name_plural = 'Swipes'
        ordering = ['-fecha']
        unique_together = ['usuario_origen', 'usuario_destino']
        indexes = [
            models.Index(fields=['usuario_origen', 'tipo']),
            models.Index(fields=['usuario_destino', 'tipo']),
        ]

    def __str__(self):
        return f"{self.usuario_origen.nombre_completo} → {self.tipo} → {self.usuario_destino.nombre_completo}"
    
    def save(self, *args, **kwargs):
        """
        Al guardar, verificar si hay match mutuo
        """
        super().save(*args, **kwargs)
        
        # Solo procesar si es un like
        if self.tipo == self.LIKE or self.tipo == self.SUPER_LIKE:
            self.verificar_match()

    def verificar_match(self):
        """
        Verifica si existe un like recíproco y crea un match
        """
        # Buscar si el usuario_destino también le dio like al usuario_origen
        like_reciproco = Swipe.objects.filter(
            usuario_origen=self.usuario_destino,
            usuario_destino=self.usuario_origen,
            tipo__in=[self.LIKE, self.SUPER_LIKE]
        ).exists()
        
        if like_reciproco:
            # Verificar que no exista ya un match
            match_existe = Match.objects.filter(
                models.Q(usuario1=self.usuario_origen, usuario2=self.usuario_destino) |
                models.Q(usuario1=self.usuario_destino, usuario2=self.usuario_origen)
            ).exists()
            
            if not match_existe:
                # Crear el match
                Match.objects.create(
                    usuario1=self.usuario_origen,
                    usuario2=self.usuario_destino
                )

class Match(models.Model):
    """
    Representa un match entre dos usuarios
    """
    
    usuario1 = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        related_name='matches_como_usuario1'
    )
    
    usuario2 = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        related_name='matches_como_usuario2'
    )
    
    fecha = models.DateTimeField(auto_now_add=True)
    
    activo = models.BooleanField(
        default=True,
        help_text="Si el match está activo (no fue eliminado por algún usuario)"
    )
    
    # Campos para tracking
    ultimo_mensaje = models.DateTimeField(
        null=True,
        blank=True,
        help_text="Fecha del último mensaje enviado"
    )
    
    class Meta:
        verbose_name = 'Match'
        verbose_name_plural = 'Matches'
        ordering = ['-fecha']
        indexes = [
            models.Index(fields=['usuario1', 'usuario2']),
            models.Index(fields=['fecha']),
        ]

    def __str__(self):
        return f"Match: {self.usuario1.nombre_completo} ↔ {self.usuario2.nombre_completo}"

    def save(self, *args, **kwargs):
        """
        Asegurar que usuario1.id < usuario2.id para evitar duplicados
        """
        if self.usuario1.id > self.usuario2.id:
            self.usuario1, self.usuario2 = self.usuario2, self.usuario1
        super().save(*args, **kwargs)

    def tiene_usuario(self, usuario):
        """Verifica si un usuario es parte del match"""
        return self.usuario1 == usuario or self.usuario2 == usuario

    def obtener_otro_usuario(self, usuario):
        """Retorna el otro usuario del match"""
        if self.usuario1 == usuario:
            return self.usuario2
        elif self.usuario2 == usuario:
            return self.usuario1
        return None