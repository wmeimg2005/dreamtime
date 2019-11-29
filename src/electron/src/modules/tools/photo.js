// DreamTime.
// Copyright (C) DreamNet. All rights reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License 3.0 as published by
// the Free Software Foundation. See <https://www.gnu.org/licenses/gpl-3.0.html>
//
// Written by Ivan Bravo Bravo <ivan@dreamnet.tech>, 2019.

import fs from 'fs-extra'
import { Image } from 'image-js'
// const { Caman } = require('caman')

/**
 * This is probably not a good cropper, but it's all I have now...
 *
 * @param {Photo} photo
 * @param {HTMLCanvasElement} canvas
 */
export function crop(canvas, destination) {
  const image = Image.fromCanvas(canvas)
  return image.save(destination)
}

/**
 *
 * @param {*} photo
 * @param {*} canvas
 */
export const legacyCrop = async (photo, canvas) => {
  const canvasAsDataURL = canvas.toDataURL(
    photo.getSourceFile().getMimetype(),
    1,
  )

  await photo.getCroppedFile().writeDataURL(canvasAsDataURL)

  if (!fs.existsSync(photo.getCroppedFile().getPath())) {
    throw new Error(
      'There was a problem trying to save the cropped photo. Please make sure the program has write permissions.',
    )
  }
}
