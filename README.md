![](https://i.imgur.com/rV3bPPk.png)

# PepeNude

PepeNude is an application that allows you to use the power of your CPU or GPU to transform photos of people and get free entertainment, the goal of PepeNude is to offer a **CLI** to process photos from the console and a new **GUI** (Graphical user interface) to use the program easily.

- The CLI version allows you to transform photos using commands, with this you can create automated systems such as _bots, web pages or a new GUI_. Use the argument `--help` to get more information about usage, keep in mind that the CLI by itself **does not have** a cropping system so you will have to manually resize your photos to 512x512

- The GUI version is a new friendly interface that includes a cropping system, so you only have to tell the program which photo you want to transform and you will get results in a few clicks.

## Community

Join the community of people who use the project either for entertainment or development purposes, you can get valuable help or create interesting discussions to improve the future of PepeNude:

- [Discord](https://discord.gg/RjBSaND) (More active)
- [Telegram](https://t.me/easydeepnudegallery)

## Backups

To avoid the loss of the project and the code, it will be hosted at the following sites:

- [Github](https://github.com/deep-man-yy/pepenude)
- ~~[Bitbucket](https://bitbucket.org/deepmanyy/easydeepnude/src)~~
- [Gitlab](https://gitlab.com/deepmanyy/easydeepnude)
- [NotABug](https://notabug.org/deepmanyy/pepenude)
- [GitGud](https://gitgud.io/deepmanyy/easydeepnude)

Remember that you can follow the project or make a fork and create your own version! Read the [LICENSE](LICENSE.md) for more information.

# Alpha

![](https://i.imgur.com/LZo61bq.jpg)

PepeNude is in an alpha version so it can be unstable or not work directly under certain conditions (which I often do not know)

I will try to help in any problem you have.

Preview _(NSFW)_:
https://i.imgur.com/Gj5n2ox.gif

---

# Binaries - Ready to use

## Requirements

- [Latest NVIDIA drivers](https://www.nvidia.com/Download/index.aspx) or [CUDA 10.0](https://developer.nvidia.com/cuda-10.0-download-archive) (If you are going to use GPU processing. CUDA can be optional on the latest graphics cards)

## Download

If you are not a developer or are only interested in using the program, these are the files you should download:

- [CLI](https://drive.google.com/open?id=1kvXI4mSOu-teUYl8O2MH5mMLo_Vs0gCe): _The program responsible for transforming the photos. It is heavier than the original due to the implementation of GPU processing._
- [CLI Checkpoints](https://drive.google.com/open?id=1w6ZO47To4BGh67WjeFCTBZiGVMFrK_po): _The models used by the artificial intelligence. Yes, they are required._
- [GUI](https://drive.google.com/open?id=1NgAATqhh8GNwBHOvJOo0vvgtX_OvsOXF): _The graphical user interface so you do not have to use commands or manually crop the photo._

## Installation

- If you want to use only the console version, download the **CLI** and **CLI Checkpoints** zip files.
- If you want to use the version with graphical interface download all 3 zip files.
- Create a folder called "easydeepnude" (where you want), open it and inside place the zip files you have downloaded.
- Unzip the **CLI.zip** and **GUI.zip** file (if you downloaded it) In the end you should have the folders `cli/` and `gui/`.
- Unzip the contents of **checkpoints.zip** inside the `cli/` folder. At the end you must have the folder `cli/checkpoints` folder with 3 .lib files inside.
- Congratulations, now you can use the console version when executing the `cli/cli.exe` file from... a console. If you want to use the graphical interface, you should only run the `gui/EasyDeepNude.exe` file

## F.A.Q.

Q: I can not download the files! Quota limit reached...

A: [Try this](https://www.geekrar.com/fix-bypass-google-drive-download-limit-error/)

Q: Why does the program ask for firewall permissions?

A: For now the GUI needs to create a local server on your computer to render the interface of the program, basically the GUI is a web browser. Yes I am aware that this method is "retarded" but it is temporary. No, it's not a virus, a botnet or anything like that, I'm not interested in your photos or your files.

---

# About the Author

I'm just a web developer who seemed curious of what this program can achieve and I could not resist trying to make it as accessible as possible. I like the _black humor and the satire_, the consequences that this project may have are not of my interest and anyone can do whatever they want, as long as they are under [the terms of the license](LICENSE.md).

If you want to support the development of the project and obtain advantages please consider subscribing to my 💖[Patreon](https://www.patreon.com/deepmanyy).

Email: `deepmanyy[at]msgsafe.io`

4chan: `!!ZOXIOrD0Ory`

Telegram: `@DeepManYY`

Discord: `DeepManYY#5508`

---

# Development - Only developers from here

## Requirements

- [CUDA 10.0](https://developer.nvidia.com/cuda-10.0-download-archive)
- [Python 3.6.8](https://www.python.org/downloads/release/python-368/)
- [NodeJS 11+](https://nodejs.org/en/)
- [Yarn](https://yarnpkg.com/en/docs/install)

## What should I know?

- [Python](https://www.codecademy.com/catalog/language/python): For the development of the CLI, the transformation algorithm and the neural network.
- [HTML & CSS](https://www.codecademy.com/catalog/language/html-css), [JavaScript](https://www.codecademy.com/catalog/language/javascript): For the development of websites (The GUI is a website 😮)
- [VueJS](https://vuejs.org/), [NuxtJS](https://nuxtjs.org/): The frameworks that have been used to build the GUI. _(VueJS is the best #changemymind)_
- [Electron](https://electronjs.org/): The software used to "transform" the GUI, from a website to a desktop program.

## Setup

### Windows

`The following instructions should be applied within the src/ folder`

Install the necessary libraries and packages to compile the project by running the `install.bat` file

Compile the project by running the `build.bat` file, this should generate the `dist/` folder with the projects ready for use. Run `dist/gui/win-unpacked/EasyDeepNude.exe` once and close it, now transfer all files from `dist/gui/win-unpacked/` to `dist/gui/`

With this you should have a functional version
