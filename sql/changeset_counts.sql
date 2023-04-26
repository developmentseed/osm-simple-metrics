select count(changesets.id), user_id, users.display_name 
from changesets join users on users.id=changesets.user_id 
group by user_id, display_name order by count desc