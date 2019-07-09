# PepeNude

![](https://i.imgur.com/c5KnKFV.jpg)

PepeNude is an application that allows you to use the power of your CPU or GPU to transform photos of people and get free entertainment, the goal of PepeNude is to offer a **CLI** to process photos from the console and a new **GUI** (Graphical user interface) to use the program easily.

- The CLI version allows you to transform photos using commands, with this you can create automated systems such as *bots, web pages or a new GUI*. Use the argument `--help` to get more information about usage, keep in mind that the CLI by itself **does not have** a cropping system so you will have to manually resize your photos to 512x512

- The GUI version is a new friendly interface that includes a cropping system, so you only have to tell the program which photo you want to transform and you will get results in a few clicks.

# Backups & Community

To avoid the loss of the project due to a possible censoring attempt [(or a DMCA)](https://github.com/deep-man-yy/pepenude/issues/9), the project will be hosted at:

- [Github](https://github.com/deep-man-yy/pepenude)
- ~~[Bitbucket](https://bitbucket.org/deepmanyy/easydeepnude/src)~~
- [Gitlab](https://gitlab.com/deepmanyy/pepenude)
- [NotABug](https://notabug.org/deepmanyy/pepenude)
- [GitGud](https://gitgud.io/deepmanyy/pepenude)

If you want to get help, collaborate in the project, share photos or just have a good time you can join our groups:

- [Discord](https://discord.gg/RjBSaND)
- [Telegram](https://t.me/easydeepnudegallery)

# Alpha

![](https://i.imgur.com/LZo61bq.jpg)

PepeNude is in an alpha version so it can be unstable or not work directly under certain conditions (which I often do not know)

I will try to help in any problem you have.

Preview *(NSFW)*:
https://i.imgur.com/Gj5n2ox.gif

# Binaries

## Requirements

* [Latest NVIDIA drivers](https://www.nvidia.com/Download/index.aspx) or [CUDA 10.0](https://developer.nvidia.com/cuda-10.0-download-archive) (If you are going to use GPU processing. CUDA can be optional on the latest graphics cards)

## Download

If you are not a developer or are only interested in using the program, these are the files you should download:

* [CLI](https://drive.google.com/open?id=1kvXI4mSOu-teUYl8O2MH5mMLo_Vs0gCe): *The program responsible for transforming the photos. It is heavier than the original due to the implementation of GPU processing.*
* [CLI Checkpoints](https://drive.google.com/open?id=1w6ZO47To4BGh67WjeFCTBZiGVMFrK_po): *The models used by the artificial intelligence. Yes, they are required.*
* [GUI](https://drive.google.com/open?id=1NgAATqhh8GNwBHOvJOo0vvgtX_OvsOXF): *The graphical user interface so you do not have to use commands or manually crop the photo.*

### Help, Google Drive says quota limit reached!

[Try this](https://www.geekrar.com/fix-bypass-google-drive-download-limit-error/)

## Installation

* If you want to use only the console version, download the **CLI** and **CLI Checkpoints** zip files.
* If you want to use the version with graphical interface download all 3 zip files.
* Create a folder called "easydeepnude" (where you want), open it and inside place the zip files you have downloaded.
* Unzip the **CLI.zip** and **GUI.zip** file (if you downloaded it) In the end you should have the folders `cli/` and `gui/`.
* Unzip the contents of **checkpoints.zip** inside the `cli/` folder. At the end you must have the folder `cli/checkpoints` folder with 3 .lib files inside.
* Congratulations, now you can use the console version when executing the `cli/cli.exe` file from... a console. If you want to use the graphical interface, you should only run the `gui/EasyDeepNude.exe` file

# Development

*Work in progress...*

*Some things are not ready yet, you may have to take additional steps to make the project work*

## Requirements

* [CUDA 10.0](https://developer.nvidia.com/cuda-10.0-download-archive)
* [Python 3.6.8](https://www.python.org/downloads/release/python-368/)
* [PyInstaller](https://www.pyinstaller.org/)
* [NodeJS](https://nodejs.org/en/) (In theory any recent version works.)
* [Yarn](https://yarnpkg.com/en/docs/install)

## Preparation

`The following instructions should be applied within the src/ folder`

Install the necessary libraries and packages to compile the project by running the `install.bat` file

Compile the project by running the `build.bat` file, this should generate the `dist/` folder with the projects ready for use. Run `dist/gui/win-unpacked/EasyDeepNude.exe` once and close it, now transfer all files from `dist/gui/win-unpacked/` to `dist/gui/`

With this you should have a functional version

# About the Author

I'm just a web developer who seemed curious what this program can achieve and I could not resist trying to make it as accessible as possible. I like the black humor and the satire, the consequences that this project may have are not of my interest and anyone can do whatever they want, as long as they are under [the terms of the license](LICENSE.md).

I will try to continue maintaining the project, but I do not get an income so it is possible that it will be of low priority and the development will be slow (but safe)

Email: `deepmanyy[at]msgsafe.io`

4chan: !!ZOXIOrD0Ory

Telegram: @DeepManYY

Discord: DeepManyYY#5508