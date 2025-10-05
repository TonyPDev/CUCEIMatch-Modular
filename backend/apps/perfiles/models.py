from django.db import models
from apps.usuarios.models import Usuario
from django.core.validators import MinValueValidator, MaxValueValidator

# Create your models here.
class Perfil(models.Model):
    """
    Perfil extendido del usuario con información adicional
    """
    usuario = models.OneToOneField(
        Usuario, on_delete=models.CASCADE, related_name='perfil'
    )

    bio = models.TextField(
        max_length=500,
        blank=True,
        help_text="Biografía del usuario"
    )

    #Intereses se guarda como json
    intereses = models.JSONField(
        default=list,
        help_text="Lista de intereses : ['deportes', 'música', 'cine', ...]"
    )

    #Preferencia de distancia para futuras funcionalidades
    distancia_maxima = models.IntegerField(
        default = 50,
        validators = [MinValueValidator(1), MaxValueValidator(100)],
        help_text="Distancia máxima en km"
    )

    #Edad preferida
    edad_minima = models.IntegerField(
        default=18,
        validators=[MinValueValidator(18), MaxValueValidator(99)]
    )

    edad_maxima = models.IntegerField(
        default=30,
        validators=[MinValueValidator(18), MaxValueValidator(99)]
    )

    #Visibilidad
    mostrar_edad = models.BooleanField(default=True)
    mostrar_carrera = models.BooleanField(default=True)

    fecha_actualizacion = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Perfil'
        verbose_name_plural = 'Perfiles'
    
    def __str__(self):
        return f"Perfil de {self.usuario.nombre_completo}"
    
class Foto(models.Model):
    """
    Fotos del perfil del usuario
    """

    usuario = models.ForeignKey(
        Usuario,
        on_delete=models.CASCADE,
        related_name='fotos'
    )

    imagen = models.ImageField(
        upload_to='fotos_perfil/%Y/%m/', #las fotos se guardarán en una carpeta llamada fotos_perfil, y además se organizarán por año (%Y) y mes (%m).
        help_text="Foto del perfil"
    )

    orden = models.IntegerField(
        default=0,
        help_text="Orden de visualización (0 = primera foto)"
    )

    es_principal = models.BooleanField(
        default=False,
        help_text="Foto principal del perfil"
    )

    fecha_subida = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Foto'
        verbose_name_plural = 'Fotos'
        ordering = ['orden']
        unique_together = ['usuario', 'orden']

    def __str__(self):
        return f"Foto {self.orden} de {self.usuario.nombre_completo}"
    
    def save(self, *args, **kwargs):
        """
        Si es la primera foto o es_principal=True, asegurar que sea la principal
        """
        if self.es_principal:
            # Quitar es_principal de otras fotos del mismo usuario
            Foto.objects.filter(
                usuario=self.usuario,
                es_principal=True
            ).exclude(pk=self.pk).update(es_principal=False)
        
        # Si es la primera foto del usuario, hacerla principal
        if not Foto.objects.filter(usuario=self.usuario).exists():
            self.es_principal = True
            self.orden = 0
        
        super().save(*args, **kwargs)
    
    # Lista de intereses predefinidos
INTERESES_DISPONIBLES = [
    'Deportes',
    'Música',
    'Cine',
    'Series',
    'Videojuegos',
    'Lectura',
    'Arte',
    'Fotografía',
    'Viajes',
    'Cocina',
    'Fitness',
    'Yoga',
    'Pilates',
    'Baile',
    'Tecnología',
    'Programación',
    'Ciencia',
    'Naturaleza',
    'Mascotas',
    'Café',
    'Fiesta',
    'Anime',
    'Manga'
    'Memes',
    'Ajedrez',
]