from django.contrib import admin
from .models import Perfil, Foto


class FotoInline(admin.TabularInline):
    """
    Inline para mostrar fotos en el usuario (no en el perfil)
    """
    model = Foto
    extra = 1
    fields = ['imagen', 'orden', 'es_principal', 'fecha_subida']
    readonly_fields = ['fecha_subida']
    fk_name = 'usuario'  # Especificar el ForeignKey


@admin.register(Perfil)
class PerfilAdmin(admin.ModelAdmin):
    """
    Admin para perfiles (sin inline de fotos)
    """
    list_display = [
        'usuario', 'get_carrera', 'get_semestre',
        'tiene_fotos', 'fecha_actualizacion'
    ]
    list_filter = ['fecha_actualizacion']
    search_fields = [
        'usuario__nombre_completo', 'usuario__email',
        'usuario__carrera', 'bio'
    ]
    readonly_fields = ['fecha_actualizacion']
    
    # Removemos el inline porque Foto tiene FK a Usuario, no a Perfil
    
    fieldsets = (
        ('Usuario', {
            'fields': ('usuario',)
        }),
        ('Información del Perfil', {
            'fields': ('bio', 'intereses')
        }),
        ('Preferencias', {
            'fields': (
                'distancia_maxima', 'edad_minima', 'edad_maxima',
                'mostrar_edad', 'mostrar_carrera'
            )
        }),
        ('Metadata', {
            'fields': ('fecha_actualizacion',)
        }),
    )
    
    def get_carrera(self, obj):
        return obj.usuario.carrera
    get_carrera.short_description = 'Carrera'
    
    def get_semestre(self, obj):
        return obj.usuario.semestre
    get_semestre.short_description = 'Semestre'
    
    def tiene_fotos(self, obj):
        return obj.usuario.fotos.exists()
    tiene_fotos.boolean = True
    tiene_fotos.short_description = '¿Tiene fotos?'


@admin.register(Foto)
class FotoAdmin(admin.ModelAdmin):
    """
    Admin para fotos
    """
    list_display = [
        'usuario', 'orden', 'es_principal',
        'fecha_subida', 'ver_imagen'
    ]
    list_filter = ['es_principal', 'fecha_subida']
    search_fields = ['usuario__nombre_completo', 'usuario__email']
    readonly_fields = ['fecha_subida', 'ver_imagen']
    
    def ver_imagen(self, obj):
        if obj.imagen:
            return f'<img src="{obj.imagen.url}" width="100" />'
        return '-'
    ver_imagen.allow_tags = True
    ver_imagen.short_description = 'Preview'