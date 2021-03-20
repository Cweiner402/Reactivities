import React, {  useEffect, useState } from 'react';
import axios from 'axios';
import { Container } from 'semantic-ui-react';
import { Activity } from '../models/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import {v4 as uid} from 'uuid';
//import { updateFunctionDeclaration } from 'typescript';
//import { NavBar } from '../layout/NavBar'

function App() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  const [editMode, setEditmode] = useState(false);

  useEffect(()  => {
    axios.get<Activity[]>('http://localhost:5000/api/activities').then(response => {
      setActivities(response.data);
    })
  }, [])

  function handleSelectActivity(id: string){
    setSelectedActivity(activities.find(x => x.id === id));
  }

  function handleCancelSelectActivty(){
    setSelectedActivity(undefined);
  }

  function handleFormOpen(id?: string){
    id ? handleSelectActivity(id) : handleCancelSelectActivty();
    setEditmode(true);
  }

  function handleFormClose(){
    
    setEditmode(false);
  }

  function handleDeleteActivity(id: string){
    setActivities([...activities.filter(x => x.id !== id)])
  }



  function handleCreateOrEditActivity(activity: Activity){
    activity.id 
      ? setActivities([...activities.filter(x => x.id !==activity.id), activity])
      : setActivities([...activities, {...activity, id: uid()}]);
      setEditmode(false);
      setSelectedActivity(activity);
    
  }


  return (
    <>
      <NavBar openForm={handleFormOpen} />
      <Container style={{marginTop: '7em'}}>
        <ActivityDashboard 
          activities={activities} 
          selectedActivity = {selectedActivity}
          selectActivity={handleSelectActivity}
          cancelSelectedActivity={handleCancelSelectActivty}
          editMode={editMode}
          openForm={handleFormOpen}
          closeForm={handleFormClose}
          createOrEdit={handleCreateOrEditActivity}
          deleteActivity={handleDeleteActivity}
        />

      </Container>

        
        
    </>
  );
}

export default App;
