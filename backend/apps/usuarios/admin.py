from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import Usuario, TokenTemporal


class FotoInline(admin.TabularInline):
    """
    Inline para mostrar fotos del usuario
    """
    from apps.perfiles.models import Foto
    model = Foto
    extra = 0
    fields = ['imagen', 'orden', 'es_principal']
    readonly_fields = ['fecha_subida']


@admin.register(Usuario)
class UsuarioAdmin(BaseUserAdmin):
    """
    Admin para el modelo Usuario personalizado
    """
    list_display = [
        'email', 'nombre_completo', 'codigo_udg',
        'verificado', 'perfil_completo', 'activo',
        'fecha_registro'
    ]
    list_filter = [
        'verificado', 'activo', 'perfil_completo',
        'genero', 'carrera', 'fecha_registro'
    ]
    search_fields = [
        'email', 'nombre_completo', 'codigo_udg',
        'username', 'carrera'
    ]
    ordering = ['-fecha_registro']
    
    inlines = [FotoInline]
    
    fieldsets = (
        ('Información de Cuenta', {
            'fields': ('email', 'username', 'password')
        }),
        ('Datos de CUCEI', {
            'fields': (
                'nombre_completo', 'codigo_udg',
                'url_credencial', 'vigencia'
            )
        }),
        ('Datos Personales', {
            'fields': (
                'fecha_nacimiento', 'genero', 'buscando',
                'carrera', 'semestre'
            )
        }),
        ('Estado', {
            'fields': (
                'verificado', 'activo', 'perfil_completo',
                'is_active', 'is_staff', 'is_superuser'
            )
        }),
        ('Fechas', {
            'fields': ('fecha_registro', 'ultima_actividad', 'last_login')
        }),
    )
    
    readonly_fields = ['fecha_registro', 'ultima_actividad', 'last_login']


@admin.register(TokenTemporal)
class TokenTemporalAdmin(admin.ModelAdmin):
    """
    Admin para tokens temporales de registro
    """
    list_display = [
        'nombre_completo', 'codigo_udg', 'usado',
        'fecha_creacion', 'es_valido'
    ]
    list_filter = ['usado', 'fecha_creacion']
    search_fields = ['nombre_completo', 'codigo_udg', 'token']
    readonly_fields = ['fecha_creacion']
    
    def es_valido(self, obj):
        return obj.es_valido()
    es_valido.boolean = True
    es_valido.short_description = '¿Es válido?'