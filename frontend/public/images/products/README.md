# Product Images Guide

This folder contains official manufacturer images for disc golf products.

## How to Add Product Images

### 1. **Free Image Sources (Use These First)**

#### Official Manufacturer Websites:
- **Innova Discs**: https://www.innovadiscs.com
  - Products: Boss, Leopard3, Mako3, Aviar
- **Discraft**: https://www.discraft.com
  - Products: Zeus, Buzzz SS, Buzzz, Zone
- **Latitude 64**: https://www.latitude64golf.com
  - Products: Missilen
- **Dynamic Discs**: https://www.dynamicdiscs.com
  - Products: Felon, Verdict, Judge, Ranger Bag
- **Axiom**: https://www.axiomdisc.com
  - Products: Envy
- **Kastaplast**: https://www.kastaplast.com
  - Products: Reko
- **Westside Discs**: https://www.westsidediscs.com
  - Products: Stag
- **MVP**: https://www.mvpdiscs.com
  - Products: Black Hole Pro Basket

#### Alternative Sources:
- PowerGrip.fi (with permission) - https://powergrip.fi/hae
- Disc Golf Scene - https://www.discgolfscene.com
- DGCR.com - https://www.dgcr.com

### 2. **Download Instructions**

1. Navigate to the product page on manufacturer's website
2. Right-click the product image → "Save image as"
3. Save with filename: `{PRODUCT_NAME}.png` or `.jpg`
   - Example: `innova-boss.png`, `discraft-zeus.jpg`
4. Place in this `products/` folder

### 3. **Naming Convention**

Use a consistent naming pattern:
```
{brand}-{product-name}.{extension}
```

Examples:
- `innova-boss.png`
- `discraft-buzzz.jpg`
- `latitude64-missilen.png`
- `dynamic-discs-felon.jpg`
- `axiom-envy.png`
- `kastaplast-reko.jpg`
- `westside-stag.png`
- `mvp-basket.png`

### 4. **Update Database**

After adding images, update `backend/server.js` seed data:

Change from:
```javascript
['Innova Boss', 'Distance Driver', 16.99, 24, 'DG-001', '...', '/images/distance-driver.svg']
```

To:
```javascript
['Innova Boss', 'Distance Driver', 16.99, 24, 'DG-001', '...', '/images/products/innova-boss.png']
```

### 5. **Image Requirements**

- **Format**: PNG, JPG, or WebP
- **Size**: ~400x400px minimum (will be resized by CSS)
- **Quality**: High quality / HQ
- **Background**: Preferably white or transparent (if PNG)

## Running the App After Adding Images

1. Delete old database: `rm backend/inventory.db`
2. Restart backend server
3. Images will load automatically!

## Current Products Needing Images

- [ ] Innova Boss (DG-001)
- [ ] Discraft Zeus (DG-002)
- [ ] Dynamic Discs Felon (DG-003)
- [ ] Latitude 64 Missilen (DG-004)
- [ ] Innova Leopard3 (DG-005)
- [ ] Discraft Buzzz SS (DG-006)
- [ ] Kastaplast Reko (DG-007)
- [ ] Innova Mako3 (DG-008)
- [ ] Discraft Buzzz (DG-009)
- [ ] Dynamic Discs Verdict (DG-010)
- [ ] Westside Stag (DG-011)
- [ ] Innova Aviar (DG-012)
- [ ] Discraft Zone (DG-013)
- [ ] Dynamic Discs Judge (DG-014)
- [ ] Axiom Envy (DG-015)
- [ ] Discmania Weekender Bag (DG-016)
- [ ] Dynamic Discs Ranger Bag (DG-017)
- [ ] Prodigy Disc BP-3 Backpack (DG-018)
- [ ] MVP Black Hole Pro Basket (DG-019)
- [ ] Discraft Towel & Mini Marker Set (DG-020)

## Tips

- Manufacturer sites often have high-res images that are free to download
- Always check the website's terms of service
- For bags and equipment, the cleaner the background, the better it looks
- Product images should be consistent in style/background for professional appearance

Happy collecting! 🥏
