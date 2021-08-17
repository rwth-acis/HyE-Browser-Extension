# HyE - How's your Experience
The main contribution of this repository is the Firefox extension contained in the `plugin` directory.
The server code contained in the directory fittingly named `*server*` is only used for development to stand in for the (not yet developed) las2peer service.

## Build
The ``build'' process of this extension simply consists of creating a `.zip` file of the contents of the `plugin` directory, **not the entire directory**, as the `manifest.json` file has to reside on the highest level.

## Deployment
To install the extension as a temporary add-on go to the extension settings, e.g., by typing `about:addons` into the address bar, and select the option `Install Add-on From File...` from the drop-down menu of the cog symbol.
Then select the `.zip` file containing the extension.
However, certain limitations apply, as Firefox only allows unsigned extensions to be installed temporarily and temporarily installed extensions do not get access to the local browser storage which is required for the extension to function.
Instead for Firefox, it is recommended to install the officially signed version which you can download [here](https://addons.mozilla.org/en-US/developers/addon/hye-youtube/) (note, the download seems to be broken currently, try again later...).

### Configuration
Note, that the extension relies on an external server to produce the alternative recommendations.
By default, this server is expected to run at `http://127.0.0.1:2201/` (debugging settings).
A (mostly) functioning server can be found in the `server` directory.
The installation process is desribed below.
To change the configuration, edit the `config.js` file contained in the `lib` directory.

### Node server
To install the Node server simply run `npm i`, wait for the packages to be installed, and run `node app.js`.
The host and port can be changed via the command line parameters `--host` and `--port`, and additional output is generated if the `--verbose` parameter is passed.

Furthermore, this server requires a MySQL database connection to the server, speciefied in the `config.json` file contained in the `etc` directory.
Once you set up the respective database, you can create the necessary table from the `etc/schema.sql` file (note that if you changed the table name in the config file, you also have to change it here).
This might look like this:
```
mysql -u hye -D hye -p < etc/schema.sql
```

## Note for non-Firefox users
Most of the code is also compatible with other browsers, such as Chrome/Chromium, Edge, and Opera.
However, there are minute differences regarding the syntax.
Thus, the extension is not currently supported by any other browser than Firefox, but this is a goal for the not too distant future.
