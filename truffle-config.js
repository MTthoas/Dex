require("ts-node").register({
  files: true,
});

module.exports = {
  networks: {},
  mocha: {},
  compilers: {
    solc: {
      version: "0.8.21",
    },
  },

  migrations_directory: "./migrations",
  test_directory: "./test",
};
