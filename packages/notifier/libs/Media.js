class Media {
  constructor(filename) {
    if (filename === undefined || typeof filename !== "string") {
      throw new Error("Invalid media name.");
    }
    this.type = this.getType(filename);
    this.name = this.getName(filename);

    // For shows only
    this.episode;
    this.season;
  }

  getType(filename) {
    const showPattern = /^.*\.[sS][0-9][0-9][eE][0-9][0-9]\..*$/g;
    const seasonPattern = /^.*\.[sS][0-9][0-9]\..*$/g;

    let type;

    if (filename.match(showPattern)) {
      type = "show";
    } else if (filename.match(seasonPattern)) {
      type = "season";
    } else {
      type = "movie";
    }
    console.debug(`Media determined to be of type: ${type}`);
    return type;
  }

  getName(filename) {
    const showPattern = /^[sS][0-9][0-9][eE][0-9][0-9]$/g;
    const seasonPattern = /^[sS][0-9][0-9]$/g;

    let name;
    let nameArray;
    let labelIndex;

    switch (this.type) {
      case "movie":
        name = filename;
        break;
      case "show":
        nameArray = filename.split(".");

        for (const word of nameArray) {
          if (word.match(showPattern)) {
            labelIndex = nameArray.indexOf(word);
            break;
          }
        }
        if (!labelIndex) {
          throw new Error("Could not find matching index");
        }
        name = nameArray.splice(0, labelIndex).join(" ");
        break;
      case "season":
        nameArray = filename.split(".");

        for (const word of nameArray) {
          if (word.match(seasonPattern)) {
            labelIndex = nameArray.indexOf(word);
            break;
          }
        }
        if (!labelIndex) {
          throw new Error("Could not find matching index");
        }
        name = nameArray.splice(0, labelIndex).join(" ");
        break;
      default:
        throw new Error(
          `Not implemented to find media name with type: ${this.type}`
        );
    }

    if (!name) {
      throw new Error("Unable to find media name");
    }
    return name;
  }
}

module.exports = Media;
