const term = require('terminal-kit').terminal;

async function testInputField() {
    term.grabInput({ mouse: 'button' }); // Enable input grabbing

    // Clearer instruction to the user
    term.bold.brightCyan('Please enter your name below:\n');

    const name = await term.inputField({
        echo: true, // Show input as the user types
        prompt: 'name: ', // Add a simple prompt
    }).promise.catch(err => {
        console.log('Error occurred:', err); // Catch any input errors
    });

    console.log('Got name:', name);

    // Reset input grabbing and exit
    term.grabInput(false); // Ensure input grabbing is turned off safely
    process.exit();
}

testInputField();
term.on('key', (name, matches, data) => {
  if (name === 'CTRL_C' || name === 'ESCAPE') {
      console.log('Exiting application...');
      term.grabInput(false); // Disable input grabbing
      process.exit(); // Terminate the app
  }
})