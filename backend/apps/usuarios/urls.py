from django.urls import path
from . import views

app_name = 'usuarios'

urlpatterns = [
    # Validación y registro
    path('validar-qr/', views.ValidarQRView.as_view(), name='validar_qr'),
    path('registro/', views.RegistroView.as_view(), name='registro'),
    
    # Perfil de usuario
    path('perfil/', views.PerfilUsuarioView.as_view(), name='perfil'),
    path('perfil/<int:pk>/', views.PerfilUsuarioDetalleView.as_view(), name='perfil_detalle'),
    
    # Actualización de datos
    path('actualizar/', views.ActualizarUsuarioView.as_view(), name='actualizar'),
]