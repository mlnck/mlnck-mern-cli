beforeAll(() => {
  //set missing console functionality for headless testing
})
beforeEach(() => {
  //reset defaults
})

describe('client side commands', () => {
  test('can create project', () => {
    //name is required
    //allows addition of sample project files
    //allows addition of boilerplate components
    //package.json is created
    expect(true).toBeTruthy();
  });

  test('can remove sample project', () => {
    //sample files removed (regex for '/** show_sample_project **/' maybe?)
    expect(true).toBeTruthy();
  });

  test('can include components from react-boilerplate', () => {
    //optional files added
    expect(true).toBeTruthy();
  });

  test('create client component', () => {
    //component name required
    //creates correct stateful/non-stateful type (mapstatetoprops. extends react.component)
    //creates route if required
    //create dispatch to props if required / creates memoization
    //create saga if needed
    //add styled js if needed
    expect(true).toBeTruthy();
  });

  test('create client container', () => {
    //component name required
    //creates correct stateful/non-stateful type (mapstatetoprops. extends react.component)
    //creates route if required
    //create dispatch to props if required / creates memoization
    //create saga if needed
    //add styled js if needed
    expect(true).toBeTruthy();
  });

  test('create client route', () => {
    //component name required
    //component path is created
    //exact works as expected
    //nested works as expected
    //loadkey is stored
    //loadfnc is stored
    expect(true).toBeTruthy();
  });

});

describe('server side commands', () => {
  test('create server route', () => {
    //component name required
    //allows creation of controller
    //allows creation of schema
    //creates /server/routes/xxx.routes.js
    //updates serverjs with app.use
    expect(true).toBeTruthy();
  });

  test('create server controller', () => {
    //component name required
    //creates /server/controllers/xxx.controller.js
    //updates /server/routes/xxx.routes.js with import
    expect(true).toBeTruthy();
  });

  test('create server schema', () => {
    //component name required
    //creates /server/models/xxx.model.js
    //updates /server/controllers/xxx.controller.js with import
    expect(true).toBeTruthy();
  });
});
