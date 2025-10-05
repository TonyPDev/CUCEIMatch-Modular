from django.urls import path
from . import views

app_name = 'chat'

urlpatterns = [
    # Obtener conversaciones
    path('conversaciones/', views.ConversacionesView.as_view(), name='conversaciones'),
    
    # Mensajes de un match específico
    path('<int:match_id>/mensajes/', views.MensajesView.as_view(), name='mensajes'),
    
    # Enviar mensaje
    path('<int:match_id>/enviar/', views.EnviarMensajeView.as_view(), name='enviar_mensaje'),
    
    # Marcar mensajes como leídos
    path('<int:match_id>/marcar-leidos/', views.MarcarLeidosView.as_view(), name='marcar_leidos'),
]