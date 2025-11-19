import { normalizeString } from '../utils/stringUtils.js';

/**
 * Schéma de validation pour une formation
 */
const FORMATION_SCHEMA = {
    id: { type: 'number', required: true },
    titre: { type: 'string', required: true, minLength: 1 },
    description: { type: 'string', required: true, minLength: 1 },
    duree: { type: 'number', required: true, min: 1 },
    niveau: { type: 'string', required: true, enum: ['Débutant', 'Intermédiaire', 'Avancé'] },
    prix: { type: 'number', required: true, min: 0 },
    formateur: { type: 'string', required: true, minLength: 1 }
};

/**
 * Valide et nettoie une liste de formations
 * @param {Array} formations - Tableau de formations brutes
 * @returns {Object} - { valid: [], invalid: [], errors: [], warnings: [] }
 */
export function validateFormations(formations) {
    if (!Array.isArray(formations)) {
        return {
            valid: [],
            invalid: [],
            errors: ['Le fichier formations.json ne contient pas un tableau'],
            warnings: []
        };
    }

    const validFormations = [];
    const invalidFormations = [];
    const errors = [];
    const warnings = [];
    const seenIds = new Set();

    formations.forEach((formation, index) => {
        const formationErrors = [];
        const formationWarnings = [];

        // Validation du schéma
        const schemaValidation = validateSchema(formation, FORMATION_SCHEMA);
        if (schemaValidation.errors.length > 0) {
            formationErrors.push(...schemaValidation.errors);
        }
        if (schemaValidation.warnings.length > 0) {
            formationWarnings.push(...schemaValidation.warnings);
        }

        // Détection des doublons d'ID
        if (formation.id !== undefined) {
            if (seenIds.has(formation.id)) {
                formationErrors.push(`Doublon d'ID détecté : ${formation.id}`);
            } else {
                seenIds.add(formation.id);
            }
        }

        // Si des erreurs critiques, marquer comme invalide
        if (formationErrors.length > 0) {
            invalidFormations.push({
                index,
                formation,
                errors: formationErrors
            });
            errors.push(`Formation #${index + 1}: ${formationErrors.join(', ')}`);
        } else {
            // Nettoyer et normaliser la formation valide
            const cleanedFormation = cleanFormation(formation);
            validFormations.push(cleanedFormation);
        }

        // Ajouter les warnings
        if (formationWarnings.length > 0) {
            warnings.push(`Formation #${index + 1}: ${formationWarnings.join(', ')}`);
        }
    });

    return {
        valid: validFormations,
        invalid: invalidFormations,
        errors,
        warnings,
        stats: {
            total: formations.length,
            valid: validFormations.length,
            invalid: invalidFormations.length,
            duplicateIds: formations.length - seenIds.size
        }
    };
}

/**
 * Valide une formation selon le schéma défini
 * @param {Object} formation - Formation à valider
 * @param {Object} schema - Schéma de validation
 * @returns {Object} - { errors: [], warnings: [] }
 */
function validateSchema(formation, schema) {
    const errors = [];
    const warnings = [];

    for (const [field, rules] of Object.entries(schema)) {
        const value = formation[field];

        // Vérifier si le champ est requis
        if (rules.required && (value === undefined || value === null)) {
            errors.push(`Champ obligatoire manquant: ${field}`);
            continue;
        }

        // Si le champ n'est pas présent et n'est pas requis, passer
        if (value === undefined || value === null) {
            continue;
        }

        // Vérifier le type
        if (rules.type === 'string' && typeof value !== 'string') {
            errors.push(`${field} doit être une chaîne de caractères`);
            continue;
        }

        if (rules.type === 'number' && typeof value !== 'number') {
            errors.push(`${field} doit être un nombre`);
            continue;
        }

        // Validations spécifiques aux strings
        if (rules.type === 'string') {
            const trimmedValue = value.trim();

            if (rules.minLength && trimmedValue.length < rules.minLength) {
                errors.push(`${field} ne peut pas être vide`);
            }

            // Warning si la valeur contient des espaces superflus
            if (value !== trimmedValue) {
                warnings.push(`${field} contient des espaces superflus`);
            }
        }

        // Validations spécifiques aux nombres
        if (rules.type === 'number') {
            if (rules.min !== undefined && value < rules.min) {
                errors.push(`${field} doit être supérieur ou égal à ${rules.min}`);
            }

            if (rules.max !== undefined && value > rules.max) {
                errors.push(`${field} doit être inférieur ou égal à ${rules.max}`);
            }

            if (!Number.isFinite(value)) {
                errors.push(`${field} doit être un nombre fini`);
            }
        }

        // Validation enum
        if (rules.enum && !rules.enum.includes(value)) {
            // Vérifier aussi en normalisant les accents
            const normalizedValue = normalizeString(value);
            const normalizedEnums = rules.enum.map(e => normalizeString(e));

            if (!normalizedEnums.includes(normalizedValue)) {
                errors.push(`${field} doit être l'une des valeurs: ${rules.enum.join(', ')}`);
            } else {
                warnings.push(`${field} devrait utiliser la casse correcte`);
            }
        }
    }

    return { errors, warnings };
}

/**
 * Nettoie et normalise une formation
 * @param {Object} formation - Formation à nettoyer
 * @returns {Object} - Formation nettoyée
 */
function cleanFormation(formation) {
    return {
        id: formation.id,
        titre: formation.titre.trim(),
        description: formation.description.trim(),
        duree: formation.duree,
        niveau: formation.niveau.trim(),
        prix: formation.prix,
        formateur: formation.formateur.trim()
    };
}

/**
 * Génère un rapport de validation formaté
 * @param {Object} validationResult - Résultat de validateFormations
 * @returns {string} - Rapport formaté
 */
export function generateValidationReport(validationResult) {
    const { valid, invalid, errors, warnings, stats } = validationResult;

    let report = '\n=== RAPPORT DE VALIDATION DES FORMATIONS ===\n\n';
    report += `Total formations: ${stats.total}\n`;
    report += `✅ Valides: ${stats.valid}\n`;
    report += `❌ Invalides: ${stats.invalid}\n`;
    report += `🔁 Doublons d'ID: ${stats.duplicateIds}\n\n`;

    if (errors.length > 0) {
        report += '=== ERREURS DÉTECTÉES ===\n';
        errors.forEach(error => {
            report += `❌ ${error}\n`;
        });
        report += '\n';
    }

    if (warnings.length > 0) {
        report += '=== AVERTISSEMENTS ===\n';
        warnings.forEach(warning => {
            report += `⚠️  ${warning}\n`;
        });
        report += '\n';
    }

    if (invalid.length > 0) {
        report += '=== FORMATIONS INVALIDES ===\n';
        invalid.forEach(({ index, formation, errors }) => {
            report += `\nFormation #${index + 1}:\n`;
            report += `  Données: ${JSON.stringify(formation, null, 2)}\n`;
            report += `  Erreurs: ${errors.join(', ')}\n`;
        });
    }

    return report;
}
