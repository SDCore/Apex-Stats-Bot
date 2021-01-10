const { Discord } = require("../ApexStats.js");
const axios = require("axios");

var { DateTime } = require("luxon");

module.exports = {
  name: "map",
  description: "Shows the current and next in-game map in rotation.",
  execute(message) {
    message.channel
      .send("Getting current in-game map rotation schedule...")
      .then(async (msg) => {
        axios
          .get("https://fn.alphaleagues.com/v1/apex/map/?next=1")
          .then((result) => {
            var map = result.data;
            var nextMap = map.next[0];
            var currentTimestamp = Math.floor(DateTime.local().toFormat("ooo"));

            function mapImage(name) {
              var maps = [
                // Current list of in-game maps
                // "Kings Canyon",
                "World's Edge",
                "Olympus",
              ];

              if (name.includes("Olympus")) {
                var mapName = "Olympus";
              } else if (name.includes("World's")) {
                var mapName = "World's Edge";
              } else {
                var mapName = name;
              }

              if (maps.indexOf(mapName) != -1) {
                if (mapName == "World's Edge") {
                  return "WorldsEdge";
                }

                return mapName;
              } else {
                return "NoMapData";
              }
            }

            function time(seconds) {
              var currentDate = DateTime.local();
              var futureDate = DateTime.local().plus({
                seconds: seconds,
              });

              var timeTill = futureDate.diff(currentDate, [
                "hours",
                "minutes",
                "seconds",
              ]);

              var finalTime = timeTill.toObject();

              const pluralize = (count, noun, suffix = "s") =>
                `${count} ${noun}${count !== 1 ? suffix : ""}`;

              return `${pluralize(finalTime.hours, "hour")}, ${pluralize(
                finalTime.minutes,
                "minute"
              )}`;
            }

            const mapEmbed = new Discord.MessageEmbed()
              .setDescription(
                `The current map is **${map.map}**.\nThe next map is **${
                  nextMap.map
                }** in **${time(
                  map.times.remaining.seconds
                )}** which will last for **${nextMap.duration} minutes**.`
              )
              .setImage(
                `https://sdcore.dev/cdn/ApexStats/Maps/${mapImage(
                  map.map
                )}.png?q=${currentTimestamp}`
              );

            msg.delete();
            msg.channel.send(mapEmbed);
          })
          .catch((err) => {
            msg.delete();
            msg.channel.send(
              "Could not retreive in-game map rotation schedule. Please try again later."
            );
            console.log(err);
          });
      });
  },
};
