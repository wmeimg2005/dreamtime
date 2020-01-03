import { cloneDeep, isEqual, isNative } from 'lodash'

/**
 * Helper to handle custom v-model
 * @mixin
 */
export default {
  props: {
    /**
     * @model
     */
    value: {
      default: null,
    },
  },

  data: () => ({
    /**
     * Current value, this is the variable that must be changed.
     */
    currentValue: null,
  }),

  created() {
    // initial value.
    if (!isNative(this.value)) {
      this.currentValue = this.value
    } else {
      this.currentValue = cloneDeep(this.value)
    }
  },

  watch: {
    /**
     * Local value changed, update the v-model.
     */
    currentValue: {
      handler(value) {
        if (isEqual(this.value, value)) {
          return
        }

        this.$emit('input', value)
      },
      deep: true,
    },

    /**
     * v-model value changed, update the local value.
     */
    value(value) {
      if (isEqual(this.currentValue, value)) {
        return
      }

      this.currentValue = value
    },
  },
}
