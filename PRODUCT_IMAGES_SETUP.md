# Product Images Setup Guide

## Overview

The application supports individual product images from official manufacturers. This guide walks you through getting real product images for your inventory.

## Step 1: Create the Images Directory

The folder structure is already created:
```
frontend/public/images/products/
```

## Step 2: Download Official Images

Visit these manufacturer websites and download product images:

### Disc Manufacturers

| Product | Manufacturer | Website |
|---------|--------------|---------|
| Innova Boss | Innova Discs | https://www.innovadiscs.com |
| Discraft Zeus | Discraft | https://www.discraft.com |
| Dynamic Discs Felon | Dynamic Discs | https://www.dynamicdiscs.com |
| Latitude 64 Missilen | Latitude 64 | https://www.latitude64golf.com |
| Innova Leopard3 | Innova Discs | https://www.innovadiscs.com |
| Discraft Buzzz SS | Discraft | https://www.discraft.com |
| Kastaplast Reko | Kastaplast | https://www.kastaplast.com |
| Innova Mako3 | Innova Discs | https://www.innovadiscs.com |
| Discraft Buzzz | Discraft | https://www.discraft.com |
| Dynamic Discs Verdict | Dynamic Discs | https://www.dynamicdiscs.com |
| Westside Stag | Westside Discs | https://www.westsidediscs.com |
| Innova Aviar | Innova Discs | https://www.innovadiscs.com |
| Discraft Zone | Discraft | https://www.discraft.com |
| Dynamic Discs Judge | Dynamic Discs | https://www.dynamicdiscs.com |
| Axiom Envy | Axiom | https://www.axiomdisc.com |

### Equipment Manufacturers

| Product | Manufacturer | Website |
|---------|--------------|---------|
| Discmania Weekender Bag | Discmania | https://www.discmania.net |
| Dynamic Discs Ranger Bag | Dynamic Discs | https://www.dynamicdiscs.com |
| Prodigy Disc BP-3 Backpack | Prodigy Disc | https://www.prodigydisc.com |
| MVP Black Hole Pro Basket | MVP | https://www.mvpdiscs.com |
| Discraft Towel & Mini Marker Set | Discraft | https://www.discraft.com |

## Step 3: Save Images with Correct Names

Save each image with the following naming format:
```
{brand}-{product-name}.{format}
```

**Examples:**
- `innova-boss.png`
- `discraft-zeus.jpg`
- `latitude64-missilen.png`
- `dynamic-discs-felon.jpg`
- `axiom-envy.png`
- `kastaplast-reko.jpg`
- `westside-stag.png`
- `mvp-basket.png`
- `discmania-weekender-bag.png`
- `dynamic-discs-ranger-bag.png`
- `prodigy-bp3-backpack.png`
- `discraft-towel-marker.png`

**Save location:**
```
frontend/public/images/products/{filename}
```

## Step 4: Update Backend Seed Data

Edit `backend/server.js` and update the product URLs. Change from:

```javascript
['Innova Boss', 'Distance Driver', 16.99, 24, 'DG-001', '...', '/images/distance-driver.svg']
```

To:

```javascript
['Innova Boss', 'Distance Driver', 16.99, 24, 'DG-001', '...', '/images/products/innova-boss.png']
```

Do this for all 20 products.

## Step 5: Refresh the Database

1. **Stop the backend server** (Ctrl+C in terminal)
2. **Delete the database:**
   ```bash
   rm backend/inventory.db
   ```
3. **Restart the backend server:**
   ```bash
   npm run backend
   ```

The database will automatically re-seed with the new image URLs!

## Step 6: Verify Images Load

- Open the application at http://localhost:5173
- Click **"📑 Categories"** to see all products with images
- If an image fails to load, it will fallback to the category SVG icon

## Image Requirements

- **Format**: PNG, JPG, WebP
- **Size**: Minimum 400x400px (larger is better)
- **Background**: White or transparent PNG preferred
- **Quality**: Highest quality available from manufacturer

## Tips

✅ **Do:**
- Download directly from manufacturers' official sites
- Use high-quality product photos
- Keep consistent image sizes/backgrounds
- Save in `frontend/public/images/products/`

❌ **Don't:**
- Use images without checking site terms of service
- Use low-resolution or blurry images
- Save with spaces or special characters in filenames
- Modify the images without permission

## Fallback Behavior

If a product image fails to load or doesn't exist:
1. App will show the category SVG icon (e.g., 🎯 for distance driver)
2. Category image will be used as fallback
3. No broken images or errors shown

## Need Help?

- Check `frontend/public/images/products/README.md` for detailed instructions
- All 20 products are listed with checkboxes to track your progress
- Most manufacturers provide high-quality images on their product pages

---

**Ready to start?** Visit the manufacturer websites and download those images! 🥏📸
