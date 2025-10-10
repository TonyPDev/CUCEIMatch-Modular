# backend/create_test_users.py
"""
Script para crear usuarios de prueba con fotos
Ejecutar: python manage.py shell < create_test_users.py
"""

from apps.usuarios.models import Usuario
from apps.perfiles.models import Perfil, Foto
from django.core.files.base import ContentFile
import requests
from io import BytesIO

def crear_usuario_prueba(
    nombre, 
    username, 
    email, 
    genero, 
    buscando, 
    carrera, 
    semestre,
    foto_url=None
):
    """Crea un usuario de prueba"""
    
    # Verificar si ya existe
    if Usuario.objects.filter(email=email).exists():
        print(f"❌ Usuario {email} ya existe")
        return None
    
    # Crear usuario
    usuario = Usuario.objects.create_user(
        username=username,
        email=email,
        password='test1234',  # Contraseña de prueba
        nombre_completo=nombre,
        codigo_udg=f'test_{username}',
        url_credencial=f'https://test.com/{username}',
        vigencia='DIC-2025',
        fecha_nacimiento='2000-01-01',
        genero=genero,
        buscando=buscando,
        carrera=carrera,
        semestre=semestre,
        verificado=True,
        activo=True,
        perfil_completo=True
    )
    
    # Crear perfil
    perfil = Perfil.objects.create(
        usuario=usuario,
        bio=f'Hola, soy {nombre.split()[0]}. Estudiante de {carrera} en CUCEI. 🎓',
        intereses=['Música', 'Deportes', 'Tecnología']
    )
    
    # Agregar foto si se proporciona URL
    if foto_url:
        try:
            response = requests.get(foto_url)
            if response.status_code == 200:
                foto = Foto.objects.create(
                    usuario=usuario,
                    orden=0,
                    es_principal=True
                )
                foto.imagen.save(
                    f'{username}.jpg',
                    ContentFile(response.content),
                    save=True
                )
                print(f"✅ Usuario creado: {email} con foto")
            else:
                print(f"⚠️ Usuario creado: {email} sin foto (error descargando)")
        except Exception as e:
            print(f"⚠️ Usuario creado: {email} sin foto (error: {e})")
    else:
        print(f"✅ Usuario creado: {email} (sin foto)")
    
    return usuario

# Crear varios usuarios de prueba
print("\n🚀 Creando usuarios de prueba...\n")

# Usuarios mujeres
crear_usuario_prueba(
    nombre="María García López",
    username="maria_garcia",
    email="maria.garcia@test.com",
    genero="mujer",
    buscando="hombres",
    carrera="Ingeniería en Computación",
    semestre=6,
    foto_url="https://randomuser.me/api/portraits/women/1.jpg"
)

crear_usuario_prueba(
    nombre="Ana Martínez Silva",
    username="ana_martinez",
    email="ana.martinez@test.com",
    genero="mujer",
    buscando="ambos",
    carrera="Ingeniería Industrial",
    semestre=4,
    foto_url="https://randomuser.me/api/portraits/women/2.jpg"
)

crear_usuario_prueba(
    nombre="Laura Rodríguez Pérez",
    username="laura_rodriguez",
    email="laura.rodriguez@test.com",
    genero="mujer",
    buscando="hombres",
    carrera="Licenciatura en Matemáticas",
    semestre=8,
    foto_url="https://randomuser.me/api/portraits/women/3.jpg"
)

# Usuarios hombres
crear_usuario_prueba(
    nombre="Carlos Hernández",
    username="carlos_hdez",
    email="carlos.hernandez@test.com",
    genero="hombre",
    buscando="mujeres",
    carrera="Ingeniería en Sistemas",
    semestre=5,
    foto_url="https://randomuser.me/api/portraits/men/1.jpg"
)

crear_usuario_prueba(
    nombre="Luis Gómez Torres",
    username="luis_gomez",
    email="luis.gomez@test.com",
    genero="hombre",
    buscando="mujeres",
    carrera="Ingeniería Mecánica",
    semestre=7,
    foto_url="https://randomuser.me/api/portraits/men/2.jpg"
)

crear_usuario_prueba(
    nombre="Diego Sánchez",
    username="diego_sanchez",
    email="diego.sanchez@test.com",
    genero="hombre",
    buscando="ambos",
    carrera="Ingeniería Química",
    semestre=3,
    foto_url="https://randomuser.me/api/portraits/men/3.jpg"
)

print("\n✅ Proceso completado!")
print("\n📝 Puedes iniciar sesión con cualquiera de estos usuarios:")
print("   Email: [cualquier email de arriba]")
print("   Password: test1234")