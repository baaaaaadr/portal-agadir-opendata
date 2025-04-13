import { readdir, readFile, writeFile, stat } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// --- Configuration ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Remonte d'un niveau car le script est dans le dossier 'scripts'
const projectRoot = path.resolve(__dirname, '..');
const outputFileName = 'Allcode.txt'; // Nom du fichier de sortie

// Extensions de fichiers à inclure
const includeExtensions = ['.js', '.jsx', '.css', '.html', '.json', '.md'];
// Fichiers spécifiques importants à inclure (même si leur extension n'est pas listée)
const includeSpecificFiles = ['tailwind.config.js', 'postcss.config.js', 'vite.config.js', 'package.json', 'README.md'];
// Dossiers à exclure complètement
const excludeDirs = ['node_modules', '.git', 'dist', '.vscode', '.idea', 'scripts']; // Exclut aussi le dossier scripts lui-même
// Fichiers spécifiques à exclure
const excludeFiles = [outputFileName, 'package-lock.json', '.env']; // Très important d'exclure .env !

console.log('--- Script de Contexte Démarré ---');
console.log(`Racine du projet: ${projectRoot}`);

// --- Fonction pour trouver les fichiers récursivement ---
async function findFilesRecursive(dir, rootDir) {
    let filesList = [];
    try {
        const items = await readdir(dir, { withFileTypes: true });
        for (const item of items) {
            const fullPath = path.join(dir, item.name);
            const relativePath = path.relative(rootDir, fullPath).replace(/\\/g, '/'); // Normalise les slashs

            // Vérifie les exclusions
            if (excludeDirs.some(exDir => relativePath.startsWith(exDir + '/')) || excludeDirs.includes(item.name) || excludeFiles.includes(item.name)) {
                continue;
            }

            if (item.isDirectory()) {
                filesList = filesList.concat(await findFilesRecursive(fullPath, rootDir));
            } else {
                const ext = path.extname(item.name).toLowerCase();
                const baseName = item.name;
                // Inclure si l'extension ou le nom de fichier spécifique correspondent
                if (includeExtensions.includes(ext) || includeSpecificFiles.includes(baseName)) {
                     // Double vérification pour exclure par nom
                     if (!excludeFiles.includes(baseName)) {
                         filesList.push(relativePath);
                     }
                }
            }
        }
    } catch (err) {
        console.error(`Erreur lors de la lecture du dossier ${dir}:`, err.message);
    }
    return filesList;
}

// --- Fonction pour générer l'arborescence (simplifiée) ---
async function generateSimpleTree(dir, rootDir, prefix = '') {
    let treeString = '';
    try {
        const items = await readdir(dir, { withFileTypes: true });
        const filteredItems = items.filter(item =>
            !(excludeDirs.includes(item.name) || excludeFiles.includes(item.name) || item.name.startsWith('.'))
        );

        for (let i = 0; i < filteredItems.length; i++) {
            const item = filteredItems[i];
            const isLast = i === filteredItems.length - 1;
            const connector = isLast ? '└── ' : '├── ';
            const itemPath = path.join(dir, item.name);
            const relativePath = path.relative(rootDir, itemPath).replace(/\\/g, '/');

            treeString += `${prefix}${connector}${item.name}\n`;

            if (item.isDirectory() && !excludeDirs.some(exDir => relativePath.startsWith(exDir + '/'))) {
                const newPrefix = prefix + (isLast ? '    ' : '│   ');
                treeString += await generateSimpleTree(itemPath, rootDir, newPrefix);
            }
        }
    } catch (err) {
        console.error(`Erreur lors de la génération de l'arborescence pour ${dir}:`, err.message);
    }
    return treeString;
}


// --- Fonction Principale ---
async function createContextFile() {
    let outputContent = `Contexte Complet du Projet: ${path.basename(projectRoot)}\n`;
    outputContent += `Généré le: ${new Date().toISOString()}\n\n`;

    console.log('Génération de l\'arborescence...');
    outputContent += '=== ARBORESCENCE DU PROJET (Simplifiée) ===\n';
    outputContent += path.basename(projectRoot) + '\n'; // Ajoute le nom du dossier racine
    outputContent += await generateSimpleTree(projectRoot, projectRoot);
    outputContent += '\n';


    console.log('Recherche des fichiers pertinents...');
    const relevantFiles = (await findFilesRecursive(projectRoot, projectRoot)).sort();
    console.log(`Trouvé ${relevantFiles.length} fichiers pertinents.`);


    outputContent += '\n=== CONTENU DES FICHIERS ===\n\n';
    console.log('Lecture du contenu des fichiers...');
    for (const relativeFilePath of relevantFiles) {
        const fullPath = path.join(projectRoot, relativeFilePath);
        outputContent += `--- START OF FILE: ${relativeFilePath} ---\n`;
        try {
            const content = await readFile(fullPath, 'utf-8');
            outputContent += content.trim() === '' ? '(Fichier vide)' : content; // Indique si fichier vide
        } catch (err) {
            console.error(`Erreur de lecture du fichier ${relativeFilePath}:`, err.message);
            outputContent += `!!! ERREUR LORS DE LA LECTURE DU FICHIER: ${err.message} !!!`;
        }
        outputContent += `\n--- END OF FILE: ${relativeFilePath} ---\n\n`;
    }

    const outputFilePath = path.join(projectRoot, outputFileName);
    console.log(`Écriture du contexte dans ${outputFilePath}...`);
    try {
        await writeFile(outputFilePath, outputContent);
        console.log(`\nFichier '${outputFileName}' créé avec succès !`);
        console.log(`Contient ${relevantFiles.length} fichiers.`);
    } catch (err) {
        console.error('Erreur lors de l\'écriture du fichier de sortie:', err);
    }
    console.log('--- Script de Contexte Terminé ---');
}

// Exécute la fonction principale
createContextFile();