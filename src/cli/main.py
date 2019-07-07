import sys
import argparse
import cv2
from run import process

parser = argparse.ArgumentParser()
parser.add_argument(
    "-i", "--input", default="input.png", help="path of the photo to transform"
)
parser.add_argument(
    "-o",
    "--output",
    default="output.png",
    help="path where the transformed photo will be saved. (default: output.png)",
)
parser.add_argument(
    "--cpu",
    default=False,
    action="store_true",
    help="force photo processing with CPU (slower)",
)
parser.add_argument(
    "--gpu",
    default=0,
    help="ID of the GPU to use for processing. This argument will be ignored if --cpu is active. (default: 0)",
)
args = parser.parse_args()

"""
main.py

 How to run:
 python3 main.py

"""

# ------------------------------------------------- main()
def main():
    # Read input image
    image = cv2.imread(args.input)

    gpu_id = int(args.gpu)

    if args.cpu:
        gpu_id = None

    # Process
    result = process(image, gpu_id)

    # Write output image
    cv2.imwrite(args.output, result)

    # Exit
    sys.exit()


if __name__ == "__main__":
    main()
