# osm-simple-metrics

Simple metrics calculations for an OSM database

## Installation

After cloning the repo:

Node 18:

```
yarn install
```

or

Docker:

```sh
docker build -t osm-simple-metrics
```

## Commands

```sh
Usage: osm-simple-metrics [options] [command]

CLI to get metrics in an OSM database

Options:
  -h, --help                                display help for command

Commands:
  cumulative_elements [options] <database>  Get nodes, ways, relations, users and changesets count over time
  current_elements [options] <database>     Get current nodes, ways, relations, users and changesets count
  changeset_counts [options] <database>     Get a sorted list of users and their changeset count
  help [command]                            display help for command
```

### Cumulative Elements

```sh
Usage: osm-simple-metrics cumulative_elements [options] <database>

Get nodes, ways, relations, users and changesets count over time

Arguments:
database Database connection string

Options:
-s3, --s3-bucket <s3Bucket> S3 bucket to store the results
-s3region, --s3-region <s3Region> S3 region (default: us-east-1)
-csv, --csv-format Format output as CSV
-h, --help display help for command
```

Sample output:

```sh
node index cumulative_elements postgres://postgres@localhost/osm -csv | head

day,sum_nodes,sum_ways,sum_relations,sum_changesets,sum_users
1362002400000,106234255,1631459,18481,2,2
1363730400000,106235747,1631463,,,
1363816800000,106235783,1631464,,,
1364076000000,106235789,1631466,,,
1364421600000,106235933,1631476,,,
1365800400000,106238539,1631705,,,
1365886800000,106238747,1631841,,,
1365973200000,106239180,1631940,18486,44,15
1366059600000,106239195,1631944,,,
```

### Current Elements

```sh
Usage: osm-simple-metrics current_elements [options] <database>

Get current nodes, ways, relations, users and changesets count

Arguments:
  database                           Database connection string

Options:
  -s3, --s3-bucket <s3Bucket>        S3 bucket to store the results
  -s3region, --s3-region <s3Region>  S3 region (default: us-east-1)
  -csv, --csv-format                 Format output as CSV
  -h, --help                         display help for command
```

Sample output

```sh
node index current_elements postgres://postgres@localhost/osm -csv

node_count,way_count,relation_count,changeset_count,users_count
118659803,2314449,52600,39679,11059
```

### Changeset counts

```sh
Usage: osm-simple-metrics changeset_counts [options] <database>

Get a sorted list of users and their changeset count

Arguments:
  database                           Database connection string

Options:
  -s3, --s3-bucket <s3Bucket>        S3 bucket to store the results
  -s3region, --s3-region <s3Region>  S3 region (default: us-east-1)
  -csv, --csv-format                 Format output as CSV
  -h, --help                         display help for command
```

Sample output

```sh
node index changeset_counts postgres://postgres@localhost/osm -csv | head
count,user_id,display_name
4056,1888,username1
2429,1613,username2
2291,301,username3
```
