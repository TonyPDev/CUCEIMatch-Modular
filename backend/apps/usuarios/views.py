from django.shortcuts import render
from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import get_user_model

from .models import Usuario, TokenTemporal
from .serializers import (
    UsuarioSerializer,
    UsuarioPerfilSerializer,
    RegistroSerializer,
    ActualizarUsuarioSerializer
)
from .utils import validar_credencial_udg, generar_token_temporal

User = get_user_model()


class ValidarQRView(APIView):
    """
    POST /api/usuarios/validar-qr/
    Valida el QR de la credencial de CUCEI
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        url_qr = request.data.get('url_qr')
        
        if not url_qr:
            return Response(
                {'error': 'Se requiere el URL del QR'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validar credencial con scraping
        datos = validar_credencial_udg(url_qr)
        
        if not datos['valido']:
            return Response(
                {
                    'error': datos.get('error', 'Credencial no válida'),
                    'es_cucei': datos.get('es_cucei', False),
                    'es_vigente': datos.get('es_vigente', False)
                },
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Verificar si ya existe un usuario con este código
        codigo_udg = datos['codigo_udg']
        if Usuario.objects.filter(codigo_udg=codigo_udg).exists():
            return Response(
                {'error': 'Esta credencial ya está registrada'},
                status=status.HTTP_409_CONFLICT
            )
        
        # Crear token temporal
        token = generar_token_temporal()
        TokenTemporal.objects.create(
            token=token,
            codigo_udg=codigo_udg,
            nombre_completo=datos['nombre'],
            vigencia=datos['vigencia'],
            url_credencial=url_qr
        )
        
        return Response({
            'valido': True,
            'nombre': datos['nombre'],
            'vigencia': datos['vigencia'],
            'token_temporal': token
        }, status=status.HTTP_200_OK)


class RegistroView(generics.CreateAPIView):
    """
    POST /api/usuarios/registro/
    Completa el registro del usuario
    """
    permission_classes = [AllowAny]
    serializer_class = RegistroSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        usuario = serializer.save()
        
        # Generar tokens JWT
        from rest_framework_simplejwt.tokens import RefreshToken
        refresh = RefreshToken.for_user(usuario)
        
        return Response({
            'message': 'Usuario registrado exitosamente',
            'usuario': UsuarioSerializer(usuario).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)


class PerfilUsuarioView(generics.RetrieveAPIView):
    """
    GET /api/usuarios/perfil/
    Obtiene el perfil del usuario autenticado
    """
    permission_classes = [IsAuthenticated]
    serializer_class = UsuarioSerializer
    
    def get_object(self):
        return self.request.user


class PerfilUsuarioDetalleView(generics.RetrieveAPIView):
    """
    GET /api/usuarios/perfil/<id>/
    Obtiene el perfil de otro usuario (para ver en swipe/matches)
    """
    permission_classes = [IsAuthenticated]
    serializer_class = UsuarioPerfilSerializer
    queryset = Usuario.objects.filter(verificado=True, activo=True)


class ActualizarUsuarioView(generics.UpdateAPIView):
    """
    PUT/PATCH /api/usuarios/actualizar/
    Actualiza los datos del usuario autenticado
    """
    permission_classes = [IsAuthenticated]
    serializer_class = ActualizarUsuarioSerializer
    
    def get_object(self):
        return self.request.user
