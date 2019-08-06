![](assets/dreamtime.png)

# DreamTime

DreamTime is a friendly user interface that allows you to use [DreamPower](https://github.com/private-dreamnet/dreampower) to transform photos of people into free and **private** entertainment, something that in the past you could only dream of...

## Community

Join the social networks of DreamNet, the community interested in developing this technology. You can also join just to talk about anything, make friends or get help:

- [Keybase](https://keybase.io/team/dreamnet) (Our primary communication channel, here you will find the developers)
- [Twitter](https://twitter.com/DreamNetCom)
- [Facebook Group](https://web.facebook.com/groups/812542509140670)
- [Discord](https://i.imgur.com/411YVaL.png) :)

## Support

Developing DreamNet applications is time consuming! Help us accelerate development and offer better updates!

[![ko-fi](https://www.ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/R6R2ZSG3)

[![patreon](https://c5.patreon.com/external/logo/become_a_patron_button.png)](https://www.patreon.com/deepmanyy)

## Source Code

This technology was going to arrive sooner or later and we want to keep it open and free for everyone. Help us in our goal of developing more applications with this technology and bringing it to every possible taste.

- [GitHub](https://github.com/private-dreamnet/dreamtime)
- [NotABug](https://notabug.org/DreamNet/DreamTime)
- [GitGud](https://gitgud.io/dreamnet/dreamtime)

If you want to share or modify this Software please do it for the same purpose as we do and always release the source code of your modifications. Read the [LICENSE](LICENSE) for more information.

---

# 💜 Binaries

![](assets/preview.png)

## Requirements

- 64 bits OS
- Windows 7 SP1/Windows 8/Windows 10 1803+
- Ubuntu 16.04+
- **8 GB** of RAM or more.

> ⚠ **N versions of Windows 10** require installing the [Media Feature Pack](https://www.microsoft.com/en-us/software-download/mediafeaturepack).

## GPU Processing Requirements

- NVIDIA Graphics card with CUDA compatibility
- [Latest NVIDIA drivers](https://www.nvidia.com/Download/index.aspx)

> 👉 If you do not have an NVIDIA or compatible graphics card you can use CPU processing.

## Download

_Work In Progress_

## Installation

_Work In Progress_

## F.A.Q.

**Q: Why does the program ask for firewall permissions?**

A: For now the GUI needs to create a local server on your computer to render the interface of the program, basically the GUI is a web browser. Yes I am aware that this method is "retarded" but it is temporary. No, it's not a virus, a botnet or anything like that, I'm not interested in your photos or your files.

---

# 💻 Development > 🚧 Area only for developers!

## Requirements

- [CUDA 10.0](https://developer.nvidia.com/cuda-10.0-download-archive)
- [Python 3.6](https://www.python.org/downloads/release/python-368/)
- [NodeJS 10+](https://nodejs.org/en/)
- [Yarn](https://yarnpkg.com/en/docs/install)

## What should I know?

- [Python](https://www.codecademy.com/catalog/language/python): For the development of the CLI, the transformation algorithm and the neural network.
- [HTML & CSS](https://www.codecademy.com/catalog/language/html-css), [JavaScript](https://www.codecademy.com/catalog/language/javascript): For website development (The GUI is a website 😮)
- [VueJS](https://vuejs.org/), [NuxtJS](https://nuxtjs.org/): The frameworks that have been used to build the GUI. _(VueJS is the best #changemymind)_
- [Electron](https://electronjs.org/): The software used to "transform" the GUI from a website to a desktop program.

## Setup

> All the source code is inside the src/ folder, from now on all the instructions will be based on this folder.

### Quick Setup

Inside the folder `scripts/` you will find folders for the different supported operating systems, within each folder there is a series of scripts that will allow you to prepare the project for its development.

- **setup**: This script will install all the necessary requirements for Python and NodeJS. In theory you only need to run this script once per version.
- **build**: This script will compile the project in the `dist/` folder (generate the binaries for CLI and GUI), once finished you can compress the `dist/` folder and share it with the world.
- **dev-start**: This script will launch 2 processes, one to start the NuxtJS server (which will compile all the CSS, JavaScript and Vue files) and other that will start Electron that will load the NuxtJS server. Any change you make in `gui/` will be reflected in real time.

> ⚠ If you use [Anaconda](https://www.anaconda.com/) or some other program that encapsulates Python or NodeJS in their own development environment it is very likely that these scripts fail, you will have to read the content and execute the commands manually.

> ⚠ The NuxtJS server incorporates an HTTP server to view the live application in a web browser, **you must not access the web address indicated by the console**, the application only works when it is opened from Electron.

> 👉 The scripts for **macOS** are the same as those for Linux. [More information](src/scripts/mac/README.md).
