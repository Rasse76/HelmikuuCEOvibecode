#!/bin/bash

# Quick Product Image Downloader Helper
# This script provides direct download links and instructions
# You can paste the URLs into a browser or use curl commands

echo "========================================="
echo "Disc Golf Product Image Download Guide"
echo "========================================="
echo ""

# Array of products with download links
products=(
    "Innova Boss|https://www.innovadiscs.com/innova-boss/|innova-boss.jpg"
    "Discraft Zeus|https://www.discraft.com/zeus/|discraft-zeus.jpg"
    "Dynamic Discs Felon|https://www.dynamicdiscs.com/felon/|dynamic-discs-felon.jpg"
    "Latitude 64 Missilen|https://www.latitude64golf.com/missilen/|latitude64-missilen.jpg"
    "Innova Leopard3|https://www.innovadiscs.com/innova-leopard3/|innova-leopard3.jpg"
    "Discraft Buzzz SS|https://www.discraft.com/buzzz-ss/|discraft-buzzz-ss.jpg"
    "Kastaplast Reko|https://www.kastaplast.com/reko/|kastaplast-reko.jpg"
    "Innova Mako3|https://www.innovadiscs.com/innova-mako3/|innova-mako3.jpg"
    "Discraft Buzzz|https://www.discraft.com/buzzz/|discraft-buzzz.jpg"
    "Dynamic Discs Verdict|https://www.dynamicdiscs.com/verdict/|dynamic-discs-verdict.jpg"
    "Westside Stag|https://www.westsidediscs.com/stag/|westside-stag.jpg"
    "Innova Aviar|https://www.innovadiscs.com/innova-aviar/|innova-aviar.jpg"
    "Discraft Zone|https://www.discraft.com/zone/|discraft-zone.jpg"
    "Dynamic Discs Judge|https://www.dynamicdiscs.com/judge/|dynamic-discs-judge.jpg"
    "Axiom Envy|https://www.axiomdisc.com/envy/|axiom-envy.jpg"
    "Discmania Weekender Bag|https://www.discmania.net/weekender-bag/|discmania-weekender-bag.jpg"
    "Dynamic Discs Ranger Bag|https://www.dynamicdiscs.com/ranger-bag/|dynamic-discs-ranger-bag.jpg"
    "Prodigy Disc BP-3|https://www.prodigydisc.com/bp-3/|prodigy-bp3.jpg"
    "MVP Black Hole Basket|https://www.mvpdiscs.com/black-hole/|mvp-basket.jpg"
    "Discraft Towel Set|https://www.discraft.com/accessories/|discraft-towel.jpg"
)

# Create a file with download commands
cat > download_images.sh << 'ENDSCRIPT'
#!/bin/bash
cd "$(dirname "$0")/frontend/public/images/products" || exit

echo "Manual image download instruction:"
echo "1. Visit each URL and right-click the product image"
echo "2. Select 'Save image as'"
echo "3. Save to: frontend/public/images/products/"
echo "4. Use the suggested filename"
echo ""
ENDSCRIPT

# Print instructions
counter=1
for product in "${products[@]}"; do
    IFS='|' read -r name url filename <<< "$product"
    echo "$counter. $name"
    echo "   Link: $url"
    echo "   Save as: $filename"
    echo ""
    ((counter++))
done

echo "========================================="
echo "Or use curl (if direct links work):"
echo "========================================="
echo ""
echo "Example curl commands:"
echo "cd frontend/public/images/products"
echo "curl -o filename.jpg 'https://...'"
echo ""
echo "========================================="
