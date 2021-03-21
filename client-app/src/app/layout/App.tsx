import React, {  useEffect, useState } from 'react';
import axios from 'axios';
import { Container } from 'semantic-ui-react';
import { Activity } from '../models/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import {v4 as uid} from 'uuid';
import { Agent } from 'node:https';
import agent from '../api/agent'
import LoadingComponents from '../layout/LoadingComponents'
//import { updateFunctionDeclaration } from 'typescript';
//import { NavBar } from '../layout/NavBar'

function App() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  const [editMode, setEditmode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(()  => {
     agent.Activities.list().then(response => {
      let activities: Activity[] = [];
      response.forEach(activity => {
        activity.date = activity.date.split('T')[0];
        activities.push(activity);
      })
      setActivities(response);
      setLoading(false);
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
    setSubmitting(true);
    agent.Activities.delete(id).then(() => {
      setActivities([...activities.filter(x => x.id !== id)])
      setSubmitting(false);
    })
    
  }



  function handleCreateOrEditActivity(activity: Activity){
    setSubmitting(true);
    if(activity.id ){
      agent.Activities.update(activity).then(() => {
        setActivities([...activities.filter(x => x.id !==activity.id), activity])
        setSelectedActivity(activity);
        setEditmode(false);
        setSubmitting(false);
      })
    }else{
      activity.id = uid();
      agent.Activities.create(activity).then(() =>{
        setActivities([...activities, activity])
        setSelectedActivity(activity);
        setEditmode(false);
        setSubmitting(false);
      })
    }
   
    
  }

  if (loading) return <LoadingComponents content='Loading app' />


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
          submitting={submitting}
        />

      </Container>

        
        
    </>
  );
}

export default App;
