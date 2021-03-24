import React, { useEffect } from 'react';
import {Grid} from 'semantic-ui-react';
import ActivityList from './ActivityList';

import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import LoadingComponents from '../../../app/layout/LoadingComponents';
import ActivityFilters from './ActivityFilters';

//were interfaces at thte top of all these removed with mobx

export default observer( function ActivityDashboard() { 
    const {activityStore} = useStore();
    const {loadActivities,activityRegistry} = activityStore;

    useEffect(()  => {
       if(activityRegistry.size <= 1 ) loadActivities();
    }, [activityRegistry.size, loadActivities])
  
    if (activityStore.loadingInitial) return <LoadingComponents content='Loading app' />
  
    return (
        <Grid>
            <Grid.Column width='10'>
                <ActivityList  />
            </Grid.Column>
            <Grid.Column width='6'>
                <ActivityFilters />
            </Grid.Column>

        </Grid>
    )

}
)