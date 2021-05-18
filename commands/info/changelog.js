const chalk = require("chalk");
const {Command} = require("discord.js-light-commando");
const {MessageEmbed} = require("discord.js");
const {checkMsg} = require("../functions/checkMsg.js");
const config = require("../../config.json");

let mysql = require("mysql");
const {DateTime} = require("luxon");
let connection = mysql.createPool({
  host: config.SQL.host,
  user: config.SQL.username,
  password: config.SQL.password,
  database: config.SQL.database,
});

module.exports = class MapCommand extends Command {
  constructor(client) {
    super(client, {
      name: "changelog",
      group: "info",
      memberName: "changelog",
      description: "Shows info on changelogs in Apex.",
      examples: ["changelog"],
    });
  }
  onError(error) {
    console.log(chalk`{red Error: ${error}}`);
  }
  run(msg) {
    if (checkMsg(msg) == 1) return;

    let legendQuery = `SELECT * FROM ${config.SQL.changelogTable} ORDER BY \`id\` DESC`;

    connection.getConnection(function (err, connection) {
      if (err) return console.log(chalk`{red ${err}}`);

      connection.query(legendQuery, function (err, result) {
        if (err) {
          connection.release();
          console.log(chalk`{red ${err}}`);
        }

        var changelog = result[0];

        function formatDate(timestamp) {
          return DateTime.fromSeconds(timestamp).toFormat("cccc LLL dd, yyyy - hh:mm a ZZZZ");
        }

        const changelogEmbed = new MessageEmbed()
          .setTitle(`${formatDate(changelog.date)}`)
          .setDescription(`${changelog.text}\n\n[View Tweet](${changelog.link})`);

        msg.say(changelogEmbed);

        connection.release();
      });
    });
  }
};
