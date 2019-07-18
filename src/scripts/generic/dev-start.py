import argparse
import logging

import subprocess

from _common import get_os, setup_log, OS, cd, check_node, check_yarn, get_python_version

parser = argparse.ArgumentParser(description='cli and gui builder')
parser.add_argument('-d', '--debug', action='store_true',
                    help='Set log level to Debug')

do = parser.add_mutually_exclusive_group()
do.add_argument('--cli', action='store_true', help='Build only the cli')
do.add_argument('--gui', action='store_true', help='Build only the gui')
args = parser.parse_args()

log = setup_log(logging.DEBUG if args.debug else logging.INFO)
do_all = not(args.cli or args.gui)


## System & Dependencies Check
detected_os = get_os()
detected_py = get_python_version()
log.debug("OS : {}".format(detected_os))
log.debug("Python version : {}".format(detected_py))

if detected_os == OS.UNKNOWN:
    log.fatal("Unknown OS !")
    exit(1)

if detected_py < (3, 5):
    log.fatal("Unsupported python version !")
    exit(1)

if not check_node():
    log.fatal("NodeJs is not install. It's a required dependency !")
    exit(1)

if not check_yarn():
    log.fatal("Yarn is not install. It's a required dependency !")
    exit(1)

with cd("../../gui"):
    subprocess.Popen(["yarn", "dev"])
    subprocess.Popen(["yarn", "dev-gui"])
