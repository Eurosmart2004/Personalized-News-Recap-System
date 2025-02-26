import cloudinary
import cloudinary.uploader
from cloudinary.utils import cloudinary_url
from .config import Config
import uuid
import os

# Configuration       
cloudinary.config(
    cloud_name = Config.CLOUDINARY_NAME, 
    api_key = Config.CLOUDINARY_API_KEY, 
    api_secret = Config.CLOUDINARY_API_SECRET,
    secure=True
)


def generate_unique_filename(original_filename: str) -> str:
    """
    Generates a unique filename using UUID while keeping the original file extension.

    Args:
        original_filename (str): The original filename.

    Returns:
        str: A new unique filename.
    """
    ext = os.path.splitext(original_filename)[-1]  # Get file extension
    return f"{uuid.uuid4().hex}{ext}"

def upload_image(file_path: str, userID: str):
    """
    Uploads an image to Cloudinary.

    Args:
        file_path (str): The path to the image file.

    Returns:
        dict: Response from Cloudinary containing file details.

    Raises:
        FileNotFoundError: If the file does not exist.
        ValueError: If the file is not an image.
    """
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")

    if not file_path.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.webp')):
        raise ValueError("Invalid file type. Only images are allowed (png, jpg, jpeg, gif, webp).")

    folder = f"personalized-news-recap-system/users/{userID}/picture"

    return cloudinary.uploader.upload(file_path, folder=folder, use_filename=True)