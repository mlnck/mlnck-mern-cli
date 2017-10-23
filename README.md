## mlnck-mern-cli

This will be updated shortly.  
But I wanted to be able to get this out for a bit of _real_ user testing.

I'm not even sure you could call this a beta. It was made to integrate with:
[mlnck-mern](https://github.com/mlnck/mlnck-mern) and allows for ease of use when creating a MERN stack app.

To take full advantage of this you will need to install this package with:

`npm install -g mlnck-mern-cli`  
_OR_  
`yarn global add mlnck-mern-cli`

#### After install:
I highly recommend jumping over to [github](https://github.com) and following along with the [tutorial](https://github.com/mlnck/mlnck-mern/blob/master/Tutorial.md).

---

### The Commands

Once the package is installed you will have access to these commands:  
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

---

### create
`$ create <project-name> [prev-version]  install new mlnck-mern project`
_Usage:_ A name for the project is required. Future versions of the CLI will have the ability to specify which version of React, Redux, etc that you wish to use. (If something big were to have breaking changes..I dunno, like react-router v4, then you could easily continue working with the previous version.

_What to Expect:_
- Confirmation to create the project
  - A new folder will be created in your current directory. It will have the name that you entered when running the command. If there is already a folder with that name then you will receive an error and be asked to try again with a different name.
  - After the folder is created a git command will run and (after verifying you have git installed) you will pull the most recent version (or version specified) of the base files
  - On exit the command line will output the next step of the process.

### configure
`$ configure-project|configure           configure initial settings of currently installed mlnck-mern project`
_Usage:_ There are no required arguments.

_What to Expect:_
- _author_:
  - Updates the name in the package.json file
- _Install sample project?_:
  - If yes, a default "skeleton" project will be created when you initially load the files (_NOTE:_ You will still have to update the `.env` file)
- _Install optional components?_:
  - If yes, then a selected portion of the components from Facebook's [create-react-app](https://github.com/facebookincubator/create-react-app) will be installaed along with the default build.

### remove
`remove-sample|remove                  remove smaple files and logs which may have been initially installed`
_Usage:_ There are no required arguments.

_What to Expect:_
- Confirmation to delete the sample files & references within required files
  - All files pertaining to the skeleton project that _are not_ required by the MERN stack will be removed
  - All references within files that _are_ required by the MERN stack will be removed, leaving the files in tact

### new
`new-element|new <name>                create paths, containers/components, and associated files for new elements`
_Usage:_ A name for the component or container is required

_What to Expect:_
- Type?
  - This will determine which directory the new component folder is created within
- will this be a stateful component?
  - Determines whether to make this an extension of `React.Component` or a `function componentName(props)`
  - Stubs `mapStateToProps` method
  - exports `connect`
- create route?
  - Will output the next steps to run to the CLI when current command is complete
- will this component dispatch actions?
  - Includes and links action file
  - Includes and links constants file
  - Includes and links reducer file
  - Stubs `mapDispatchToProps` method
- will this component have side-effects?
  - Includes and links saga file
  - Includes and links selector file
- will this component need javascript styling?
  - Includes and links `styled-components` file


### croute
`create-client-route|croute <path>     create client side route`
_Usage:_ The path (relative to the containing component (_root_ by default) is required

_What to Expect:_
- Path Endpoint is `/<path>`:
  - If No
    - What is the component/container path
      - Input custom path
- component/container name is: `<Path>`?
  - If No
    - What is the component/container name
      - Input component/container name
        - _NOTE:_ This _MUST_ already exist
- Is this a nested component/container
  - If Yes
    - Select the parent route /Hanger
- Path is exact?
- pre-processed server side controller:
  - If other
    - "Begin typing to filter controllers or create a new one."
    - enter custom pre-processed server side controller
      - _NOTE_ this must have a value and end in `.js`
- pre-processed server side method:
  - If other
    - enter custom pre-processed server side method
- enter the object key that will be used to access information on page render
- create `<Path>` schema if it does not exist?
  - Creates and links the schema file for the component/container if it is absent

> For all _pre-processed_ information above, this takes advantage of react-router v4 and [react-router-config](https://github.com/reacttraining/react-router/tree/master/packages/react-router-config)'s idea to mimic a true  server side information implementation (almost like a React CMS).
> - The first question expects the controller that contains the controller responsible for retreiving the information
> - The second asks for the method name used to retrieve the information
> - The final asks for the key that the information will be stored on when the view is rendered


### sroute
`create-server-route|sroute <path>     create server side route`
_Usage:_ The path (relative to the containing component (_root_ by default) is required

_What to Expect:_
- Create controller if it does not exist
  - This will create and link the `<path>` controller file if it is absent
- Create schema if it does not exist?
  - This will create and link the `<path>` schema file if it is absent
> _NOTE:_ It is important to run this after running `$ mlnck-mern croute` even if you chose to create the schema in the previous step to ensure all linking has been handled correctly. (Although, you can just select _no_ and _no_ for the options)

### schema
`create-schema|schema <name>           create schema file for mongoose integration`
_Usage:_ The name of the schema is required

_What to Expect:_
- Confirmation that you want to create the named schema
  - A new schema file will be created and linked
