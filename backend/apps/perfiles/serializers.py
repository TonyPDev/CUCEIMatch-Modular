from rest_framework import serializers
from .models import Perfil, Foto, INTERESES_DISPONIBLES


class FotoSerializer(serializers.ModelSerializer):
    """
    Serializer para fotos del perfil
    """
    imagen_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Foto
        fields = ['id', 'imagen', 'imagen_url', 'orden', 'es_principal', 'fecha_subida']
        read_only_fields = ['id', 'fecha_subida']
    
    def get_imagen_url(self, obj):
        request = self.context.get('request')
        if obj.imagen and hasattr(obj.imagen, 'url'):
            if request:
                return request.build_absolute_uri(obj.imagen.url)
            return obj.imagen.url
        return None


class PerfilSerializer(serializers.ModelSerializer):
    """
    Serializer para el perfil del usuario
    """
    fotos = FotoSerializer(source='usuario.fotos', many=True, read_only=True)
    nombre = serializers.CharField(source='usuario.nombre_completo', read_only=True)
    edad = serializers.IntegerField(source='usuario.edad', read_only=True)
    carrera = serializers.CharField(source='usuario.carrera', read_only=True)
    genero = serializers.CharField(source='usuario.genero', read_only=True)
    
    class Meta:
        model = Perfil
        fields = [
            'id', 'nombre', 'edad', 'carrera', 'genero',
            'bio', 'intereses', 'distancia_maxima',
            'edad_minima', 'edad_maxima', 'mostrar_edad',
            'mostrar_carrera', 'fotos', 'fecha_actualizacion'
        ]
        read_only_fields = ['id', 'fecha_actualizacion']
    
    def validate_intereses(self, value):
        """Validar que los intereses sean de la lista permitida"""
        if not isinstance(value, list):
            raise serializers.ValidationError("Los intereses deben ser una lista")
        
        for interes in value:
            if interes not in INTERESES_DISPONIBLES:
                raise serializers.ValidationError(
                    f"'{interes}' no es un interés válido"
                )
        
        return value
    
    def validate(self, attrs):
        """Validar rangos de edad"""
        edad_min = attrs.get('edad_minima', self.instance.edad_minima if self.instance else 18)
        edad_max = attrs.get('edad_maxima', self.instance.edad_maxima if self.instance else 30)
        
        if edad_min > edad_max:
            raise serializers.ValidationError({
                'edad_minima': 'La edad mínima no puede ser mayor a la edad máxima'
            })
        
        return attrs


class ActualizarPerfilSerializer(serializers.ModelSerializer):
    """
    Serializer para actualizar solo el perfil (sin datos del usuario)
    """
    class Meta:
        model = Perfil
        fields = [
            'bio', 'intereses', 'distancia_maxima',
            'edad_minima', 'edad_maxima', 'mostrar_edad',
            'mostrar_carrera'
        ]