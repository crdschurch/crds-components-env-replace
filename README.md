# crds-components-env-replace

This project is a command-line utility for replacing environment-specific values that reference [crds-components](https://github.com/crdschurch/crds-components)in the index.html file of a built SPA project.

## Installation

Since it's run immediately after build, it works best in you can bundle the script within your project. But this project is only available via GitHub. Therefore, this is how you install via npm:

    $ npm install --save-dev crdschurch/crds-components-env-replace#master

## Usage

Basic usage looks like this:

    $ crds-components-env-replace [options]

If using as part of your project, add the script to the `scripts` section in your `package.json` file:

```json
{
  "...": "...",
  "scripts": {
    "...": "...",
    "env:replace": "crds-components-env-replace [options]"
  }
}
```

You would then be able to run the script like so:

    $ npm run env:replace

## Options

The following options are available:

| Variable | Default             | Description                                         |
| -------- | ------------------- | --------------------------------------------------- |
| `env`    | `int`               | The environment for which values should be adjusted |
| `file`   | `./dist/index.html` | The file containing reference to crds-components    |

Note the following:

- The script does nothing if left in the int environment (see _Environments_, below), as **it is assumed all default values in your index.html file are specific to int.**
- Only certain environments are accepted. See below for the list.
- The file should point to your _built_ index.html file. While this defaults to the typical `./dist/index.html` location, it is recommended you specify this directly. This argument is passed to the [replace-in-file utility](https://github.com/adamreisnz/replace-in-file), which [supports globs](https://github.com/adamreisnz/replace-in-file#replace-a-single-file-or-glob).

Given those notes, if you are using `$CRDS_ENV` to specify your environment, then your usage will look something like this:

    $ crds-components-env-replace --env $CRDS_ENV --file ./dist/index.html

## Environments

Only certain permuations of each environment are available and accepted by the script. See the chart for details:

| Environment | Permutations                |
| ----------- | --------------------------- |
| `int`       | `int`, `dev`, `development` |
| `demo`      | `demo`                      |
| `prod`      | `prod`, `production`        |

## License

This project is licensed under the [MIT License](LICENSE).
