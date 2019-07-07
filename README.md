# Easy-DeepNude

Easy-DeepNude offers a **CLI** and **GUI** version of the artificial intelligence project [DeepNude](https://github.com/deepinstruction/deepnude_official).

The CLI version allows you to process photos using only the console, use the `--help` argument to get more information about its use. **Note:** A cropping system is not included, to use the program properly crop the photo to be processed to dimensions *512x512*.

The GUI version allows you to process photos with a friendly interface, this version includes a cropping system so it is only necessary to have the photos you are going to process.

## Preview

https://i.imgur.com/Gj5n2ox.gif

# Alpha

This is a very early version, although it has worked for me without problems it is possible that in your computer does not work ¯\_(ツ)_/¯

I will try to help in any problem you have.

# Binaries

## Requirements

* [CUDA 10.0](https://developer.nvidia.com/cuda-10.0-download-archive) (If you are going to use GPU processing)

## Download

If you are not a developer or are only interested in using the program, these are the files you should download:

* [CLI](https://drive.google.com/open?id=1kvXI4mSOu-teUYl8O2MH5mMLo_Vs0gCe): *The program responsible for transforming the photos. It is heavier than the original due to the implementation of GPU processing.*
* [CLI Checkpoints](https://drive.google.com/open?id=1w6ZO47To4BGh67WjeFCTBZiGVMFrK_po): *The models used by the artificial intelligence. Yes, they are required.*
* [GUI](https://drive.google.com/open?id=1NgAATqhh8GNwBHOvJOo0vvgtX_OvsOXF): *The graphical user interface so you do not have to use commands or manually crop the photo.*

## Installation

* If you want to use only the console version, download the **CLI** and **CLI Checkpoints** zip files.
* If you want to use the version with graphical interface download all 3 zip files.
* Create a folder called "easydeepnude" (where you want), open it and inside place the zip files you have downloaded.
* Unzip the **CLI.zip** and **GUI.zip** file (if you downloaded it) so that the `/cli/` and `/gui/` folders remain.
* Unzip the contents of **checkpoints.zip** inside the `/cli/` folder so that in the end there is `/cli/checkpoints/`
* Congratulations, if you use the CLI version you can now run the `/cli/cli.exe` file from a terminal, but if you use the GUI version open the program `/gui/EasyDeepNude.exe`

# Development

*Work in progress...*

I need to make some adjustments so that everyone can use the code without problems.