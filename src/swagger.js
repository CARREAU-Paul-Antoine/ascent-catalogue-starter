import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Ascent Catalogue',
            version: '1.0.0',
            description: 'Documentation API du catalogue des formations',
        },
        servers: [
            {
                url: 'http://localhost:4200', // change selon l’URL de ton serveur
                description: 'Serveur local'
            }
        ],
    },
    apis: ['./routes/*.js', './controllers/*.js'], // chemins des fichiers où écrire les commentaires Swagger
};

const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(app) {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
