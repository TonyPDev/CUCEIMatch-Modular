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
            'fecha_nacimiento', 'edad',
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
        extra_kwargs = {
            'carrera': {'required': False, 'allow_blank': True},
            'semestre': {'required': False, 'allow_null': True}
        }
    
    def validate(self, attrs):
        # Validar que las contraseñas coincidan
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({
                "password": "Las contraseñas no coinciden"
            })
        
        # Validar token temporal
        token = attrs.get('token_temporal')
        try:
            token_obj = TokenTemporal.objects.get(token=token, usado=False)
            if not token_obj.es_valido():
                raise serializers.ValidationError({
                    "token_temporal": "Token expirado. Por favor, valida tu credencial nuevamente."
                })
        except TokenTemporal.DoesNotExist:
            raise serializers.ValidationError({
                "token_temporal": "Token inválido o ya usado"
            })
        
        # Verificar que la credencial no esté ya registrada
        if Usuario.objects.filter(url_credencial=token_obj.url_credencial).exists():
            raise serializers.ValidationError({
                "credencial": "Esta credencial ya está registrada"
            })
        
        # Verificar que el email no esté ya registrado
        if Usuario.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError({
                "email": "Este email ya está registrado"
            })
        
        # Verificar que el username no esté ya registrado
        if Usuario.objects.filter(username=attrs['username']).exists():
            raise serializers.ValidationError({
                "username": "Este nombre de usuario ya está en uso"
            })
        
        # Guardar datos del token en el contexto
        attrs['_token_obj'] = token_obj
        
        return attrs

    def create(self, validated_data):
        # Remover campos que no van en el modelo
        validated_data.pop('password_confirm')
        validated_data.pop('token_temporal')
        token_obj = validated_data.pop('_token_obj')
        password = validated_data.pop('password')
        
        # Crear usuario con datos del token
        usuario = Usuario.objects.create_user(
            password=password,
            nombre_completo=token_obj.nombre_completo,
            codigo_udg=token_obj.url_credencial,
            url_credencial=token_obj.url_credencial,
            vigencia=token_obj.vigencia,
            verificado=True,
            activo=True,
            is_active=True,
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