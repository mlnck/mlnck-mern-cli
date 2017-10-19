## mlnck-mern-cli

This will be updated shortly.  
But I wanted to be able to get this out for a bit of _real_ user testing.

I'm not even sure you could call this a beta. It was made to integrate with:
[mlnck-mern](https://github.com/mlnck/mlnck-mern) and allows for ease of use when creating a MERN stack app.

To take full advantage of this you will need to install this package with:

`npm install -g mlnck-mern-cli`  
_OR_  
`yarn global add mlnck-mern-cli`

After install, I highly recommend jumping over to [github](https://github.com) and following along with the [tutorial](https://github.com/mlnck/mlnck-mern/blob/master/Tutorial.md).

---

### The Commands

Once the package is installed you will have access to these commands (full explanations of commands and options are forthcoming):  
_view all by running:_  
`$ mlnck-mern -h`

```
  Usage: mlnck-mern [options] [command]


  Options:

    -V, --version  output the version number
    -h, --help     output usage information


  Commands:

    create <project-name> [prev-version]  install new mlnck-mern project
    configure-project|configure           configure initial settings of currently installed mlnck-mern project
    remove-sample|remove                  remove smaple files and logs which may have been initially installed
    new-element|new <name>                create paths, containers/components, and associated files for new elements
    create-client-route|croute <path>     create client side route
    create-server-route|sroute <path>     create server side route
    create-schema|schema <name>           create schema file for mongoose integration
```
