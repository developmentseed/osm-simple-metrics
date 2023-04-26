const { TinyPg } = require("tinypg");
const { program } = require("commander");
const { stringify } = require("csv-stringify/sync");
const { S3 } = require("@aws-sdk/client-s3");

function addOptionsToCommand(command) {
  command
    .argument("<database>", "Database connection string")
    .option("-s3, --s3-bucket <s3Bucket>", "S3 bucket to store the results")
    .option(
      "-s3region, --s3-region <s3Region>",
      "S3 region (default: us-east-1)"
    )
    .option("-csv, --csv-format", "Format output as CSV");
}

/**
 * Add JSON rows to S3
 *
 * @param {String} bucket - S3 bucket name
 * @param {String} key - S3 key
 * @param {String} data - data
 * @returns
 */
function addToS3(bucket, key, data, region = "us-east-1") {
  const s3 = new S3({ region });
  return s3.putObject({
    Bucket: bucket,
    Key: key,
    Body: data,
  });
}

/**
 * Program action
 *
 * @param {String} action - SQL action to run
 * @param {*} columns - Columns of the SQL action
 * @param {*} database - Database connection string
 * @param {*} options - CLI options
 */
async function programAction(action, columns, database, options) {
  const tinypg = new TinyPg({ root_dir: "sql", connection_string: database });
  const { rows } = await tinypg.sql(action);
  let data = JSON.stringify(rows);

  if (options.csvFormat) {
    const csvData = stringify(
      rows.map((row) => {
        let keys = [];
        for (column of columns) {
          keys.push(row[column]);
        }
        return keys;
      }),
      { header: true, columns }
    );

    data = csvData;
  }

  if (options.s3Bucket) {
    try {
      let fileName = options.csvFormat ? `${action}.csv` : `${action}.json`;
      await addToS3(options.s3Bucket, fileName, data, options.s3Region);
    } catch (error) {
      console.error("Could not add to S3", error);
    }
  } else {
    // write data to stdout
    console.log(data);
  }

  // close connection
  await tinypg.close();
}

program
  .name("osm-simple-metrics")
  .description("CLI to get metrics in an OSM database");

const cumulativeElementsCommand = program
  .command("cumulative_elements")
  .description(
    "Get nodes, ways, relations, users and changesets count over time"
  )
  .action(async (database, options) => {
    const columns = [
      "day",
      "sum_nodes",
      "sum_ways",
      "sum_relations",
      "sum_changesets",
      "sum_users",
    ];
    await programAction("cumulative_elements", columns, database, options);
  });

const currentElementsCommand = program
  .command("current_elements")
  .description("Get current nodes, ways, relations, users and changesets count")
  .action(async (database, options) => {
    const columns = [
      "node_count",
      "way_count",
      "relation_count",
      "changeset_count",
      "users_count",
    ];
    await programAction("current_elements", columns, database, options);
  });

const changesetCountsCommand = program
  .command("changeset_counts")
  .action(async (database, options) => {
    const columns = ["count", "user_id", "display_name"];
    await programAction("changeset_counts", columns, database, options);
  });

addOptionsToCommand(cumulativeElementsCommand);
addOptionsToCommand(currentElementsCommand);
addOptionsToCommand(changesetCountsCommand);

program.parse();
