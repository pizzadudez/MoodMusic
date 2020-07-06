const router = require('express').Router();
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDoc = YAML.load('./src/docs/swagger.yaml');

router.use('/', swaggerUi.serve);
router.use('/', swaggerUi.setup(swaggerDoc));

module.exports = router;
