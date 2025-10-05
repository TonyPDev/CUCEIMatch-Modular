from rest_framework import serializers
from .models import Swipe, Match
from apps.usuarios.serializers import UsuarioPerfilSerializer


class SwipeSerializer(serializers.ModelSerializer):
    """
    Serializer para crear swipes
    """
    class Meta:
        model = Swipe
        fields = ['id', 'usuario_destino', 'tipo', 'fecha']
        read_only_fields = ['id', 'fecha']
    
    def validate_usuario_destino(self, value):
        """Validar que no sea el mismo usuario"""
        if value == self.context['request'].user:
            raise serializers.ValidationError(
                "No puedes hacer swipe a ti mismo"
            )
        return value
    
    def validate(self, attrs):
        """Validar que no exista ya un swipe"""
        usuario_origen = self.context['request'].user
        usuario_destino = attrs['usuario_destino']
        
        if Swipe.objects.filter(
            usuario_origen=usuario_origen,
            usuario_destino=usuario_destino
        ).exists():
            raise serializers.ValidationError(
                "Ya hiciste swipe a este usuario"
            )
        
        return attrs
    
    def create(self, validated_data):
        validated_data['usuario_origen'] = self.context['request'].user
        return super().create(validated_data)


class MatchSerializer(serializers.ModelSerializer):
    """
    Serializer para mostrar matches
    """
    otro_usuario = serializers.SerializerMethodField()
    ultimo_mensaje_preview = serializers.SerializerMethodField()
    mensajes_no_leidos = serializers.SerializerMethodField()
    
    class Meta:
        model = Match
        fields = [
            'id', 'fecha', 'activo', 'otro_usuario',
            'ultimo_mensaje', 'ultimo_mensaje_preview',
            'mensajes_no_leidos'
        ]
    
    def get_otro_usuario(self, obj):
        """Obtiene el otro usuario del match"""
        request = self.context.get('request')
        if not request:
            return None
        
        otro_usuario = obj.obtener_otro_usuario(request.user)
        if otro_usuario:
            return UsuarioPerfilSerializer(
                otro_usuario,
                context=self.context
            ).data
        return None
    
    def get_ultimo_mensaje_preview(self, obj):
        """Obtiene preview del último mensaje"""
        ultimo_msg = obj.mensajes.order_by('-fecha').first()
        if ultimo_msg:
            preview = ultimo_msg.contenido[:50]
            if len(ultimo_msg.contenido) > 50:
                preview += '...'
            return {
                'contenido': preview,
                'remitente_id': ultimo_msg.remitente.id,
                'fecha': ultimo_msg.fecha
            }
        return None
    
    def get_mensajes_no_leidos(self, obj):
        """Cuenta mensajes no leídos del otro usuario"""
        request = self.context.get('request')
        if not request:
            return 0
        
        otro_usuario = obj.obtener_otro_usuario(request.user)
        if not otro_usuario:
            return 0
        
        return obj.mensajes.filter(
            remitente=otro_usuario,
            leido=False
        ).count()