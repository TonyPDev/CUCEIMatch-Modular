from django.contrib import admin
from .models import Mensaje


@admin.register(Mensaje)
class MensajeAdmin(admin.ModelAdmin):
    """
    Admin para mensajes
    """
    list_display = [
        'remitente', 'get_destinatario', 'preview_contenido',
        'fecha', 'leido'
    ]
    list_filter = ['leido', 'fecha']
    search_fields = [
        'remitente__nombre_completo',
        'remitente__email',
        'contenido'
    ]
    date_hierarchy = 'fecha'
    readonly_fields = ['fecha', 'fecha_lectura']
    
    fieldsets = (
        ('Match', {
            'fields': ('match',)
        }),
        ('Mensaje', {
            'fields': ('remitente', 'contenido')
        }),
        ('Estado', {
            'fields': ('leido', 'fecha', 'fecha_lectura')
        }),
    )
    
    def preview_contenido(self, obj):
        if len(obj.contenido) > 50:
            return obj.contenido[:50] + '...'
        return obj.contenido
    preview_contenido.short_description = 'Contenido'
    
    def get_destinatario(self, obj):
        otro = obj.match.obtener_otro_usuario(obj.remitente)
        return otro.nombre_completo if otro else '-'
    get_destinatario.short_description = 'Destinatario'
    
    def has_add_permission(self, request):
        # No permitir crear mensajes desde el admin
        return False