// DreamTime.
// Copyright (C) DreamNet. All rights reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License 3.0 as published by
// the Free Software Foundation. See <https://www.gnu.org/licenses/gpl-3.0.html>
//
// Written by Ivan Bravo Bravo <ivan@dreamnet.tech>, 2019.

import * as paths from './paths'
import * as shell from './shell'
import * as power from './power'
import * as fs from './fs'
// import * as photo from './photo'
import * as instagram from './instagram'

// eslint-disable-next-line import/no-cycle
export { fs }
export { shell }
export { paths }
export { power }
export { instagram }
// export { photo }
export { system } from './system'
export utils from 'electron-util'
