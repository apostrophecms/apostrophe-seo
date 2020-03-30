$(function() {
  var superPopulate = apos.schemas.fieldTypes.string.populate;
  apos.schemas.fieldTypes.string.populate = function(data, name, $field, $el, field, callback) {
    return superPopulate(data, name, $field, $el, field, function(err) {
      if (err) {
        return callback(err);
      }
      if (field.seoSoftMin || field.seoSoftMax) {
        $field.on('textchange', update);
        $field.on('change', update);
      }
      return callback(null);
    });

    function update() {
      var len = $field.val().length;
      if (len && (len < field.seoSoftMin)) {
        warning('You have not reached the recommended minimum of  ' + field.seoSoftMin + ' characters');
      } else if (len && (len > field.seoSoftMax)) {
        warning('You have exceeded the recommended maximum of ' + field.seoSoftMax + ' characters');
      } else {
        clearWarning();
      }
    }

    // Follow the pattern used for apos schema errors
    function warning(s) {
      var $fieldset = $field.closest('[data-name]');
      var $label = $fieldset.find('label:first');
      $fieldset.addClass('apos-seo-soft-limit');
      $label.attr('data-apos-seo-soft-limit-message', s);
    }

    function clearWarning() {
      var $fieldset = $field.closest('[data-name]');
      var $label = $fieldset.find('label:first');
      $fieldset.removeClass('apos-seo-soft-limit');
      $label.removeAttr('data-apos-seo-soft-limit-message');
    }
  };
});
