from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import serializers

from .models import Perfil, Foto, INTERESES_DISPONIBLES
from .serializers import (
    PerfilSerializer,
    ActualizarPerfilSerializer,
    FotoSerializer
)


class MiPerfilView(generics.RetrieveAPIView):
    """
    GET /api/perfiles/mi-perfil/
    Obtiene el perfil completo del usuario autenticado
    """
    permission_classes = [IsAuthenticated]
    serializer_class = PerfilSerializer
    
    def get_object(self):
        perfil, created = Perfil.objects.get_or_create(usuario=self.request.user)
        return perfil


class ActualizarPerfilView(generics.UpdateAPIView):
    """
    PUT/PATCH /api/perfiles/actualizar/
    Actualiza el perfil del usuario
    """
    permission_classes = [IsAuthenticated]
    serializer_class = ActualizarPerfilSerializer
    
    def get_object(self):
        perfil, created = Perfil.objects.get_or_create(usuario=self.request.user)
        return perfil
    
    def perform_update(self, serializer):
        serializer.save()
        
        # Verificar si el perfil está completo
        usuario = self.request.user
        tiene_fotos = usuario.fotos.exists()
        tiene_bio = bool(serializer.instance.bio)
        
        if tiene_fotos and tiene_bio and not usuario.perfil_completo:
            usuario.perfil_completo = True
            usuario.save(update_fields=['perfil_completo'])


class FotoListCreateView(generics.ListCreateAPIView):
    """
    GET /api/perfiles/fotos/ - Lista las fotos del usuario
    POST /api/perfiles/fotos/ - Sube una nueva foto
    """
    permission_classes = [IsAuthenticated]
    serializer_class = FotoSerializer
    parser_classes = [MultiPartParser, FormParser]
    
    def get_queryset(self):
        return Foto.objects.filter(usuario=self.request.user).order_by('orden')
    
    def perform_create(self, serializer):
        # Contar fotos existentes
        num_fotos = Foto.objects.filter(usuario=self.request.user).count()
        
        # Máximo 6 fotos
        if num_fotos >= 6:
            raise serializers.ValidationError(
                "Has alcanzado el máximo de 6 fotos"
            )
        
        # Asignar orden automático
        orden = serializer.validated_data.get('orden', num_fotos)
        
        # Si es la primera foto, hacerla principal
        es_principal = num_fotos == 0
        
        foto = serializer.save(
            usuario=self.request.user,
            orden=orden,
            es_principal=es_principal
        )
        
        # Marcar perfil como completo si tiene bio
        usuario = self.request.user
        if hasattr(usuario, 'perfil') and usuario.perfil.bio:
            usuario.perfil_completo = True
            usuario.save(update_fields=['perfil_completo'])
        
        return foto


class FotoDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET /api/perfiles/fotos/<id>/ - Ver una foto
    PUT/PATCH /api/perfiles/fotos/<id>/ - Actualizar una foto
    DELETE /api/perfiles/fotos/<id>/ - Eliminar una foto
    """
    permission_classes = [IsAuthenticated]
    serializer_class = FotoSerializer
    parser_classes = [MultiPartParser, FormParser]
    
    def get_queryset(self):
        return Foto.objects.filter(usuario=self.request.user)
    
    def perform_destroy(self, instance):
        # Si era la foto principal, hacer principal a la primera
        if instance.es_principal:
            primera_foto = Foto.objects.filter(
                usuario=self.request.user
            ).exclude(pk=instance.pk).order_by('orden').first()
            
            if primera_foto:
                primera_foto.es_principal = True
                primera_foto.save()
        
        instance.delete()


class MarcarFotoPrincipalView(APIView):
    """
    POST /api/perfiles/fotos/<id>/principal/
    Marca una foto como principal
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request, pk):
        try:
            foto = Foto.objects.get(pk=pk, usuario=request.user)
        except Foto.DoesNotExist:
            return Response(
                {'error': 'Foto no encontrada'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Quitar es_principal de todas las demás fotos
        Foto.objects.filter(
            usuario=request.user,
            es_principal=True
        ).update(es_principal=False)
        
        # Marcar esta como principal
        foto.es_principal = True
        foto.save()
        
        return Response(
            FotoSerializer(foto, context={'request': request}).data,
            status=status.HTTP_200_OK
        )


class InteresesDisponiblesView(APIView):
    """
    GET /api/perfiles/intereses/
    Lista los intereses disponibles
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        return Response({
            'intereses': INTERESES_DISPONIBLES
        }, status=status.HTTP_200_OK)