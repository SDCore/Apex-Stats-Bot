const {Discord} = require("../ApexStats.js");
const config = require("../config.json");
const percentage = require("percentagebar");
const legends = require("../GameData/legends.json");
const {updateKills} = require("./functions/updateKills.js");
const {badgeTitle, badgeValue} = require("./functions/badgeHandler.js");

let mysql = require("mysql");
let connection = mysql.createPool({
  host: config.APISQL.host,
  user: config.APISQL.username,
  password: config.APISQL.password,
  database: config.APISQL.database,
});

var {DateTime} = require("luxon");
const {default: axios} = require("axios");

var currentTimestamp = DateTime.local().toFormat("ooo") * 2;

var OnlineEmoji = "<:StatusUp:786800700533112872>";
var OfflineEmoji = "<:StatusDown:786800700201238570>";

module.exports = {
  name: "stats",
  description: "Shows user legend stats.",
  execute(message, args) {
    let platform = args[0];

    if (args[1]) {
      if (args[2]) {
        if (args[3]) {
          var player = `${args[1]}%20${args[2]}%20${args[3]}`;
        } else {
          var player = `${args[1]}%20${args[2]}`;
        }
      } else {
        var player = args[1];
      }
    }

    if (!args.length)
      // No args
      return message.channel.send(
        `To use this command, use the following format: \n\`${config.prefix}stats [platform] [username]\``
      );

    if (!platform || !player)
      // Arg 1 or 2 is missing
      return message.channel.send(
        `To use this command, use the following format:\n\`${config.prefix}stats [platform] [username]\``
      );

    if (platform && player) var platformUppercase = platform.toUpperCase();

    // Check is user uses PSN or PS5, XBOX or XBSX when checking stats
    if (platformUppercase == "PSN" || platformUppercase == "PS5" || platformUppercase == "PS") {
      var platformCheck = "PS4";
    } else if (platformUppercase == "XBOX" || platformUppercase == "XBSX") {
      var platformCheck = "X1";
    } else {
      var platformCheck = platformUppercase;
    }

    var plats = [
      // Current list of supported platforms
      "X1",
      "PS4",
      "PC",
    ];

    if (plats.indexOf(platformCheck) == -1)
      return message.channel.send(
        "Sorry, it looks like you didn't provide a valid platform.\nFor reference, PC = Origin/Steam, X1 = Xbox, and PS4 = Playstation Network."
      );

    function checkPlat(platform, username) {
      if (platform == "PC") {
        return username;
      } else {
        return "SDCore";
      }
    }

    function formatNumbers(number) {
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    mainURL = `https://api.apexstats.dev/stats.php?platform=${platformCheck}&player=${player}`;

    message.channel.send("Retrieving stats...").then(async (msg) => {
      axios
        .get(mainURL)
        .then(function (response) {
          // Response Data
          var mainResponse = response.data;

          // Season/Account Info
          var season = "8";
          var userID = mainResponse.userData.userID;
          var userName = mainResponse.userData.username;
          var userPlatform = mainResponse.userData.platform;
          var isOnline = mainResponse.userData.status;
          var selectedLegend = mainResponse.accountInfo.active.legend;
          var currentRank = mainResponse.accountInfo.ranked;
          var accountBP = mainResponse.accountInfo.battlepass.level;
          var accountLevel = mainResponse.accountInfo.level;
          var lastUpdated = Math.floor(new Date().getTime() / 1000);

          // Badges
          var badgeOne = mainResponse.accountInfo.active.badges[0];
          var badgeTwo = mainResponse.accountInfo.active.badges[1];
          var badgeThree = mainResponse.accountInfo.active.badges[2];

<<<<<<< HEAD:commands/stats.js
          //let checkQuery = `SELECT * FROM \`UsersV2\` WHERE \`PlayerID\` = '${userID}';`;
          //let insertQuery = `INSERT INTO \`UsersV2\` (\`PlayerID\`, \`PlayerName\`, \`Platform\`, \`Level\`, \`RankScore\`, \`lastUpdated\`) VALUES ('${userID}', '${userName}', '${userPlatform}', '${accountLevel}', '${currentRank.score}', '${lastUpdated}')`;
          //var killsQuery = `SELECT SUM(\`898565421\` + \`182221730\` + \`1409694078\` + \`1464849662\` + \`827049897\` + \`725342087\` + \`1111853120\` + \`2045656322\` + \`843405508\` + \`187386164\` + \`80232848\` + \`64207844\` + \`1579967516\` + \`2105222312\` + \`88599337\` + \`405279270\`) as killTotal FROM userKills WHERE \`PlayerID\` = '${userID}'`;

          //connection.getConnection(function (err, connection) {
          //  if (err) {
          //    console.log(err);
          //    return message.channel.send(
          //      "There was an error connecting to the database. Please try again later."
          //    );
          //  }

          //  connection.query(checkQuery, function (err, results) {
          //    if (err) {
          //      connection.release();
          //      console.log(err);
          //      return message.channel.send(
          //        "There was a problem with the SQL syntax. Please try again later."
          //      );
          //    }

          //    if (results.length > 0) {
          //      // console.log("found user.");
          //    } else {
          //      connection.query(insertQuery, function (err, results) {
          //        console.log(err);
          //      });
          //    }

          //    connection.release();
          //  });
          //});
=======
          let checkQuery = `SELECT * FROM \`UsersV2\` WHERE \`PlayerID\` = '${userID}';`;
          let insertQuery = `INSERT INTO \`UsersV2\` (\`PlayerID\`, \`PlayerName\`, \`Platform\`, \`Level\`, \`RankScore\`, \`lastUpdated\`) VALUES ('${userID}', '${userName}', '${userPlatform}', '${accountLevel}', '${currentRank.score}', '${lastUpdated}')`;
          var killsQuery = `SELECT SUM(\`898565421\` + \`182221730\` + \`1409694078\` + \`1464849662\` + \`827049897\` + \`725342087\` + \`1111853120\` + \`2045656322\` + \`843405508\` + \`187386164\` + \`80232848\` + \`64207844\` + \`1579967516\` + \`2105222312\` + \`88599337\` + \`405279270\`) as killTotal FROM userKills WHERE \`PlayerID\` = '${userID}'`;

          connection.getConnection(function (err, connection) {
            if (err) {
              console.log(err);
              return message.channel.send(
                "There was an error connecting to the database. Please try again later."
              );
            }

            connection.query(checkQuery, function (err, results) {
              if (err) {
                connection.release();
                console.log(err);
                return message.channel.send(
                  "There was a problem with the SQL syntax. Please try again later."
                );
              }

              if (results.length > 0) {
                // console.log("found user.");
              } else {
                connection.query(insertQuery, function (err, results) {
                  console.log(err);
                });
              }

              connection.release();
            });
          });
>>>>>>> BotRewriteV2:oldCommands/stats.js

          // Account Trackers
          var trackerOne = mainResponse.accountInfo.active.trackers[0];
          var trackerTwo = mainResponse.accountInfo.active.trackers[1];
          var trackerThree = mainResponse.accountInfo.active.trackers[2];

          function findLegendByID() {
            var getLegend = legends[mainResponse.accountInfo.active.legend].Name;

            if (getLegend == "undefined" || getLegend == null) {
              return "NoBanner";
            } else {
              return getLegend;
            }
          }

          function getAccountLevel(level) {
            if (level >= 500) {
              return 500;
            } else {
              return level;
            }
          }

          function getAccountBP(BP) {
            if (BP != -1) {
              if (BP >= 110) {
                return 110;
              } else {
                return BP;
              }
            } else {
              return 0;
            }
          }

          function getRankBadge(rankName, rankPos) {
            if (rankPos > "750") {
              return "<:rankedMaster:787174770680135680>";
            } else if (rankName == "Silver") {
              return "<:rankedSilver:787174770424021083>";
            } else if (rankName == "Gold") {
              return "<:rankedGold:787174769942462474>";
            } else if (rankName == "Platinum") {
              return "<:rankedPlatinum:787174770780667944>";
            } else if (rankName == "Diamond") {
              return "<:rankedDiamond:787174769728290816>";
            } else if (rankName == "Master") {
              return "<:rankedMaster:787174770680135680>";
            } else if (rankName == "Predator" || rankName == "Apex Predator") {
              return "<:rankedPredator:787174770730336286>";
            } else {
              return "<:rankedBronze:787174769623302204>";
            }
          }

          function getTrackerTitle(id, legend) {
            if (id == "1905735931") {
              return "No data";
            } else {
              var trackerFile = require(`../GameData/TrackerData/${legend}.json`);

              if (trackerFile[id] == "undefined" || trackerFile[id] == null) {
                return id;
              } else {
                return trackerFile[id];
              }
            }
          }

          function getTrackerValue(id, value) {
            if (id == "1905735931") {
              return "-";
            } else {
              return value;
            }
          }

          function getUserStatus() {
            if (isOnline == "1") {
              return `**Status:** ${OnlineEmoji}Online`;
            } else {
              return `**Status:** ${OfflineEmoji}Offline`;
            }
          }

          //connection.query(killsQuery, function (err, killResults) {
          //  if (err) {
          //    connection.release();
          //    console.log(err);
          //    return message.channel.send(
          //      "There was a problem with the SQL syntax. Please try again later."
          //    );
          //  }

          //  function getUserKills() {
          //    var userKills = killResults[0].killTotal;

          //if (userKills == null || userKills == undefined) {
          //  return 0;
          //} else {
          //  return userKills.toLocaleString();
          //}

          // Use for when introducing kills into embed
          // **Total Kills:** ${getUserKills()}\n
          //}

          function findRank(rankName, ladderPos, rankDiv) {
            function isMaster(name, div) {
              if (name == "Master") {
                return;
              } else {
                return div;
              }
            }

            if (ladderPos > "750") {
              var rank = "Master";
            } else if (rankName == "Apex Predator") {
              var rank = `[#${ladderPos}] Apex Predator`;
            } else {
              var rank = `${rankName} ${isMaster(rankName, rankDiv)}`;
            }

            return `${getRankBadge(rankName, ladderPos)} ${rank}`;
          }

          // Main Stats Embed
          const statsMain = new Discord.MessageEmbed()
            .setTitle(
              `Stats for ${
                mainResponse.userData.username
              } on ${platformUppercase} playing ${findLegendByID(selectedLegend)}`
            )
            .setDescription(getUserStatus())
            .setColor(legends[mainResponse.accountInfo.active.legend].Color)
            .addField(
              "Account Stats",
              `**Rank**\n${findRank(
                currentRank.name,
                currentRank.ladderPos,
                currentRank.division
              )}\n**Score**\n${formatNumbers(currentRank.score)}`,
              true
            )
            .addField(
              `Account & Season ${season} BattlePass Level`,
              `**Account Level ${accountLevel.toLocaleString()}/500**\n${percentage(
                500,
                getAccountLevel(accountLevel),
                10
              )}\n**BattlePass Level ${getAccountBP(accountBP)}/110**\n${percentage(
                110,
                getAccountBP(accountBP),
                10
              )}`,
              true
            )
            .addField("Currently Equipped Badges", "\u200b")
            .addField(
              badgeTitle(badgeOne.id, findLegendByID(selectedLegend)),
              badgeValue(badgeOne.id, badgeOne.value, findLegendByID(selectedLegend)),
              true
            )
            .addField(
              badgeTitle(badgeTwo.id, findLegendByID(selectedLegend)),
              badgeValue(badgeTwo.id, badgeTwo.value, findLegendByID(selectedLegend)),
              true
            )
            .addField(
              badgeTitle(badgeThree.id, findLegendByID(selectedLegend)),
              badgeValue(badgeThree.id, badgeThree.value, findLegendByID(selectedLegend)),
              true
            )
            .addField("Currently Equipped Trackers", "\u200b")
            .addField(
              `${getTrackerTitle(trackerOne.id, findLegendByID(selectedLegend))}`,
              `${getTrackerValue(trackerOne.id, formatNumbers(trackerOne.value))}`,
              true
            )
            .addField(
              `${getTrackerTitle(trackerTwo.id, findLegendByID(selectedLegend))}`,
              `${getTrackerValue(trackerTwo.id, formatNumbers(trackerTwo.value))}`,
              true
            )
            .addField(
              `${getTrackerTitle(trackerThree.id, findLegendByID(selectedLegend))}`,
              `${getTrackerValue(trackerThree.id, formatNumbers(trackerThree.value))}`,
              true
            )
            .setImage(
              `https://cdn.apexstats.dev/LegendBanners/${findLegendByID(
                selectedLegend
              )}.png?q=${currentTimestamp}`
            )
            .setFooter(
              " Weird tracker/badge name? Let SDCore#1234 know! • BattlePass level 0? Make sure you have the BP Badge equipped!"
            );

          updateKills(userID, userPlatform, selectedLegend, trackerOne.id, trackerOne.value);
          updateKills(userID, userPlatform, selectedLegend, trackerTwo.id, trackerTwo.value);
          updateKills(userID, userPlatform, selectedLegend, trackerThree.id, trackerThree.value);

          msg.delete();
          msg.channel.send(statsMain);
          //});
        })
        .catch((errors) => {
          console.log(`Error: ${errors}`);
          msg.delete();
          message.channel.send(
            "There was an error looking up that username. If you're on PC, try your origin username. If the problem persists, contact support."
          );
        });
    });
  },
};
