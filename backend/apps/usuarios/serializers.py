from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import Usuario, TokenTemporal

class UsuarioSerializer(serializers.ModelSerializer):
    """
    Serializer básico de usuario
    """
    edad = serializers.ReadOnlyField()
    
    class Meta:
        model = Usuario
        fields = [
            'id', 'email', 'username', 'nombre_completo',
            'codigo_udg', 'fecha_nacimiento', 'edad',
            'genero', 'buscando', 'carrera', 'semestre',
            'verificado', 'activo', 'perfil_completo',
            'fecha_registro', 'ultima_actividad'
        ]
        read_only_fields = ['id', 'verificado', 'fecha_registro', 'ultima_actividad']

class UsuarioPerfilSerializer(serializers.ModelSerializer):
    """
    Serializer para mostrar perfil de usuario con fotos
    """
    edad = serializers.ReadOnlyField()
    fotos = serializers.SerializerMethodField()
    
    class Meta:
        model = Usuario
        fields = [
            'id', 'nombre_completo', 'edad', 'carrera',
            'semestre', 'genero', 'fotos'
        ]
    
    def get_fotos(self, obj):
        from apps.perfiles.serializers import FotoSerializer
        fotos = obj.fotos.all().order_by('orden')
        return FotoSerializer(fotos, many=True, context=self.context).data
    
class RegistroSerializer(serializers.ModelSerializer):
    """
    Serializer para registro de nuevos usuarios
    """
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    password_confirm = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )
    token_temporal = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = Usuario
        fields = [
            'token_temporal', 'email', 'username', 'password',
            'password_confirm', 'fecha_nacimiento', 'genero',
            'buscando', 'carrera', 'semestre'
        ]
    
    def validate(self, attrs):
        # Validar que las contraseñas coincidan
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({
                "password": "Las contraseñas no coinciden"
            })
        
        # Validar token temporal
        from .utils import validar_token_temporal
        token = attrs.get('token_temporal')
        token_obj = validar_token_temporal(token)
        
        if not token_obj:
            raise serializers.ValidationError({
                "token_temporal": "Token inválido o expirado"
            })
        
        # Verificar que el código UDG no esté ya registrado
        if Usuario.objects.filter(codigo_udg=token_obj.codigo_udg).exists():
            raise serializers.ValidationError({
                "codigo_udg": "Esta credencial ya está registrada"
            })
        
        # Guardar datos del token en el contexto
        attrs['_token_obj'] = token_obj
        
        return attrs

    def create(self, validated_data):
        # Remover campos que no van en el modelo
        validated_data.pop('password_confirm')
        token_obj = validated_data.pop('_token_obj')
        password = validated_data.pop('password')
        
        # Crear usuario con datos del token
        usuario = Usuario.objects.create_user(
            password=password,
            nombre_completo=token_obj.nombre_completo,
            codigo_udg=token_obj.codigo_udg,
            url_credencial=token_obj.url_credencial,
            vigencia=token_obj.vigencia,
            verificado=True,
            **validated_data
        )
        
        # Marcar token como usado
        token_obj.usado = True
        token_obj.save()
        
        # Crear perfil asociado
        from apps.perfiles.models import Perfil
        Perfil.objects.create(usuario=usuario)
        
        return usuario
    
class ActualizarUsuarioSerializer(serializers.ModelSerializer):
    """
    Serializer para actualizar datos del usuario
    """
    class Meta:
        model = Usuario
        fields = [
            'fecha_nacimiento', 'genero', 'buscando',
            'carrera', 'semestre'
        ]