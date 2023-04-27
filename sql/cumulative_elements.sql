with nodes as (
select date_trunc('day', closed_at) as day,
count(1)
from nodes left join changesets on changesets.id = nodes.changeset_id
where closed_at >= '2013-01-01'::date
group by 1
), ways as (
select date_trunc('day', closed_at) as day,
count(1)
from ways left join changesets on changesets.id = ways.changeset_id
where closed_at >= '2013-01-01'::date
group by 1
),
relations as (
select date_trunc('day', closed_at) as day,
count(1)
from relations left join changesets on changesets.id = relations.changeset_id
where closed_at >= '2013-01-01'::date
group by 1
),
changeset_count as (
select date_trunc('day', closed_at) as day,
count(1)
from changesets
where closed_at >= '2013-01-01'::date
group by 1
),
users as (
select date_trunc('day', creation_time) as day,
count(1)
from users
where creation_time >= '2013-01-01'::date
group by 1
),
cumulative_nodes as (
select
  day,
  sum(count) over (order by day asc rows between unbounded preceding and current row) as sum_nodes
  from nodes
),
cumulative_ways as (
select
  day,
  sum(count) over (order by day asc rows between unbounded preceding and current row) as sum_ways
  from ways
),
cumulative_relations as (
select
  day,
  sum(count) over (order by day asc rows between unbounded preceding and current row) as sum_relations
  from relations
),
cumulative_changesets as (
select
  day,
  sum(count) over (order by day asc rows between unbounded preceding and current row) as sum_changesets
  from changeset_count
),
cumulative_users as (
select 
  day,
  sum(count) over (order by day asc rows between unbounded preceding and current row) as sum_users
  from users
)
select cumulative_nodes.day, 
sum_nodes, 
max(sum_ways) over (order by day asc rows between unbounded preceding and current row) as sum_ways, 
max(sum_relations) over (order by day asc rows between unbounded preceding and current row) as sum_relations, 
max(sum_changesets) over (order by day asc rows between unbounded preceding and current row) as sum_changesets, 
max(sum_users) over (order by day asc rows between unbounded preceding and current row) as sum_users from cumulative_nodes 
left join cumulative_ways using (day)
left join cumulative_relations using (day)
left join cumulative_changesets using (day)
left join cumulative_users using (day)