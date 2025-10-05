from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q

from .models import Mensaje
from .serializers import MensajeSerializer, EnviarMensajeSerializer
from apps.matches.models import Match
from apps.matches.serializers import MatchSerializer


class ConversacionesView(generics.ListAPIView):
    """
    GET /api/chat/conversaciones/
    Lista todas las conversaciones (matches con mensajes)
    """
    permission_classes = [IsAuthenticated]
    serializer_class = MatchSerializer
    
    def get_queryset(self):
        usuario = self.request.user
        return Match.objects.filter(
            Q(usuario1=usuario) | Q(usuario2=usuario),
            activo=True
        ).exclude(
            mensajes__isnull=True
        ).order_by('-ultimo_mensaje')


class MensajesView(generics.ListAPIView):
    """
    GET /api/chat/<match_id>/mensajes/
    Obtiene todos los mensajes de una conversación
    Query params:
    - limit: número de mensajes a retornar (default: 50)
    - before_id: ID del mensaje para paginación
    """
    permission_classes = [IsAuthenticated]
    serializer_class = MensajeSerializer
    
    def get_queryset(self):
        match_id = self.kwargs.get('match_id')
        usuario = self.request.user
        
        # Verificar que el match exista y el usuario sea parte de él
        try:
            match = Match.objects.get(
                Q(usuario1=usuario) | Q(usuario2=usuario),
                pk=match_id,
                activo=True
            )
        except Match.DoesNotExist:
            return Mensaje.objects.none()
        
        mensajes = Mensaje.objects.filter(match=match)
        
        # Paginación simple con before_id
        before_id = self.request.query_params.get('before_id')
        if before_id:
            mensajes = mensajes.filter(id__lt=before_id)
        
        # Límite de mensajes
        limit = int(self.request.query_params.get('limit', 50))
        
        return mensajes.order_by('-fecha')[:limit]
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        
        # Marcar mensajes del otro usuario como leídos
        match_id = self.kwargs.get('match_id')
        try:
            match = Match.objects.get(
                Q(usuario1=request.user) | Q(usuario2=request.user),
                pk=match_id
            )
            
            # Obtener el otro usuario
            otro_usuario = match.obtener_otro_usuario(request.user)
            
            # Marcar mensajes no leídos del otro usuario como leídos
            Mensaje.objects.filter(
                match=match,
                remitente=otro_usuario,
                leido=False
            ).update(leido=True)
            
        except Match.DoesNotExist:
            pass
        
        serializer = self.get_serializer(queryset, many=True)
        
        # Invertir orden para mostrar del más antiguo al más nuevo
        return Response({
            'mensajes': list(reversed(serializer.data)),
            'total': queryset.count()
        })


class EnviarMensajeView(APIView):
    """
    POST /api/chat/<match_id>/enviar/
    Envía un nuevo mensaje
    Body: {
        "contenido": "Texto del mensaje"
    }
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request, match_id):
        # Verificar que el match exista y el usuario sea parte de él
        try:
            match = Match.objects.get(
                Q(usuario1=request.user) | Q(usuario2=request.user),
                pk=match_id,
                activo=True
            )
        except Match.DoesNotExist:
            return Response(
                {'error': 'Match no encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Validar y crear mensaje
        serializer = EnviarMensajeSerializer(
            data=request.data,
            context={'request': request, 'match': match}
        )
        serializer.is_valid(raise_exception=True)
        mensaje = serializer.save()
        
        # Retornar el mensaje creado
        return Response(
            MensajeSerializer(mensaje, context={'request': request}).data,
            status=status.HTTP_201_CREATED
        )


class MarcarLeidosView(APIView):
    """
    POST /api/chat/<match_id>/marcar-leidos/
    Marca todos los mensajes del otro usuario como leídos
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request, match_id):
        try:
            match = Match.objects.get(
                Q(usuario1=request.user) | Q(usuario2=request.user),
                pk=match_id,
                activo=True
            )
        except Match.DoesNotExist:
            return Response(
                {'error': 'Match no encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Obtener el otro usuario
        otro_usuario = match.obtener_otro_usuario(request.user)
        
        # Marcar mensajes como leídos
        mensajes_actualizados = Mensaje.objects.filter(
            match=match,
            remitente=otro_usuario,
            leido=False
        ).update(leido=True)
        
        return Response({
            'message': f'{mensajes_actualizados} mensajes marcados como leídos'
        }, status=status.HTTP_200_OK)