<template>
  <div class="settings-fields">
    <section class="settings-fields-section">
      <form-inline-field
        label="Device"
        hint="GPU is fast but is only compatible with an NVIDIA graphics card. CPU is slower but has support for all computers.">
        <select class="input">
          <option value="CPU">CPU</option>
          <option value="GPU">GPU</option>
        </select>
      </form-inline-field>

      <form-inline-field
        label="GPUs"
        hint="List of GPUs that will be used for the transformation.">
        <select class="input">
          <option value="CPU">CPU</option>
          <option value="GPU">GPU</option>
        </select>
      </form-inline-field>

      <form-inline-field
        label="Photo restoration"
        hint="Restore the cropped photo to the original photo">
        <select class="input">
          <option value="true">Enabled</option>
          <option value="false">Disabled</option>
        </select>
      </form-inline-field>
    </section>
  </div>
</template>

<script>
export default {}
</script>

