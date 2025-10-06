"""
Utilidades para validar credenciales de UDG
"""
import requests
from bs4 import BeautifulSoup
import hashlib
import secrets
from urllib.parse import urlparse
import urllib3

# Deshabilitar warnings de SSL (solo para desarrollo)
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)


def validar_credencial_udg(url_qr):
    """
    Hace scraping de la página de validación de credenciales de UDG
    
    Args:
        url_qr: URL completa del QR (ej: https://documentos.udg.mx/[token])
    
    Returns:
        dict con los datos extraídos y validación
    """
    
    # Validar que sea una URL de documentos.udg.mx
    try:
        parsed = urlparse(url_qr)
        if 'documentos.udg.mx' not in parsed.netloc:
            return {
                'valido': False,
                'error': 'URL no es del sistema UDG'
            }
    except Exception:
        return {
            'valido': False,
            'error': 'URL inválida'
        }
    
    try:
        # Hacer request a la página SIN verificar SSL (solo para desarrollo)
        response = requests.get(
            url_qr, 
            timeout=15,
            verify=False,  # Deshabilitar verificación SSL
            headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        )
        response.raise_for_status()
        
        # Parsear HTML
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Buscar la tabla de validación de datos
        # La estructura es: <td>Nombre:</td><td>VALOR</td>
        datos = {}
        
        # Función helper para extraer datos de la tabla
        def extraer_dato(label):
            elemento = soup.find(text=lambda t: t and label in t)
            if elemento:
                td_valor = elemento.find_parent('td')
                if td_valor:
                    siguiente = td_valor.find_next_sibling('td')
                    if siguiente:
                        return siguiente.text.strip()
            return None
        
        # Extraer datos
        datos['nombre'] = extraer_dato('Nombre:')
        datos['sede'] = extraer_dato('Sede:')
        datos['situacion'] = extraer_dato('Situación:')
        datos['vigencia'] = extraer_dato('Vigencia:')
        
        # Debug: imprimir lo que se encontró
        print(f"Datos extraídos: {datos}")
        
        # Validar que se extrajeron los datos
        if not all([datos['nombre'], datos['sede'], datos['situacion']]):
            return {
                'valido': False,
                'error': 'No se pudieron extraer los datos de la credencial. Verifica que el URL sea correcto.'
            }
        
        # Validar que sea de CUCEI
        es_cucei = 'CUCEI' in datos['sede'].upper()
        
        # Validar que esté vigente
        es_vigente = datos['situacion'].upper() == 'VIGENTE'
        
        # Extraer código del URL (el token es único para cada estudiante)
        codigo_udg = extraer_codigo_de_url(url_qr)
        
        return {
            'valido': es_cucei and es_vigente,
            'nombre': datos['nombre'],
            'sede': datos['sede'],
            'situacion': datos['situacion'],
            'vigencia': datos['vigencia'],
            'codigo_udg': codigo_udg,
            'es_cucei': es_cucei,
            'es_vigente': es_vigente
        }
        
    except requests.Timeout:
        return {
            'valido': False,
            'error': 'Tiempo de espera agotado. Intenta de nuevo.'
        }
    except requests.RequestException as e:
        return {
            'valido': False,
            'error': f'Error al conectar con el servidor UDG. Verifica tu conexión a internet.'
        }
    except Exception as e:
        print(f"Error detallado: {str(e)}")
        return {
            'valido': False,
            'error': f'Error al procesar la credencial: {str(e)}'
        }


def extraer_codigo_de_url(url):
    """
    Extrae el token/código único del URL de la credencial
    
    Args:
        url: URL completa (ej: https://documentos.udg.mx/xeg9S0Y2++Z9XI...)
    
    Returns:
        str: Hash del token para usar como código único
    """
    try:
        # Extraer la parte después del dominio
        parsed = urlparse(url)
        token = parsed.path.strip('/')
        
        # Crear un hash del token para usarlo como código único
        # (más corto y seguro que guardar el token completo)
        codigo = hashlib.sha256(token.encode()).hexdigest()[:12]
        
        return codigo.upper()
    except Exception:
        return None


def generar_token_temporal():
    """
    Genera un token temporal único para el proceso de registro
    
    Returns:
        str: Token aleatorio
    """
    return secrets.token_urlsafe(32)


def validar_token_temporal(token):
    """
    Valida un token temporal de registro
    
    Args:
        token: Token a validar
    
    Returns:
        TokenTemporal object o None
    """
    from .models import TokenTemporal
    
    try:
        token_obj = TokenTemporal.objects.get(token=token, usado=False)
        
        if token_obj.es_valido():
            return token_obj
        else:
            return None
    except TokenTemporal.DoesNotExist:
        return None