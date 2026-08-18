// validation.js
const { z } = require('zod');

const nodeIdSchema = z
  .string()
  .min(1)
  .max(20)
  .regex(/^[a-zA-Z]+[0-9]+$/, 'Expected an ID like "d6" or "ac12"');

function validateParam(paramName, schema = nodeIdSchema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.params[paramName]);
    if (!result.success) {
      return res.status(400).json({
        error: `Invalid ${paramName}`,
        details: result.error.issues.map((i) => i.message),
      });
    }
    req.params[paramName] = result.data;
    next();
  };
}

module.exports = { nodeIdSchema, validateParam };