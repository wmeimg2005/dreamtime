// DreamTime.
// Copyright (C) DreamNet. All rights reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License 3.0 as published by
// the Free Software Foundation. See <https://www.gnu.org/licenses/gpl-3.0.html>
//
// Written by Ivan Bravo Bravo <ivan@dreamnet.tech>, 2020.

import {
  isNil, map, isArray,
} from 'lodash'

import { Consola } from '~/modules/consola'
import { Nudify } from '~/modules/nudify'

const consola = Consola.create('upload')

const { dialog } = $provider.api

export const UploadMixin = {
  data: () => ({
    isDragging: false,
    dragCounter: 0,
  }),

  mounted() {
    this.$router.afterEach(() => {
      this.dragCounter = 0
    })
  },

  methods: {
    /**
     * File selected, start a new transformation process
     */
    addFile(file) {
      if (isNil(file)) {
        return
      }

      Nudify.addFile(file.path)
    },

    /**
     *
     */
    async addFiles(files) {
      if (!isArray(files)) {
        return
      }

      await Nudify.addFiles(files)
    },

    /**
     *
     */
    openFolder() {
      const paths = dialog.showOpenDialogSync({
        properties: ['openDirectory'],
      })

      consola.track('UPLOAD_FOLDER')

      this.addFiles(paths)
    },

    /**
     *
     */
    onDragEnter(event) {
      event.preventDefault()
      event.dataTransfer.dropEffect = 'copy'

      this.dragCounter += 1

      this.isDragging = true
    },

    /**
     *
     */
    onDragLeave() {
      this.dragCounter -= 1

      if (this.dragCounter === 0) {
        this.isDragging = false
      }
    },

    /**
     *
     */
    onDragOver(event) {
      event.preventDefault()
      event.stopPropagation()

      event.dataTransfer.dropEffect = 'copy'
      this.isDragging = true
    },

    /**
     *
     */
    onDrop(event) {
      event.preventDefault()
      event.stopPropagation()

      this.isDragging = false

      const { files } = event.dataTransfer
      const url = event.dataTransfer.getData('url')

      if (url.length > 0) {
        Nudify.addUrl(url)
        consola.track('DROP_URL')
      } else if (files.length > 0) {
        const paths = map(files, 'path')
        this.addFiles(paths)
        consola.track('DROP_FILE')
      }
    },
  },
}
