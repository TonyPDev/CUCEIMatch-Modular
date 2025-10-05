from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q, Count

from .models import Swipe, Match
from .serializers import SwipeSerializer, MatchSerializer
from apps.usuarios.models import Usuario
from apps.usuarios.serializers import UsuarioPerfilSerializer


class CandidatosView(APIView):
    """
    GET /api/matches/candidatos/
    Obtiene usuarios candidatos para hacer swipe
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        usuario = request.user
        
        # Usuarios que ya vio (hizo swipe)
        usuarios_vistos_ids = Swipe.objects.filter(
            usuario_origen=usuario
        ).values_list('usuario_destino_id', flat=True)
        
        # Obtener candidatos
        candidatos = Usuario.objects.filter(
            verificado=True,
            activo=True,
            perfil_completo=True
        ).exclude(
            id=usuario.id
        ).exclude(
            id__in=usuarios_vistos_ids
        ).filter(
            genero__in=usuario.get_generos_buscados()
        ).annotate(
            num_fotos=Count('fotos')
        ).filter(
            num_fotos__gte=1
        )
        
        # Filtrar por preferencias
        if hasattr(usuario, 'perfil'):
            perfil = usuario.perfil
        
        # Ordenar: usuarios activos recientemente, luego aleatorio
        candidatos = candidatos.order_by('-ultima_actividad', '?')[:20]
        
        serializer = UsuarioPerfilSerializer(
            candidatos,
            many=True,
            context={'request': request}
        )
        
        return Response({
            'candidatos': serializer.data,
            'total': candidatos.count()
        }, status=status.HTTP_200_OK)


class SwipeView(generics.CreateAPIView):
    """
    POST /api/matches/swipe/
    Realiza un swipe (like/dislike)
    Body: {
        "usuario_destino": 123,
        "tipo": "like" | "dislike" | "superlike"
    }
    """
    permission_classes = [IsAuthenticated]
    serializer_class = SwipeSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        swipe = serializer.save()
        
        # Verificar si hubo match
        tiene_match = False
        match_data = None
        
        if swipe.tipo in [Swipe.LIKE, Swipe.SUPER_LIKE]:
            # Buscar si existe match
            match = Match.objects.filter(
                Q(usuario1=request.user, usuario2=swipe.usuario_destino) |
                Q(usuario1=swipe.usuario_destino, usuario2=request.user)
            ).first()
            
            if match:
                tiene_match = True
                match_data = MatchSerializer(
                    match,
                    context={'request': request}
                ).data
        
        return Response({
            'swipe': SwipeSerializer(swipe).data,
            'match': tiene_match,
            'match_data': match_data
        }, status=status.HTTP_201_CREATED)


class MisMatchesView(generics.ListAPIView):
    """
    GET /api/matches/
    Lista todos los matches del usuario
    """
    permission_classes = [IsAuthenticated]
    serializer_class = MatchSerializer
    
    def get_queryset(self):
        usuario = self.request.user
        return Match.objects.filter(
            Q(usuario1=usuario) | Q(usuario2=usuario),
            activo=True
        ).order_by('-ultimo_mensaje', '-fecha')


class MatchDetalleView(generics.RetrieveAPIView):
    """
    GET /api/matches/<id>/
    Obtiene detalles de un match específico
    """
    permission_classes = [IsAuthenticated]
    serializer_class = MatchSerializer
    
    def get_queryset(self):
        usuario = self.request.user
        return Match.objects.filter(
            Q(usuario1=usuario) | Q(usuario2=usuario),
            activo=True
        )


class EliminarMatchView(APIView):
    """
    DELETE /api/matches/<id>/eliminar/
    Desactiva/elimina un match
    """
    permission_classes = [IsAuthenticated]
    
    def delete(self, request, pk):
        try:
            match = Match.objects.get(
                Q(usuario1=request.user) | Q(usuario2=request.user),
                pk=pk
            )
        except Match.DoesNotExist:
            return Response(
                {'error': 'Match no encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Marcar como inactivo en lugar de eliminar
        match.activo = False
        match.save()
        
        return Response(
            {'message': 'Match eliminado exitosamente'},
            status=status.HTTP_200_OK
        )