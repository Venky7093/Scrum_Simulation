import os
import shutil
from datetime import datetime

def backup_files(source_dir, backup_dir):
    # Create a timestamped backup directory
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_path = os.path.join(backup_dir, f"backup_{timestamp}")
    os.makedirs(backup_path, exist_ok=True)

    # Copy all files from the source directory to the backup directory
    for item in os.listdir(source_dir):
        source_item = os.path.join(source_dir, item)
        backup_item = os.path.join(backup_path, item)
        
        if os.path.isfile(source_item):
            shutil.copy2(source_item, backup_item)
            print(f"Backed up: {source_item} to {backup_item}")

if __name__ == "__main__":
    source_directory = r"C:\Users\VENKY\OneDrive\Desktop"  # Change this to your source directory
    backup_directory = r"C:\Users\VENKY\OneDrive\Desktop\backup"   # Change this to your backup directory
    backup_files(source_directory, backup_directory)