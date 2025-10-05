from django.urls import path
from . import views

app_name = 'perfiles'

urlpatterns = [
    # Perfil
    path('mi-perfil/', views.MiPerfilView.as_view(), name='mi_perfil'),
    path('actualizar/', views.ActualizarPerfilView.as_view(), name='actualizar_perfil'),
    
    # Fotos
    path('fotos/', views.FotoListCreateView.as_view(), name='fotos'),
    path('fotos/<int:pk>/', views.FotoDetailView.as_view(), name='foto_detalle'),
    path('fotos/<int:pk>/principal/', views.MarcarFotoPrincipalView.as_view(), name='foto_principal'),
    
    # Intereses disponibles
    path('intereses/', views.InteresesDisponiblesView.as_view(), name='intereses'),
]