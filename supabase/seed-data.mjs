import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 1. Initial Setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// Read manually from .env.local because process.env won't have it automatically in node unless loaded
const envContent = fs.readFileSync(path.join(rootDir, '.env.local'), 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
    if (line && !line.startsWith('#')) {
        const [key, ...values] = line.split('=');
        if (key && values.length > 0) {
            envVars[key.trim()] = values.join('=').trim();
        }
    }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials in .env.local!");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Function to upload a file to Supabase Storage
async function uploadImage(localPath, bucketName) {
    try {
        const fullPath = path.join(rootDir, 'public', localPath);
        if (!fs.existsSync(fullPath)) {
            console.warn(`File not found: ${fullPath}`);
            return null; // Return null if file not found locally
        }

        const fileName = path.basename(localPath);
        const fileData = fs.readFileSync(fullPath);
        let contentType = 'image/png';
        if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) contentType = 'image/jpeg';
        if (fileName.endsWith('.webp')) contentType = 'image/webp';
        if (fileName.endsWith('.svg')) contentType = 'image/svg+xml';

        // Upload to supabase
        const { data, error } = await supabase.storage
            .from(bucketName)
            .upload(fileName, fileData, {
                contentType: contentType,
                upsert: true
            });

        if (error) {
            console.error(`Failed to upload ${fileName} to ${bucketName}:`, error.message);
            return null;
        }

        // Get public URL
        const { data: publicData } = supabase.storage.from(bucketName).getPublicUrl(fileName);
        return publicData.publicUrl;
    } catch (e) {
        console.error(`Exception uploading ${localPath}:`, e.message);
        return null;
    }
}

// Function to ensure bucket exists
async function ensureBucket(name) {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    if (error) throw error;
    if (!buckets.find(b => b.name === name)) {
        await supabase.storage.createBucket(name, { public: true });
        console.log(`Created public bucket: ${name}`);
    } else {
        console.log(`Bucket ${name} already exists.`);
    }
}

async function run() {
    try {
        console.log("Ensuring buckets exist...");
        await ensureBucket('menu-images');
        await ensureBucket('gallery');

        // Since we can't easily import the React data file if it has JSX/alias issues, 
        // we'll just read src/lib/data.js as text and dynamically extract the JSON using a quick regex/eval
        const dataContent = fs.readFileSync(path.join(rootDir, 'src', 'lib', 'data.js'), 'utf-8');
        
        let menuStr = dataContent.split('export const menuData = ')[1].split('export const galleryImages = ')[0];
        // remove trailing semicolon and whitespace
        menuStr = menuStr.trim().replace(/;$/, '');
        let menuData = eval(menuStr);

        let galleryStr = dataContent.split('export const galleryImages = ')[1].split('export const testimonials = ')[0];
        galleryStr = galleryStr.trim().replace(/;$/, '');
        let galleryImagesList = eval(galleryStr);

        console.log(`Found ${menuData.length} menu categories and ${galleryImagesList.length} gallery images.`);

        console.log("\n--- Processing Menu Items ---");
        // Clear existing menu items and gallery to prevent duplicates during testing
        await supabase.from('menu_items').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        await supabase.from('gallery_images').delete().neq('id', '00000000-0000-0000-0000-000000000000');

        let sortOrder = 0;
        for (const cat of menuData) {
            for (const item of cat.items) {
                console.log(`Uploading ${item.name} image...`);
                let imageUrl = '';
                if (item.image) {
                    // local image format is like "/menu/kachori.png", it maps to public/images/menu/kachori.png
                    // The site uses src={item.image} but the image is actually `public/menu/...` wait!
                    // Let me look at src/components/Menu.jsx line 178: src={item.image} -> `/menu/aloo-tikki-burger.png`
                    // This means they live in `public/menu/`, NOT `public/images/menu/`! Wait! I previously saw `public/images/menu/`.
                    // Wait, let's fix the path lookup:
                    let localPath = item.image;
                    if (localPath.startsWith('/')) localPath = localPath.substring(1);
                    
                    // Actually check where it is
                    let tryPath1 = path.join('images', localPath);
                    let tryPath2 = localPath; // if it's "menu/kachori.png" -> public/menu/kachori.png

                    let uploadedUrl = null;
                    if (fs.existsSync(path.join(rootDir, 'public', tryPath1))) {
                        uploadedUrl = await uploadImage(tryPath1, 'menu-images');
                    } else if (fs.existsSync(path.join(rootDir, 'public', tryPath2))) {
                        uploadedUrl = await uploadImage(tryPath2, 'menu-images');
                    } else {
                        console.log(`Warning: Could not find strict local file for ${item.image}`);
                    }

                    if (uploadedUrl) imageUrl = uploadedUrl;
                }

                // Insert into db
                await supabase.from('menu_items').insert({
                    name: item.name,
                    description: item.desc || '',
                    category: cat.category,
                    emoji: cat.emoji,
                    price: item.price,
                    image_url: imageUrl,
                    is_available: true,
                    sort_order: ++sortOrder
                });
                console.log(`Inserted menu item: ${item.name}`);
            }
        }

        console.log("\n--- Processing Gallery Images ---");
        let gallerySort = 0;
        for (const img of galleryImagesList) {
            console.log(`Uploading ${img.alt} image...`);
            let localPath = img.src;
            if (localPath.startsWith('/')) localPath = localPath.substring(1);

            let uploadedUrl = await uploadImage(localPath, 'gallery');
            if (uploadedUrl) {
                await supabase.from('gallery_images').insert({
                    title: img.alt,
                    category: img.category || 'food',
                    image_url: uploadedUrl,
                    sort_order: ++gallerySort
                });
                console.log(`Inserted gallery image: ${img.alt}`);
            }
        }

        console.log("\nMigration completed successfully!");

    } catch (e) {
        console.error("Fatal error:", e);
    }
}

run();
