from django.contrib import admin
from .models import Swipe, Match


@admin.register(Swipe)
class SwipeAdmin(admin.ModelAdmin):
    """
    Admin para swipes
    """
    list_display = [
        'usuario_origen', 'usuario_destino',
        'tipo', 'fecha'
    ]
    list_filter = ['tipo', 'fecha']
    search_fields = [
        'usuario_origen__nombre_completo',
        'usuario_destino__nombre_completo',
        'usuario_origen__email',
        'usuario_destino__email'
    ]
    date_hierarchy = 'fecha'
    readonly_fields = ['fecha']
    
    def has_add_permission(self, request):
        # No permitir crear swipes desde el admin
        return False


@admin.register(Match)
class MatchAdmin(admin.ModelAdmin):
    """
    Admin para matches
    """
    list_display = [
        'get_usuarios', 'fecha', 'activo',
        'tiene_mensajes', 'ultimo_mensaje'
    ]
    list_filter = ['activo', 'fecha']
    search_fields = [
        'usuario1__nombre_completo',
        'usuario2__nombre_completo',
        'usuario1__email',
        'usuario2__email'
    ]
    date_hierarchy = 'fecha'
    readonly_fields = ['fecha', 'ultimo_mensaje']
    
    def get_usuarios(self, obj):
        return f"{obj.usuario1.nombre_completo} ↔ {obj.usuario2.nombre_completo}"
    get_usuarios.short_description = 'Match'
    
    def tiene_mensajes(self, obj):
        return obj.mensajes.exists()
    tiene_mensajes.boolean = True
    tiene_mensajes.short_description = '¿Tienen mensajes?'
    
    def has_add_permission(self, request):
        # No permitir crear matches desde el admin
        return False