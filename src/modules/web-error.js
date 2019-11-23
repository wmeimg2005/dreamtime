// DreamTime.
// Copyright (C) DreamNet. All rights reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License 3.0 as published by
// the Free Software Foundation. See <https://www.gnu.org/licenses/gpl-3.0.html>
//
// Written by Ivan Bravo Bravo <ivan@dreamnet.tech>, 2019.

import _ from 'lodash'
import { markdown } from 'markdown'
import { api } from 'electron-utils'
import swal from 'sweetalert'

const { AppError } = $provider

export class WebError extends AppError {
  show() {
    let icon = 'error'

    if (this.level === 'warning' || this.level === 'warn') {
      icon = 'warning'
    }

    if (this.level === 'info') {
      icon = 'info'
    }

    swal({
      title: this.title,
      content: this.message,
      icon,
    })

    if (this.options.fatal) {
      api.app.quit()
    }
  }
}
