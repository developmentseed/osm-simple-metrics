SELECT
  (SELECT COUNT(*) FROM current_nodes) AS node_count,
  (SELECT COUNT(*) FROM current_ways) AS way_count,
  (SELECT COUNT(*) FROM current_relations) AS relation_count,
  (SELECT COUNT(*) FROM changesets) AS changeset_count,
  (SELECT COUNT(*) FROM users) AS users_count;
