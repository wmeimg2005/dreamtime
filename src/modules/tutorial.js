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
          intro: 'Welcome to DreamTime! Let me give you some information so you don\'t get lost. Let\'s start with the Nudification process.',
        },

        {
          intro: 'DreamTime has different ways in which you can upload the photo you want to nudify.',
        },

        {
          element: '#uploader',
          intro: 'The easiest one is to drag and drop your photos into the application, no matter what section you are in! Just drag and drop, it\'s that easy. You can drag entire folders, photos from the web browser or even web addresses.',
        },

        {
          element: '#uploader-alternatives',
          intro: 'On this page there are alternative ways, you can upload photos even from the Internet or Instagram.',
        },

        {
          element: '#uploader-settings',
          intro: 'What happens when uploading a photo is controlled by this option, initially it is set that the photos are placed in the Pending Queue. Speaking of the queue...',
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
          intro: 'This section shows the photos that are pending, they will not be nudified until you start the process manually.',
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

  badtime() {
    const seen = localStorage.getItem('tutorial.badtime')

    if (!isNil(seen)) {
      return
    }

    const intro = introJs()

    intro.setOptions({
      showBullets: false,
      overlayOpacity: 0.7,
      steps: [
        {
          intro: 'You have unlocked the BadTime easter-egg! Use the arrows on your keyboard to play while your photos are nudified in the background. Try to survive as long as possible! 💀🎮',
        },
      ],
    })

    intro.start()

    localStorage.setItem('tutorial.badtime', 'true')
  },

  preferences() {
    const seen = localStorage.getItem('tutorial.preferences')

    if (!isNil(seen)) {
      return
    }

    const intro = introJs()

    intro.setOptions({
      showBullets: false,
      overlayOpacity: 0.7,
      steps: [
        {
          intro: 'Photo preferences are an important part of DreamTime, each photo has its set of preferences with which it works best. Let me give you some information.',
        },

        {
          element: '#preferences-runs',
          intro: 'In this section you can find the options to execute several transformations in the same photo. The best way to take advantage of them is to increase the number of runs and activate the Randomize or Progressive option so that each run has different preferences and you can save the result that you like best.',
        },

        {
          element: '#preferences-body',
          intro: 'In this section you can customize the size of the body parts, this depends entirely on your tastes!',
        },

        {
          element: '#preferences-advanced-scale',
          intro: 'This option can dramatically increase or decrease the quality of the result. If you come from DeepNude, the Manual Crop option will be the one you feel most comfortable with, but we recommend you experiment with the other options and find the ideal one for your photo.',
        },

        {
          intro: 'That\'s all for now, as we said before we recommend you experiment with these preferences, with a little practice you will start creating amazing nudes!',
        },
      ],
    })

    intro.start()

    localStorage.setItem('tutorial.preferences', 'true')
  },
}
