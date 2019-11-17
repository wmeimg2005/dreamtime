// DreamTime.
// Copyright (C) DreamNet. All rights reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License 3.0 as published by
// the Free Software Foundation. See <https://www.gnu.org/licenses/gpl-3.0.html>
//
// Written by Ivan Bravo Bravo <ivan@dreamnet.tech>, 2019.

/**
 * Pages that include this middleware will only be accessible
 * if the user has selected a photo to transform.
 */
export default function ({ route, redirect, $nudify }) {
  if (!$nudify.hasPhoto()) {
    redirect('/')
  }

  if (route.fullPath === '/nudify') {
    redirect('/nudify/summary')
  }
}
