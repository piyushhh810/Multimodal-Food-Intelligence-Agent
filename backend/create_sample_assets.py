import os
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter
import numpy as np

sample_dir = Path(__file__).resolve().parent / "sample_data"
sample_dir.mkdir(parents=True, exist_ok=True)

def generate_samples():
    print("Generating FoodVerse AI sample evaluation assets...")

    # 1. Fresh Apple (vibrant red with subtle highlight)
    img_apple = Image.new("RGB", (400, 400), color=(245, 245, 248))
    draw = ImageDraw.Draw(img_apple)
    # Apple body
    draw.ellipse((80, 80, 320, 340), fill=(210, 35, 35))
    draw.ellipse((100, 100, 180, 180), fill=(240, 75, 75)) # Highlight
    # Stem & leaf
    draw.line((200, 50, 200, 95), fill=(90, 50, 20), width=6)
    draw.ellipse((200, 40, 250, 75), fill=(50, 160, 40))
    img_apple = img_apple.filter(ImageFilter.GaussianBlur(1))
    img_apple.save(sample_dir / "fresh_apple.jpg", quality=92)
    print(" -> fresh_apple.jpg generated")

    # 2. Decaying Banana (yellow base with significant brown oxidation & dark fungal spots)
    img_decay = Image.new("RGB", (400, 400), color=(240, 240, 242))
    draw = ImageDraw.Draw(img_decay)
    # Banana curve
    draw.arc((60, 100, 340, 320), start=30, end=170, fill=(190, 160, 40), width=65)
    # Brown oxidation patches
    draw.ellipse((120, 180, 190, 240), fill=(85, 50, 20))
    draw.ellipse((220, 200, 270, 240), fill=(95, 55, 25))
    draw.ellipse((160, 210, 180, 230), fill=(40, 25, 10)) # Deep mold spot
    draw.ellipse((240, 215, 255, 230), fill=(35, 20, 10))
    img_decay = img_decay.filter(ImageFilter.GaussianBlur(1))
    img_decay.save(sample_dir / "decaying_banana.jpg", quality=92)
    print(" -> decaying_banana.jpg generated")

    # 3. Mediterranean Salad Bowl (rich greens with cherry tomatoes and cucumber slices)
    img_salad = Image.new("RGB", (400, 400), color=(250, 250, 250))
    draw = ImageDraw.Draw(img_salad)
    # Bowl
    draw.ellipse((50, 50, 350, 350), fill=(230, 230, 235), outline=(180, 180, 190), width=3)
    # Salad greens base
    draw.ellipse((70, 70, 330, 330), fill=(45, 140, 45))
    for _ in range(25):
        rx = np.random.randint(90, 310)
        ry = np.random.randint(90, 310)
        draw.ellipse((rx, ry, rx + 30, ry + 25), fill=(60, 175, 60))
    # Red tomatoes
    for tx, ty in [(120, 140), (240, 150), (180, 230), (260, 250), (140, 260)]:
        draw.ellipse((tx, ty, tx + 35, ty + 35), fill=(220, 40, 30))
    # Cucumbers
    for cx, cy in [(180, 120), (220, 200), (110, 200), (200, 270)]:
        draw.ellipse((cx, cy, cx + 32, cy + 32), fill=(130, 200, 110), outline=(50, 120, 50), width=2)
    img_salad = img_salad.filter(ImageFilter.GaussianBlur(1))
    img_salad.save(sample_dir / "mediterranean_salad.jpg", quality=92)
    print(" -> mediterranean_salad.jpg generated")

    # 4. Kitchen Prep Station (stainless steel with cutting surface and gloves)
    img_kitchen = Image.new("RGB", (400, 300), color=(185, 195, 205))
    draw = ImageDraw.Draw(img_kitchen)
    # Prep counter lines
    draw.rectangle((30, 60, 370, 270), fill=(215, 222, 230), outline=(150, 160, 170), width=2)
    # Green cutting board (Produce)
    draw.rectangle((50, 80, 190, 230), fill=(70, 160, 80))
    # Red cutting board (Raw protein)
    draw.rectangle((210, 80, 350, 230), fill=(185, 55, 55))
    # Blue food-safe nitrile gloves
    draw.ellipse((80, 120, 120, 160), fill=(40, 110, 220))
    draw.ellipse((240, 120, 280, 160), fill=(40, 110, 220))
    img_kitchen.save(sample_dir / "kitchen_prep.jpg", quality=92)
    print(" -> kitchen_prep.jpg generated")

if __name__ == "__main__":
    generate_samples()
