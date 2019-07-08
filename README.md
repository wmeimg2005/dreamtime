# Easy-DeepNude

Easy-DeepNude is a new implementation of the [DeepNude](https://github.com/deepinstruction/deepnude_official) project, the goal of Easy-DeepNude is to offer a **CLI** to process photos from the console and a new **GUI** (Graphical user interface) to use the program easily.

- The CLI version allows you to transform photos using commands in a console, with this you can create automated systems such as *Bots, web pages or a new GUI*. Use the argument `--help` to get more information about usage, keep in mind that the CLI by itself **does not have** a cropping system so you will have to manually resize your photos to 512x512

- The GUI version is a new friendly interface that includes a cropping system, so you only have to tell the program which photo you want to transform and you will get results in a few clicks.

## Preview

https://i.imgur.com/Gj5n2ox.gif

# Alpha

This is a very early version, although it has worked for me without problems it is possible that in your computer does not work ¯\_(ツ)_/¯

I will try to help in any problem you have.

# Backups & Community

To avoid the loss of the project due to the censorship attempt, the project will be available in:

- [Github](https://github.com/deep-man-yy/easydeepnude)
- [Bitbucket](https://bitbucket.org/deepmanyy/easydeepnude/src)
- [Gitlab](https://gitlab.com/deepmanyy/easydeepnude)
- [NotABug](https://notabug.org/deepmanyy/easydeepnude.git)

You can join the project community, ask for help or ask the Bot to transform your photos in Telegram:

https://t.me/easydeepnudegallery

# Binaries

## Requirements

* [Latest NVIDIA drivers](https://www.nvidia.com/Download/index.aspx) or [CUDA 10.0](https://developer.nvidia.com/cuda-10.0-download-archive) (If you are going to use GPU processing. CUDA can be optional on the latest graphics cards)

## Download

If you are not a developer or are only interested in using the program, these are the files you should download:

* [CLI](https://drive.google.com/open?id=1kvXI4mSOu-teUYl8O2MH5mMLo_Vs0gCe): *The program responsible for transforming the photos. It is heavier than the original due to the implementation of GPU processing.*
* [CLI Checkpoints](https://drive.google.com/open?id=1w6ZO47To4BGh67WjeFCTBZiGVMFrK_po): *The models used by the artificial intelligence. Yes, they are required.*
* [GUI](https://drive.google.com/open?id=1NgAATqhh8GNwBHOvJOo0vvgtX_OvsOXF): *The graphical user interface so you do not have to use commands or manually crop the photo.*

## Installation

* If you want to use only the console version, download the **CLI** and **CLI Checkpoints** zip files.
* If you want to use the version with graphical interface download all 3 zip files.
* Create a folder called "easydeepnude" (where you want), open it and inside place the zip files you have downloaded.
* Unzip the **CLI.zip** and **GUI.zip** file (if you downloaded it) In the end you should have the folders `cli/` and `gui/`.
* Unzip the contents of **checkpoints.zip** inside the `cli/` folder. At the end you must have the folder `cli/checkpoints` folder with 3 .lib files inside.
* Congratulations, now you can use the console version when executing the `cli/cli.exe` file from... a console. If you want to use the graphical interface, you should only run the `gui/EasyDeepNude.exe` file

# Development

*Work in progress...*

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

### 4chan retard-tripcode:
!!ZOXIOrD0Ory