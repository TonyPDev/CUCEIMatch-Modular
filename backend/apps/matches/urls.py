from django.urls import path
from . import views

app_name = 'matches'

urlpatterns = [
    # Candidatos para swipe
    path('candidatos/', views.CandidatosView.as_view(), name='candidatos'),
    
    # Hacer swipe
    path('swipe/', views.SwipeView.as_view(), name='swipe'),
    
    # Mis matches
    path('', views.MisMatchesView.as_view(), name='mis_matches'),
    path('<int:pk>/', views.MatchDetalleView.as_view(), name='match_detalle'),
    
    # Eliminar match
    path('<int:pk>/eliminar/', views.EliminarMatchView.as_view(), name='eliminar_match'),
]