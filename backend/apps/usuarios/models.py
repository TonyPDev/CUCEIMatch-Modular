from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator

class Usuario(AbstractUser):
    """
    Modelo de usuario personalizado para CUCEIMatch
    """
    
    GENERO_CHOICES = [
        ('hombre', 'Hombre'),
        ('mujer', 'Mujer'),
        ('otro', 'Otro'),
    ]
    
    BUSCANDO_CHOICES = [
        ('hombres', 'Hombres'),
        ('mujeres', 'Mujeres'),
        ('ambos', 'Ambos'),
    ]
    
    # Datos de UDG/CUCEI
    nombre_completo = models.CharField(max_length=200)
    codigo_udg = models.CharField(
        max_length=255,
        help_text="Identificador único de la credencial"
    )
    url_credencial = models.URLField(
        unique=True,  # La URL de la credencial debe ser única
        help_text="URL completa del QR de la credencial"
    )
    vigencia = models.CharField(
        max_length=50,
        help_text="Ej: ENE-2026"
    )
    
    # Datos personales
    email = models.EmailField(unique=True)
    fecha_nacimiento = models.DateField(null=True, blank=True)
    genero = models.CharField(max_length=10, choices=GENERO_CHOICES)
    buscando = models.CharField(
        max_length=10,
        choices=BUSCANDO_CHOICES,
        default='ambos'
    )
    
    # Datos académicos
    carrera = models.CharField(max_length=200, blank=True)
    semestre = models.IntegerField(
        null=True,
        blank=True,
        validators=[MinValueValidator(1), MaxValueValidator(12)]
    )
    
    # Estado de la cuenta
    verificado = models.BooleanField(
        default=False
    )
    activo = models.BooleanField(
        default=True
    )
    perfil_completo = models.BooleanField(
        default=False
    )
    
    # Timestamps
    fecha_registro = models.DateTimeField(auto_now_add=True)
    ultima_actividad = models.DateTimeField(auto_now=True)
    
    # Configuración del modelo
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'nombre_completo']
    
    class Meta:
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'
        ordering = ['-fecha_registro']
    
    def __str__(self):
        return f"{self.nombre_completo} ({self.email})"
    
    @property
    def edad(self):
        """Calcula la edad del usuario"""
        if not self.fecha_nacimiento:
            return None
        from datetime import date
        today = date.today()
        return today.year - self.fecha_nacimiento.year - (
            (today.month, today.day) < (self.fecha_nacimiento.month, self.fecha_nacimiento.day)
        )
    
    def get_generos_buscados(self):
        """Retorna lista de géneros que el usuario está buscando"""
        if self.buscando == 'ambos':
            return ['hombre', 'mujer', 'otro']
        elif self.buscando == 'hombres':
            return ['hombre']
        elif self.buscando == 'mujeres':
            return ['mujer']
        return []


class TokenTemporal(models.Model):
    """
    Token temporal para validar el proceso de registro
    Se usa entre la validación del QR y el registro completo
    """
    token = models.CharField(max_length=100, unique=True)
    codigo_udg = models.CharField(max_length=255)  # Ahora guarda el URL completo
    nombre_completo = models.CharField(max_length=200)
    vigencia = models.CharField(max_length=50)
    url_credencial = models.URLField()
    
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    usado = models.BooleanField(default=False)
    
    class Meta:
        verbose_name = 'Token Temporal'
        verbose_name_plural = 'Tokens Temporales'
        ordering = ['-fecha_creacion']
    
    def __str__(self):
        return f"Token para {self.nombre_completo}"
    
    def es_valido(self):
        """Verifica si el token aún es válido (30 minutos)"""
        from datetime import datetime, timedelta
        from django.utils import timezone
        
        if self.usado:
            return False
        
        expiracion = self.fecha_creacion + timedelta(minutes=30)
        return timezone.now() < expiracion