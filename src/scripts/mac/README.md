## macOS Scripts

In this folder should go the scripts to install, compile and run the project in macOS.

### Running these scripts
You will need to add execute permissions to each one of these scripts to run them. Do this for all scripts you want to run:

```bash
chmod +x build.sh
./build.sh
```

----

You cannot build the electron app.

No idea yet, run the dev server or the CLI and it works.

---
Please do not hesitate to do a PR if you have a Mac and you can correct these files!

> ⚠ Torch in macOS does not support CUDA. If you want to obtain GPU processing compability you will have to compile [PyTorch](https://pytorch.org/) yourself.