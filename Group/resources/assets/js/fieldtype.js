Vue.component('group-fieldtype', {

  mixins: [Fieldtype],

  template: `
    <div class="grid-field grid-mode-stacked">
      <div class="grid-stacked">
        <div class="list-group">
          <div class="list-group-item p-0">
            <div class="publish-fields">
              <div v-for="field in child_fields" :class="fieldClasses(field)">
                <label class="block">
                  <template v-if="field.display">{{ field.display }}</template>
                  <template v-if="!field.display">{{ field.name | capitalize }}</template>
                  <i class="required" v-if="field.required">*</i>
                </label>
                <small class="help-block" v-if="field.instructions" v-html="field.instructions | markdown"></small>
                <component :is="componentName(field.type)"
                           :name="name + '.' + field.name"
                           :data.sync="data[field.name]"
                           :config="field">
                </component>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,

  created: function() {
    /**
     * Grab the defined fieldset and inject into the fieldset.
     * Uses Vue Resource, included with Statamic
     * https://github.com/pagekit/vue-resource
     */
    this.$http
        .get(cp_url(`fieldsets-json/${this.config.child_fieldset}`))
        .then(response => {
          const child_fieldset = new ChildFieldset(response);
          this.child_fields = child_fieldset.fields();
          this.loading = !true;
          this.bindChangeWatcher();
        }, response => {
          if (response.status == 500) {
            console.log('Error: Group\'s child fieldset not found. Please check the Extras tab of the group fieldset and make sure a value is set.')
          }
        })
  },

  data: function() {
    return {
      autoBindChangeWatcher: false,
      child_fields: [],
      loading: true
    }
  },

  methods: {
    /**
     * Ensures that the fieldname is in the correct format for
     * async call.
     * 
     * @param string fieldType 
     */
    componentName(fieldType) {
      return fieldType.replace('.', '-') + '-fieldtype';
    },
    /**
     * 
     * @param string field 
     */
    fieldClasses(field) {
      return [
        'form-group',
        'p-2',
        'm-0',
        field.type + '-fieldtype',
        tailwind_width_class(field.width),
        field.classes || ''
      ];
    }
  }

});

/**
 * Fieldset parser is available at "../../../../../../statamic/resources/js/components/publish/Fieldset.js"
 */
class ChildFieldset {
  constructor(fieldset) {
    this.fieldset = fieldset;
    this.name = fieldset.data.title.toLowerCase().replace(' ', '_');
    this.sections = this.parseSections(fieldset.data.sections);
    this.metaFields = [];
  }

  parseSections(sections) {
    return _.chain(sections)
            .mapObject((section, handle) => {
                section.handle = handle;
                section.fields = this.parseFields(section.fields);
                return section;
            })
            .values()
            .value();
  }
  
  parseFields(fields) {
    return _.chain(fields)
            .mapObject((config, handle) => {
                config.name = handle;
                return config;
            })
            .values()
            .value();
  }

  fields() {
    return _.chain(this.sections)
            .pluck('fields')
            .flatten()
            .value();
  }
}
