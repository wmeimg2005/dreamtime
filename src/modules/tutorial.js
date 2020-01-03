// DreamTime.
// Copyright (C) DreamNet. All rights reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License 3.0 as published by
// the Free Software Foundation. See <https://www.gnu.org/licenses/gpl-3.0.html>
//
// Written by Ivan Bravo Bravo <ivan@dreamnet.tech>, 2020.

import { isNil } from 'lodash'
import introJs from 'intro.js'

export const tutorial = {
  upload() {
    const seen = localStorage.getItem('tutorial.upload')

    if (!isNil(seen)) {
      return
    }

    const intro = introJs()

    intro.setOptions({
      showBullets: false,
      overlayOpacity: 0.7,
      steps: [
        {
          intro: 'Welcome to DreamTime! Let me give you some information so you don\'t get lost. Let\'s start with the Nudification page.',
        },

        {
          intro: 'From this page you can upload the photos you want to nudify, DreamTime has several ways to obtain the photo.',
        },

        {
          element: '#uploader-dropzone',
          intro: 'The easiest one is to drag and drop the photos to this area. Here you can drop entire folders or even photos from a web browser.',
        },

        {
          element: '#uploader-alternatives',
          intro: 'Below are alternative methods, you can upload photos even from the Internet or Instagram.',
        },

        {
          element: '#uploader-settings',
          intro: 'What happens when uploading a photo is controlled by this option, initially it is established that the photos are placed in the Pending Queue. Speaking of the queue...',
        },

        {
          element: '#queuebar',
          intro: 'This is the Queue bar, here you will find all the photos you have uploaded and it will remain visible no matter what part of the application you are. The best way to take advantage of it is by uploading several photos, you can keep up to 1,000 at the same time!',
        },

        {
          element: '#queuebar-running',
          intro: 'This section will show the photo that is being nudified and the photos that are waiting.',
        },

        {
          element: '#queuebar-pending',
          intro: 'This section shows the photos that are pending, they will not be nudified until you start the process manually. Just click on the photo and you can access the page with all the information you need.',
        },

        {
          element: '#queuebar-finished',
          intro: 'This section will show the photos whose nudification has finished whether it was successful or not.',
        },

        {
          element: '#settings',
          intro: 'Do not forget to visit the settings, you can find several options to facilitate or improve your experience.',
        },

        {
          element: '#guide',
          intro: 'This is all for now, you can get more information by clicking on the Help link. Now is DreamTime!',
        },
      ],
    })

    intro.start()

    localStorage.setItem('tutorial.upload', 'true')
  },
}
