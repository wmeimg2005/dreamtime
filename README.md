![](assets/dreamtime.png)

[![Build Status](https://github.com/dreamnettech/dreamtime/workflows/CI/CD/badge.svg)](https://github.com/dreamnettech/dreamtime/actions)
[![GitHub All Releases](https://img.shields.io/github/downloads/dreamnettech/dreamtime/total?logo=github&logoColor=white)](https://github.com/dreamnettech/dreamtime/releases)

![GitHub](https://img.shields.io/github/license/dreamnettech/dreamtime)
![GitHub top language](https://img.shields.io/github/languages/top/dreamnettech/dreamtime)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/0ecb8ba6eeae42e7bfd0d414d1bacee1)](https://www.codacy.com/app/kolessios/dreamtime?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=dreamnettech/dreamtime&amp;utm_campaign=Badge_Grade)
[![Maintainability](https://api.codeclimate.com/v1/badges/8d325515768f221e235f/maintainability)](https://codeclimate.com/github/dreamnettech/dreamtime/maintainability)


# DreamTime

DreamTime allows you to "nudify" photos of people in the most accessible way possible. 
**Exclusive use for private entertainment.**

![](assets/preview.png)

If you want to share or modify this Software please do it for the same purpose as we do and always release the source code of your modifications. Read the [LICENSE](LICENSE) for more information.

## DreamNet

We are a community interested in developing decentralized applications free of censorship. Join our social networks or repositories:

- [Chat](https://chat.dreamnet.tech)
- [Twitter](https://twitter.com/DreamNetTechno)
- [Facebook](https://web.facebook.com/DreamNetTechnology)
- [GitHub](https://github.com/dreamnettech)
- [NotABug](https://notabug.org/DreamNet)
- [GitGud](https://gitgud.io/dreamnet)

## Support

Developing DreamNet applications is time consuming! Help us accelerate development and offer better updates!

[![Ko-fi](https://img.shields.io/badge/support%20with%20coffe-ff5e5b?logo=ko-fi&logoColor=white&style=for-the-badge)](https://ko-fi.com/R6R2ZSG3)

[![patreon](https://img.shields.io/badge/become%20a%20patron-fb6c54?logo=patreon&logoColor=white&style=for-the-badge)](https://www.patreon.com/dreamnet)

[![coinbase](https://img.shields.io/badge/support%20with%20bitcoin-000000?logo=bitcoin&logoColor=white&style=for-the-badge)](https://commerce.coinbase.com/charges/27J877GZ)

---

# 💜 Binaries

## Requirements

  - 64 bits OS
  - Windows 7 SP1, Windows 8, Windows 10 1803+
  - Ubuntu 16.04+
  - 🧪 macOS 10.13+
  - **8 GB+** of RAM.

> ⚠ **N versions of Windows 10** require installing the [Media Feature Pack](https://www.microsoft.com/en-us/software-download/mediafeaturepack).

> 🧪 **macOS** support is in an experimental phase, current version of DreamTime has not been developed with a "cpu-only" or "macOS" support in mind, some features may fail.

## GPU Processing Requirements

  - NVIDIA Graphics card with minimum [3.5 CUDA compute capability](https://developer.nvidia.com/cuda-gpus)
  - [Latest NVIDIA drivers](https://www.nvidia.com/Download/index.aspx)

> 👉 If you do not have an NVIDIA or compatible graphics card you can use CPU processing.

## Download


[![GitHub All Releases](https://img.shields.io/github/downloads/dreamnettech/dreamtime/total?logo=github&logoColor=white&style=for-the-badge&labelColor=181717&color=blue)](https://github.com/dreamnettech/dreamtime/releases)

### Mirrors

[![Windows](https://img.shields.io/badge/cdn-v1.1.0-0078D6?logo=windows&logoColor=white&style=for-the-badge)](https://cdn.dreamnet.tech/releases/dreamtime/v1.1.0/DreamTime-v1.1.0-windows-x64.exe)

[![Ubuntu](https://img.shields.io/badge/cdn-v1.1.0-E95420?logo=ubuntu&logoColor=white&style=for-the-badge)](https://cdn.dreamnet.tech/releases/dreamtime/v1.1.0/DreamTime-v1.1.0-ubuntu-x64.deb)

[![macOS](https://img.shields.io/badge/cdn-v1.1.0%20(Experimental)-999999?logo=Apple&logoColor=white&style=for-the-badge)](https://cdn.dreamnet.tech/releases/dreamtime/fc09024/DreamTime-v1.1.0-macos-cpuonly.dmg)

## F.A.Q.

**Q: Why does the program ask for firewall permissions?**

A: We use [Rollbar](https://rollbar.com/) and [Nucleus](https://nucleus.sh/) to obtain telemetry information of the program mainly for automatic error reporting and to obtain real-time application information.

We do not store any personal information or photos that have been processed with the program, everything is kept securely on your computer, if you prefer you can use the program in offline mode or disable telemetry.

---

# 💻 Development

## Requirements

  - [CUDA 10.0](https://developer.nvidia.com/cuda-10.0-download-archive)
  - [Python 3.6.2+](https://www.python.org/downloads/release/python-368/)
  - [NodeJS 10+](https://nodejs.org/en/)
  - [Yarn](https://yarnpkg.com/en/docs/install)

## What should I know?

  - [HTML, CSS](https://www.codecademy.com/catalog/language/html-css), [JavaScript](https://www.codecademy.com/catalog/language/javascript): For website development (DreamTime is a website 😮)
  - [SCSS](https://sass-lang.com/): CSS Preprocessor
  - [TailwindCSS](https://tailwindcss.com/): CSS Framework
  - [VueJS](https://vuejs.org/), [NuxtJS](https://nuxtjs.org/): The JavaScript frameworks. _(VueJS is the best #changemymind)_
  - [Electron](https://electronjs.org/): The software used to "transform" DreamTime from a website to a desktop program.

## Setup

> All the source code is inside the src/ folder, from now on all the instructions will be based on this folder.

### Quick Setup

Inside the folder `scripts/` you will find Python scripts that will allow you to prepare the project for all phases, these scripts are compatible with Windows, Linux and macOS.

- **setup.py**: This script will install all the necessary requirements for Python and NodeJS. In theory you only need to run this script once per version.
- **build.py**: This script will compile the project in the `dist/` folder, once it's finished you can share the executable (exe, deb, dmg) inside the folder.
- **dev-start.py**: This script will launch 2 processes, one to start the NuxtJS server (which will compile all the CSS, JavaScript and Vue files) and other that will start Electron that will load the NuxtJS server. Any change you make will be reflected in real time.

To see possible options for these scripts run `--help`

```
python3 setup.py --help
python3 build.py --help
```

> ⚠ If you use [Anaconda](https://www.anaconda.com/) or some other program that encapsulates Python or NodeJS in their own development environment it is very likely that these scripts fail, you will have to read the content and execute the commands manually.

> ⚠ The NuxtJS server incorporates an HTTP server to view the live application, **you must not access the URL indicated by the console**, the application only works when it is loaded from Electron.

## Pull Requests

We seek to improve the software in every possible way, if you want to make a contribution you are welcome to make a Pull Request, just make sure you do it to the **canary branch**.

## ⚠ Drastic Changes in v1.0.0+

Because DreamTime has been the **victim of users who take the source code and sell it without complying with the LICENSE conditions**, we are forced to implement certain very unfriendly changes for an open-source project, we apologize for all the inconvenience this may cause, these changes are **temporary** until DreamTime has been noticed on social networks to prevent people from falling into a possible SCAM.

To avoid an alert with information from DreamTime
when you start your program, please make sure you **don't change the name or type of license** on your fork.