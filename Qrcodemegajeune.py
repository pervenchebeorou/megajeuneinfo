import Qrcodemegajeune
from PIL import Image

def generate_qr_with_logo():
    # Configuration
    url = "https://pervenchebeorou.github.io/megajeuneinfo/"
    logo_path = "images/logomegajeune.jpg"  # Chemin relatif depuis l'endroit où vous exécutez le script
    output_path = "qr_megajeune.png"       # Fichier de sortie
    
    # Création du QR code
    qr = Qrcodemegajeune.QRCode(
        version=5,  # Ajuste automatiquement si nécessaire (1-40)
        error_correction=Qrcodemegajeune.constants.ERROR_CORRECT_H,  # Haute tolérance aux erreurs
        box_size=10,
        border=4,
    )
    qr.add_data(url)
    qr.make(fit=True)
    
    # Génération de l'image QR
    qr_img = qr.make_image(fill_color="#1a237e", back_color="white").convert('RGB')  # Bleu foncé
    
    # Traitement du logo
    logo = Image.open(logo_path)
    
    # Redimensionnement (25% de la taille du QR code)
    logo_size = min(qr_img.size) // 4
    logo = logo.resize((logo_size, logo_size), Image.Resampling.LANCZOS)
    
    # Positionnement au centre
    position = (
        (qr_img.size[0] - logo.size[0]) // 2,
        (qr_img.size[1] - logo.size[1]) // 2
    )
    
    # Collage du logo (avec gestion de la transparence si nécessaire)
    if logo.mode == 'RGBA':
        mask = logo.split()[3]  # Utilise le canal alpha comme masque
        qr_img.paste(logo, position, mask)
    else:
        qr_img.paste(logo, position)
    
    # Sauvegarde
    qr_img.save(output_path)
    print(f"✅ QR code généré avec succès : {output_path}")

# Exécution
generate_qr_with_logo()