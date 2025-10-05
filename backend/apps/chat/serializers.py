from rest_framework import serializers
from .models import Mensaje
from apps.matches.models import Match


class MensajeSerializer(serializers.ModelSerializer):
    """
    Serializer para mensajes
    """
    es_propio = serializers.SerializerMethodField()
    remitente_nombre = serializers.CharField(
        source='remitente.nombre_completo',
        read_only=True
    )
    
    class Meta:
        model = Mensaje
        fields = [
            'id', 'match', 'remitente', 'remitente_nombre',
            'contenido', 'fecha', 'leido', 'fecha_lectura',
            'es_propio'
        ]
        read_only_fields = ['id', 'fecha', 'leido', 'fecha_lectura']
    
    def get_es_propio(self, obj):
        """Verifica si el mensaje es del usuario autenticado"""
        request = self.context.get('request')
        if request and request.user:
            return obj.remitente == request.user
        return False


class EnviarMensajeSerializer(serializers.Serializer):
    """
    Serializer para enviar un nuevo mensaje
    """
    contenido = serializers.CharField(
        max_length=1000,
        required=True,
        allow_blank=False
    )
    
    def validate_contenido(self, value):
        """Validar que el mensaje no esté vacío"""
        if not value.strip():
            raise serializers.ValidationError(
                "El mensaje no puede estar vacío"
            )
        return value.strip()
    
    def create(self, validated_data):
        """Crear el mensaje"""
        match = self.context['match']
        remitente = self.context['request'].user
        
        mensaje = Mensaje.objects.create(
            match=match,
            remitente=remitente,
            contenido=validated_data['contenido']
        )
        
        return mensaje