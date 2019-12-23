const _ = require('lodash');

module.exports = {
  extend: 'apostrophe-widgets',
  label: 'Add LD+JSON',
  addFields: [
    {
      name: 'dynamic',
      label: 'Dynamic fields',
      type: 'array',
      schema: [
        {
          name: 'key',
          label: 'Key',
          type: 'string',
          required: true
        },
        {
          name: 'field',
          label: 'Field',
          type: 'select',
          choices: 'getSchemaFields'
        }
      ]
    },
    {
      name: 'static',
      label: 'Static fields',
      type: 'array',
      schema: [
        {
          name: 'key',
          label: 'Key',
          type: 'string',
          required: true
        },
        {
          name: 'value',
          label: 'Value',
          type: 'string'
        }
      ]
    }
  ],
  construct: (self, options) => {
    self.getSchemaFields = async function(req) {
      const doc = await self.apos.docs.find(req, { 'advisoryLock._id': req.headers['apostrophe-html-page-id'] }).toObject();
      const type = doc.type.replace('-pages', '');
      let fields = [];

      self.apos.modules[type].schema.forEach(field => {
        let value = field.name;
        if (field.schema || field.type.match(/join/)) {
          //TODO: recursive calls
          //TODO: projection for joins
          const suffix = field.type === 'array' ? 'array' : 'object';
          const schema = field.schema || self.apos.modules[field.withType + 's'].schema;
          schema.forEach(subfield => {
            value = field.name + '|' + subfield.name + '|' + suffix;
            fields.push({ label: field.name + ' - ' + subfield.name, value });
          })
        } else {
          if (field.type === 'area' || field.type === 'singleton' ) {
            value += '|area';
          }
          fields.push({ label: field.name, value });
        }
      })

      return fields;
    }
  }
};
