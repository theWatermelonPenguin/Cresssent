function showHelp() {
  console.log(`
Available commands:
  crsnt --version           Show version info
  crsnt create env          Create environment file
  crsnt create project      Create a new project structure
  crsnt delete <file|type>  Delete specific file or all files of a given type (e.g. env)
  crsnt help                Show this help message
  crsnt run <file>          Run a Cressent file
  crsnt tree                Show project tree
  crsnt clear               Clear the shell screen
  crsnt quit                Quit the shell
  crsnt package             Package project for deployment
  crsnt open canister <x>   Install plugin canister
  crsnt toss canister <x>   Remove plugin canister
  crsnt docs                Open documentation
`);
};

showHelp();
